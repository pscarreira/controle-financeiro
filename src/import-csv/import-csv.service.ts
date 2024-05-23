import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FinancialTransactionService } from 'src/financial-transaction/financial-transaction.service';
import { removeDateTimeZone } from 'src/common/utils/date.utils';

@Injectable()
export class ImportCsvService {
  constructor(private ftService: FinancialTransactionService) {}

  async readCSV(file: Express.Multer.File): Promise<any> {
    const fileBuffer = file.buffer;
    const fileContent = fileBuffer.toString('utf8');
    return fileContent;
  }

  private isValidTransaction(values: string[]): boolean {
    if (values.length < 7) {
      return false;
    }

    const hasEmptyOrNull = values.some(
      (value) => value === '' || value === null,
    );
    if (hasEmptyOrNull) {
      return false;
    }

    return true;
  }

  private createTransaction(
    values: string[],
  ): Prisma.FinancialTransactionCreateInput {
    const [
      origin_bank,
      origin_branch,
      origin_account,
      destination_bank,
      destination_branch,
      destination_account,
      amount,
      date,
    ] = values;
    return {
      origin_bank,
      origin_branch,
      origin_account,
      destination_bank,
      destination_branch,
      destination_account,
      amount: parseFloat(amount),
      date: removeDateTimeZone(new Date(date)),
    };
  }

  async importTransactions(file: Express.Multer.File): Promise<any> {
    const content = await this.readCSV(file);

    if (content === '') {
      throw new Error('Empty file');
    }

    const lines = content.split('\n');
    const firstTransactionDate = removeDateTimeZone(
      new Date(lines[0].split(',')[7]),
    );

    // Getting the valid range of dates for transactions
    const startDtOfTransactions = removeDateTimeZone(
      new Date(firstTransactionDate.setHours(0, 0, 0, 0)),
    );
    const endDtOfTransactions = removeDateTimeZone(
      new Date(firstTransactionDate.setHours(23, 59, 59, 999)),
    );

    if (
      await this.ftService.existsTransactionOnDate(
        startDtOfTransactions,
        endDtOfTransactions,
      )
    ) {
      throw new Error(
        'There is already other transactions registered on the same date',
      );
    }

    const transactionsToCreate: Prisma.FinancialTransactionCreateManyInput[] =
      [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const values = line.split(',');

      if (!this.isValidTransaction(values)) {
        continue;
      }

      const date = removeDateTimeZone(new Date(values[7]));

      if (
        date.getTime() < startDtOfTransactions.getTime() ||
        date.getTime() > endDtOfTransactions.getTime()
      ) {
        continue;
      }

      const transaction = this.createTransaction(values);
      transactionsToCreate.push(transaction);
    }

    const savedTransactions =
      await this.ftService.createMany(transactionsToCreate);

    return savedTransactions;
  }
}
