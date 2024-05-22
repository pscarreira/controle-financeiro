import { Module } from '@nestjs/common';
import { ImportCsvController } from './import-csv/import-csv.controller';
import { ImportCsvService } from './import-csv/import-csv.service';

@Module({
  imports: [],
  controllers: [ImportCsvController],
  providers: [ImportCsvService],
})
export class AppModule {}
