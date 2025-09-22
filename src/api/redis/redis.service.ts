// src/redis/redis.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({
      username: "default",
      password: "BK2huYfj7ARGLw1IiKwUWHim8oymvNfR",
      socket: {
        host: "redis-16381.c15.us-east-1-2.ec2.redns.redis-cloud.com",
        port: 16381,
        tls: true,   // 👈 force TLS for Redis Cloud
      },
    });

    this.client.on("error", (err) => console.error("Redis Client Error", err));
    await this.client.connect();
    console.log("✅ Connected to Redis Cloud");
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }

  async saveMessage(sessionId: string, message: any) {
    await this.client.rPush(`chat:${sessionId}`, JSON.stringify(message));
  }

  async getMessages(sessionId: string, limit = 20) {
    const msgs = await this.client.lRange(`chat:${sessionId}`, -limit, -1);
    return msgs.map((m) => JSON.parse(m));
  }
}
