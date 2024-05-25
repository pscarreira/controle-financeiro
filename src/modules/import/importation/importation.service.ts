import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

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
