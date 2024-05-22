import { Test, TestingModule } from '@nestjs/testing';
import { ImportCsvService } from './import-csv.service';

describe('ImportCsvService', () => {
  let service: ImportCsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportCsvService],
    }).compile();

    service = module.get<ImportCsvService>(ImportCsvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
