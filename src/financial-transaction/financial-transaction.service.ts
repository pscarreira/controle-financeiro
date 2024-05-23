import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { FinancialTransaction, Prisma } from '@prisma/client';

@Injectable()
export class FinancialTransactionService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.FinancialTransactionCreateInput,
  ): Promise<FinancialTransaction> {
    return await this.prisma.financialTransaction.create({ data });
  }

  async createMany(
    data: Prisma.FinancialTransactionCreateManyInput[],
  ): Promise<Prisma.BatchPayload> {
    return await this.prisma.financialTransaction.createMany({ data });
  }

  // function to validate if exists a transaction on the same date
  async existsTransactionOnDate(
    dateStart: Date,
    dateFinal: Date,
  ): Promise<boolean> {
    const transaction = await this.prisma.financialTransaction.findFirst({
      where: { date: { gte: dateStart, lte: dateFinal } },
    });
    return transaction ? true : false;
  }
}
