// src/api/email/dto/send-email.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  to: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  template: string;

  @IsOptional()
  context?: Record<string, any>;  
}
