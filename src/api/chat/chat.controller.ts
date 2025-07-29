import { Controller, Post, Body, Logger, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('chat')
export class ChatController {
  logger: Logger;

  constructor(private readonly chatService: ChatService) {
    this.logger = new Logger(ChatController.name);
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async passMessageToLLM(@Body() body: any , @UploadedFiles() file: File): Promise<any> {   
    const message = body.message;    
    return this.chatService.passMessageToLLM(message, file);
  }
}
