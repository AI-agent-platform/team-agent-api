import { Injectable } from "@nestjs/common";
import LakeraGuardConfig from "src/configurations/lakeraConfig";

@Injectable()
export class ChatService {
  async passMessageToLLM(message: string, file?: File): Promise<any> {
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

        return {
          allowed: true,
          message: "✅ Your message is safe.",
        };
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
