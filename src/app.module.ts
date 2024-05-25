// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';
import { ImportModule } from './modules/import/import.module';

@Module({
  imports: [PrismaModule, ImportModule],
})
export class AppModule {}
