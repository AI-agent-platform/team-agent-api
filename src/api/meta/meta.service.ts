import { Injectable } from "@nestjs/common";
import { ChatService } from "../chat/chat.service";
import { AgentTypes } from "src/constants/agent-types";
import axios from "axios";

@Injectable()
export class MetaService {
  constructor(private readonly chatService: ChatService) {}

  async processWebhookEvent(body: any) {
    try {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];
      const metadata = changes?.value?.metadata;

      if (!message) return { status: "ignored" };

      const from = message.from;
      const text = message.text?.body;

      console.log(`📩 Message from ${from}: ${text}`);

      const aiResponse = await this.chatService.passMessageToLLM(
        from,
        text,
        "68f6070333a8c53944475b3b", //TODO: Replace with dynamic business ID
        AgentTypes.customer_agent
      );

      await this.sendWhatsAppMessage(from, aiResponse.answer);

      return { status: "success" };
    } catch (err) {
      console.error("❌ Error processing webhook:", err);
      return { status: "error" };
    }
  }

  private async sendWhatsAppMessage(to: string, message: string) {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_ACCESS_TOKEN;

    await axios.post(
      `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ Sent reply to ${to}: ${message}`);
  }
}
