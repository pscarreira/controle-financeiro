import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ImportationService {
  constructor(private prisma: PrismaService) {}

  async createImportation(importation: Prisma.ImportationCreateInput) {
    return this.prisma.importation.create({ data: importation });
  }

  async getImportations() {
    return this.prisma.importation.findMany();
  }
}
