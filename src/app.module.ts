import { Module } from '@nestjs/common';
import { ImportCsvController } from './import-csv/import-csv.controller';
import { ImportCsvService } from './import-csv/import-csv.service';
import { PrismaService } from './common/prisma.service';
import { FinancialTransactionService } from './financial-transaction/financial-transaction.service';

@Module({
  imports: [],
  controllers: [ImportCsvController],
  providers: [ImportCsvService, FinancialTransactionService, PrismaService],
})
export class AppModule {}
