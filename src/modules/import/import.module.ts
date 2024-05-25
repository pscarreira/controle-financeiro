import { FinancialTransactionService } from './../../financial-transaction/financial-transaction.service';
import { Module } from '@nestjs/common';
import { ImportCsvController } from './import-csv/import-csv.controller';
import { ImportCsvService } from './import-csv/import-csv.service';
import { ImportationController } from './importation/importation.controller';
import { ImportationService } from './importation/importation.service';

@Module({
  imports: [],
  controllers: [ImportCsvController, ImportationController],
  providers: [
    ImportCsvService,
    ImportationService,
    FinancialTransactionService,
  ],
})
export class ImportModule {}
