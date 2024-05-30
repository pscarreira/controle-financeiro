import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FinancialTransactionService } from 'src/financial-transaction/financial-transaction.service';
import { removeDateTimeZone } from 'src/common/utils/date.utils';
import { readCSV } from 'src/common/utils/csv.utils';
import { ImportationService } from '../importation/importation.service';

const TRANSACTION_DATA_LENGTH = 8;
const DATE_INDEX = 7;

@Injectable()
export class ImportCsvService {
  constructor(
    private ftService: FinancialTransactionService,
    private impService: ImportationService,
  ) {}

  private isValidTransactionData(values: string[]): boolean {
    if (values.length < TRANSACTION_DATA_LENGTH) {
      return false;
    }

    return !values.some((value) => value === '' || value === null);
  }

  private isDateWithinRange(date: Date, start: Date, end: Date): boolean {
    return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
  }

  private createTransaction(
    values: string[],
    importationId: number,
  ): Prisma.FinancialTransactionCreateManyInput {
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
      importationId: importationId,
    };
  }

  private async createImportation(date: Date, userId: number) {
    return await this.impService.createImportation({
      transactions_date: date,
      created_at: removeDateTimeZone(new Date()),
      User: {
        connect: {
          id: userId,
        },
      },
    });
  }

  private async validateFileContent(content: string) {
    if (content === '') {
      throw new BadRequestException('Empty file');
    }
  }

  private async validateTransactionDate(start: Date, end: Date) {
    if (await this.ftService.existsTransactionOnDate(start, end)) {
      throw new BadRequestException(
        'There is already other transactions registered on the same date',
      );
    }
  }

  async importTransactions(
    file: Express.Multer.File,
    userId: number,
  ): Promise<any> {
    const content = await readCSV(file);

    await this.validateFileContent(content);

    const lines = content.split('\n');
    const firstTransactionDate = removeDateTimeZone(
      new Date(lines[0].split(',')[DATE_INDEX]),
    );

    // Getting the valid range of dates for transactions
    const startDtOfTransactions = removeDateTimeZone(
      new Date(firstTransactionDate.setHours(0, 0, 0, 0)),
    );
    const endDtOfTransactions = removeDateTimeZone(
      new Date(firstTransactionDate.setHours(23, 59, 59, 999)),
    );

    await this.validateTransactionDate(
      startDtOfTransactions,
      endDtOfTransactions,
    );

    const importation = await this.createImportation(
      firstTransactionDate,
      userId,
    );

    const transactionsToCreate: Prisma.FinancialTransactionCreateManyInput[] =
      [];

    for (let i = 0; i < lines.length; i++) {
      const values = lines[i].split(',');

      if (!this.isValidTransactionData(values)) {
        continue;
      }

      const date = removeDateTimeZone(new Date(values[7]));

      if (
        !this.isDateWithinRange(
          date,
          startDtOfTransactions,
          endDtOfTransactions,
        )
      ) {
        continue;
      }

      const transaction = this.createTransaction(values, importation.id);
      transactionsToCreate.push(transaction);
    }

    const savedTransactions =
      await this.ftService.createMany(transactionsToCreate);

    return savedTransactions;
  }
}
