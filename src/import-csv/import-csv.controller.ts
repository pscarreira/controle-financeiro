import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportCsvService } from './import-csv.service';

@Controller('import-csv')
export class ImportCsvController {
  constructor(private service: ImportCsvService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000,
            message: 'File size too large',
          }),
          new FileTypeValidator({
            fileType: 'text/csv',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const result = await this.service.importTransactions(file);
      return { message: 'File uploaded successfully', content: result };
    } catch (error: any) {
      return { message: 'Error importing file', error: error.message };
    }
  }
}
