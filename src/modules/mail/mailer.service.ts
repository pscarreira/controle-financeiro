import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(to: string, password: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      from: 'Financeiro <financeiro@gmail.com>',
      subject: 'Bem-vindo ao Financeiro',
      template: 'welcome',
      context: {
        password,
      },
    });
  }
}
