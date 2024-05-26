import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mailer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule], // Add ConfigModule here
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: 465,
          secure: true,
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('APP_PASS'),
          },
        },
        defaults: {
          from: '"Financeiro" <financeiro@gmail.com>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
})
export class MailModule {}
