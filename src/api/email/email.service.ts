// src/api/email/email.service.ts
import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import * as path from "path";
import { readFile } from "fs/promises";
import emailConfig from "src/configurations/emailConfig";

@Injectable()
export class EmailService {
  private transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.smtpHost,
      port: emailConfig.smtpPort,
      secure: true,
      auth: {
        user: emailConfig.smtpUser,
        pass: emailConfig.smtpPass,
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
