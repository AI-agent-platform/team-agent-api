import { IsEmail, IsString, MinLength } from 'class-validator';

export class ChatMessageDto {
//   @IsString()
//   userId: string;

  @IsString()  
   message: string;
} 