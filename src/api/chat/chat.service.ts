import { Injectable } from "@nestjs/common";
import LakeraGuardConfig from "src/configurations/lakeraConfig";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class ChatService {
  constructor(private redisService: RedisService) {}
  async passMessageToLLM(
    sessionId: string,
    message: string,
    file?: File
  ): Promise<any> {
    try {
      // No file: Perform content moderation via Lakera
      if (!file) {
        const response = await fetch("https://api.lakera.ai/v2/guard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LakeraGuardConfig.apiKey}`,
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: message }],
          }),
        });

        const data = await response.json();

        if (data.flagged) {
          return {
            allowed: false,
            message:
              "🚫 Your message has been flagged as harmful or inappropriate.",
          };
        }

        const pastMessages = await this.redisService.getMessages(sessionId, 10);
        await this.redisService.saveMessage(sessionId, {
          role: "user",
          content: message,
        });

        const fastApiResp = await fetch("http://localhost:8000/v1/qna", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_uuid: "alankulama123456",
            conversation: [...pastMessages, { role: "user", content: message }],
          }),
        });
        const fastApiData = await fastApiResp.json();

        // 5. Save bot reply
        await this.redisService.saveMessage(sessionId, {
          role: "bot",
          content: fastApiData.answer,
        });

        return { allowed: true, message: fastApiData.answer };
      } else {
        //pass file directly
      }
    } catch (error) {
      console.error("Lakera API Error:", error);
      return {
        allowed: false,
        message: "❌ Error contacting moderation service.",
      };
    }
  }
}
