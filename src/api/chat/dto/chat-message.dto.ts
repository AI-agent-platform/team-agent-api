import { IsEmail, IsString, MinLength } from "class-validator";
import { Agent } from "http";
import { AgentTypes } from "src/constants/agent-types";

export class IncomingChatMessageDto {
  @IsString()
  message: string;
  @IsString()
  sessionId: string;

  @IsString()
  company_uuid: string;

  @IsString()
  top_k: number;

  @IsString()
  type?: AgentTypes;

  file?: File;
}
