import { MailTypeEnum } from '../enums/email.enum';
import Mail = require('nodemailer/lib/mailer');

type UrlTags = {
    url: string;
};

type SendVerificationTags = {
    otp: string;
};

type SignUpTags = {
    name: string;
    orgName: string;
    resetUrl?: string;
};

type NotificationTags = {
    name: string;
    userName: string;
    note: string;
};

export interface InvoiceEmailItemsI {
    id: number;
    invoiceId: number;
    noPayrollUsers?: number;
    discountPercentage?: number;
    totalAmount: string;
    details?: string;
    amount: string;
    unitPrice?: string;
}

export enum EmailTypeEnum {
    INVOICE = 'INVOICE',
    PAYSLIP = 'PAYSLIP',
}
type EmailType<Type, TagOptions> = {
    type: Type;
    tagsOptions: TagOptions;
    subject: string;
    toEmail: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: Mail.Attachment[];
    emailType?: EmailTypeEnum;
};

export type EmailTemplateOption =
    | EmailType<MailTypeEnum.SEND_VERIFICATION, SendVerificationTags>
    | EmailType<MailTypeEnum.FORGOT_PASSWORD_VERIFICATION, SendVerificationTags>
    | EmailType<MailTypeEnum.RESET_PASSWORD, UrlTags>
    | EmailType<MailTypeEnum.TEST_EMAIL, { email: string }>
    | EmailType<MailTypeEnum.SIGN_UP_INVITATION, { email: string; orgName: string }>
    | EmailType<MailTypeEnum.ORG_ADDED_NOTIFICATION, { email: string; orgName: string; name: string; reqUrl: string }>;
