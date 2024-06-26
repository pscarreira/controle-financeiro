import { Controller, Get, Param } from '@nestjs/common';
import { ImportationService } from './importation.service';

@Controller('importation')
export class ImportationController {
  constructor(private service: ImportationService) {}

  @Get()
  async getImportations() {
    return await this.service.getImportations();
  }

  @Get('details/:id')
  async getImportationDetails(@Param('id') id: number) {
    return await this.service.getImportationDetails(id);
  }
}
