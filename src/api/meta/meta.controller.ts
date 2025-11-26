import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Res,
  HttpCode,
} from "@nestjs/common";
import { MetaService } from "./meta.service";

@Controller("meta")
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  // Meta webhook verification
  @Get("webhook")
  verifyWebhook(@Query() query, @Res() res) {
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
    const mode = query["hub.mode"];
    const token = query["hub.verify_token"];
    const challenge = query["hub.challenge"];

    if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Meta webhook verified");
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  // Handle incoming WhatsApp messages
  @Post("webhook")
  @HttpCode(200)
  async handleWebhook(@Body() body) {
    return this.metaService.processWebhookEvent(body);
  }
}
