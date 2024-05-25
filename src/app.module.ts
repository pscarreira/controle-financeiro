// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';
import { ImportModule } from './modules/import/import.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, ImportModule, UserModule],
})
export class AppModule {}
