// src/redis/redis.service.ts
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { createClient } from "redis";

import * as dotenv from "dotenv";
dotenv.config();

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: ReturnType<typeof createClient>;
  private readonly logger = new Logger(RedisService.name);

  async onModuleInit() {
    this.client = createClient({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    });

    this.client.on("error", (err) =>
      this.logger.error("Redis Client Error", err)
    );

    // Connect without blocking app startup
    this.client
      .connect()
      .then(() => this.logger.log("✅ Connected to Redis Cloud"))
      .catch((err) => this.logger.error("❌ Failed to connect to Redis", err));
  }

  async onModuleDestroy() {
    if (this.client.isOpen) {
      await this.client.disconnect();
      this.logger.log("Redis client disconnected");
    }
  }

  async saveMessage(sessionId: string, message: any) {
    if (!this.client.isOpen) return;
    await this.client.rPush(`chat:${sessionId}`, JSON.stringify(message));
  }

  async getMessages(sessionId: string, limit = 20) {
    if (!this.client.isOpen) return [];

    const msgs = await this.client.lRange(`chat:${sessionId}`, -limit, -1);

    return msgs.map((m) => {
      const str = typeof m === "string" ? m : m.toString();
      return JSON.parse(str);
    });
  }
}
