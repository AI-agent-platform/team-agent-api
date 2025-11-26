import { Module } from '@nestjs/common';
import { MetaController } from './meta.controller';
import { MetaService } from './meta.service';
import { RedisService } from '../redis/redis.service';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [ChatModule], 
  controllers: [MetaController],
  providers: [MetaService, RedisService],
  exports: [MetaService]
})
export class MetaModule {}
