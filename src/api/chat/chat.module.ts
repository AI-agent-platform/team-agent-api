// chat.module.ts
import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { RedisService } from '../redis/redis.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, RedisService],
})
export class ChatModule {}
