import { Controller, Get } from '@nestjs/common';
import { ImportationService } from './importation.service';

@Controller('importation')
export class ImportationController {
  constructor(private service: ImportationService) {}

  @Get()
  async getImportations() {
    return await this.service.getImportations();
  }
}
