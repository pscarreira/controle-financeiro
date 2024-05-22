import { Injectable } from '@nestjs/common';

@Injectable()
export class ImportCsvService {
  async readCSV(file: Express.Multer.File): Promise<any> {
    const fileBuffer = file.buffer;
    const fileContent = fileBuffer.toString('utf8');
    return fileContent;
  }
}
