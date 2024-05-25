import { Module } from '@nestjs/common';
import { ImportCsvController } from './import-csv/import-csv.controller';
import { ImportCsvService } from './import-csv/import-csv.service';
import { PrismaService } from './common/prisma.service';
import { FinancialTransactionService } from './financial-transaction/financial-transaction.service';
import { ImportationService } from './importation/importation.service';
import { ImportationController } from './importation/importation.controller';

@Module({
  imports: [],
  controllers: [ImportCsvController, ImportationController],
  providers: [
    ImportCsvService,
    FinancialTransactionService,
    PrismaService,
    ImportationService,
  ],
})
export class AppModule {}
