import { IsEmail, IsString, MinLength } from "class-validator";

export class IncomingChatMessageDto {
  @IsString()
  message: string;
  @IsString()
  sessionId: string;
  file?: File;
}
