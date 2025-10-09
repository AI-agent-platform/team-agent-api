import * as config from "config";

type EmailConfig = {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
};

const emailConfiguration = config.has("email")
  ? config.get<EmailConfig>("email")
  : {
      smtpHost: "",
      smtpPort: 465,
      smtpUser: "agentAI@gmail.com",
      smtpPass: undefined,
    };

export const emailConfig: EmailConfig = {
  smtpHost: emailConfiguration?.smtpHost,
  smtpPort: emailConfiguration?.smtpPort,
  smtpUser: emailConfiguration?.smtpUser,
  smtpPass: emailConfiguration?.smtpPass,
};

export default emailConfig;
