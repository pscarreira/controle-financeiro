import { Test, TestingModule } from '@nestjs/testing';
import { ImportCsvController } from './import-csv.controller';

describe('ImportCsvController', () => {
  let controller: ImportCsvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportCsvController],
    }).compile();

    controller = module.get<ImportCsvController>(ImportCsvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
