// src/api/email/email.service.ts
import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import * as path from "path";
import { readFile } from "fs/promises";

import * as dotenv from "dotenv";
dotenv.config();

@Injectable()
export class EmailService {
  private transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {   
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST,
      port: process.env.EMAIL_SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private getTemplatePath(templateName: string): string {
    return path.join(
      process.cwd(),
      "src",
      "api",
      "email",
      "templates",
      `${templateName}.html`
    );
  }

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any> = {}
  ): Promise<void> {
    try {
      const templatePath = this.getTemplatePath(template);
      const templateSource = await readFile(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate(context);

      await this.transporter.sendMail({        
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      });

      console.log(`Email sent to ${to} with subject "${subject}"`);
    } catch (err) {
      console.error(`Failed to send email to ${to}: ${err.message}`);
      throw err;
    }
  }
}
