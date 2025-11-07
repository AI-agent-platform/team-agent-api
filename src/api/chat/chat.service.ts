import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";
import { AgentTypes } from "src/constants/agent-types";

import * as dotenv from "dotenv";
dotenv.config();

@Injectable()
export class ChatService {
  constructor(private redisService: RedisService) {}
  async passMessageToLLM(
    sessionId: string,
    message: string,
    company_uuid: string,
    type: AgentTypes,
    top_k?: number,
    file?: File
  ): Promise<any> {
    try {
      let fastApiResp = null;

      // No file: Perform content moderation via Lakera
      // if (!file) {
      // const response = await fetch("https://api.lakera.ai/v2/guard", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${process.env.LAKERA_GUARD_API_KEY}`,
      //   },
      //   body: JSON.stringify({
      //     messages: [{ role: "user", content: message }],
      //   }),
      // });

      // const data = await response.json();

      // if (data.flagged) {
      //   return {
      //     allowed: false,
      //     message:
      //       "Your message has been flagged as harmful or inappropriate.",
      //   };
      // }
      const history = await this.redisService.getMessages(sessionId, 10);
     
      await this.redisService.saveMessage(sessionId, {
        role: "user",
        content: message,
      });

      if (type === AgentTypes.customer_agent) {
        try {
          fastApiResp = await fetch(process.env.AGENT_CUSTOMER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              company_uuid: company_uuid,
              question: message,
              top_k: 5,
            }),
          });
        
        } catch (err) {
          console.error("Error calling /v1/qna:", err);
          return {
            allowed: false,
            message: "Failed to contact QnA service.",
          };
        }
      } else {
        try {
          
          fastApiResp = await fetch(process.env.AGENT_BUSINESS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              company_uuid: company_uuid,
              prompt: message,
            }),
          });
          console.log("🚀 ~ ChatService ~ passMessageToLLM ~ fastApiResp:", fastApiResp)
          
         
        } catch (err) {
          console.error("Error calling /v1/businesses/update:", err);
          return { allowed: false, message: " Failed to update business." };
        }
      }
      const fastApiData = await fastApiResp.json();

      // Save bot reply
      await this.redisService.saveMessage(sessionId, {
        role: "bot",
        content: fastApiData.answer,
      });

      return { allowed: true, answer: fastApiData.answer };
      // } else {
      //   //pass file directly
      // }
    } catch (error) {
      console.error("Lakera API Error:", error);
      return {
        allowed: false,
        message: "Error contacting moderation service.",
      };
    }
  }
}
