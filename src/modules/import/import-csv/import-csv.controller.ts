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
import { IdentifyUser } from 'src/common/decorators/identify-user.decorator';

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
    @IdentifyUser() userId: number,
  ) {
    const result = await this.service.importTransactions(file, userId);
    return { message: 'File uploaded successfully', content: result };
  }
}
