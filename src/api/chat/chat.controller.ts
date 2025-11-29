import {
  Controller,
  Post,
  Body,
  Logger,
  UseInterceptors,
  UploadedFiles,
  Get,
  Query,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { IncomingChatMessageDto } from "./dto/chat-message.dto";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { RedisService } from "../redis/redis.service";

@Controller("chat")
export class ChatController {
  logger: Logger;

  constructor(
    private redisService: RedisService,
    private readonly chatService: ChatService
  ) {
    this.chatService = chatService;
    this.logger = new Logger(ChatController.name);
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async passMessageToLLM(
    @Body() body: IncomingChatMessageDto,
    @UploadedFiles() file: Express.Multer.File
  ): Promise<any> {    
    return this.chatService.passMessageToLLM(
      body.sessionId,
      body.message,
      body.company_uuid,
      body.type,
      body.top_k,
      file
    );
  }

  @Get("history")
  async getHistory(@Query("sessionId") sessionId: string) {
    return this.redisService.getMessages(sessionId, 20);
  }
}
