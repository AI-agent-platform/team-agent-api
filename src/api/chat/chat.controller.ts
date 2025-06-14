import {
  Controller,
  Post,
  Logger,
  Request,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatMessageDto } from './dto/chat-message.dto';

@Controller('chat')
export class ChatController {
  logger: Logger;
  constructor(
    private readonly chatService: ChatService,
  ) {
    this.logger = new Logger(ChatController.name);
  }

   @Post()
    async passMessageToLLM(@Body() ChatMessage: ChatMessageDto): Promise<any> {
    return this.chatService.passMessageToLLM(ChatMessage.message);
  }

}
