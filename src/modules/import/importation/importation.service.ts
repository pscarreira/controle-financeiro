import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class ImportationService {
  constructor(private prisma: PrismaService) {}

  async createImportation(
    importation: Prisma.ImportationCreateInput,
  ): Promise<any> {
    return await this.prisma.importation.create({ data: importation });
  }

  async getImportations() {
    return await this.prisma.importation.findMany();
  }

  async getImportationDetails(importation_id: number) {
    return await this.prisma.importation.findUnique({
      where: { id: Number(importation_id) },
      include: {
        transactions: {
          select: {
            origin_bank: true,
            origin_branch: true,
            origin_account: true,
            destination_bank: true,
            destination_branch: true,
            destination_account: true,
            amount: true,
            date: true,
          },
        },
      },
    });
  }
}
