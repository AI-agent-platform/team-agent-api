// src/api/email/email.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    const { to, subject, template, context } = sendEmailDto;
    await this.emailService.sendEmail(to, subject, template, context);
    return { status: 'success', message: `Email sent to ${to}` };
  }
}
