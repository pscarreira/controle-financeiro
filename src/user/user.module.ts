import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailService } from 'src/modules/mail/mailer.service';
import { MailModule } from 'src/modules/mail/mailer.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [MailModule],
  controllers: [UserController],
  providers: [UserService, MailService, ConfigService],
})
export class UserModule {}
