import { Injectable } from '@nestjs/common';
import LakeraGuardConfig from 'src/config/lakeraConfig';


@Injectable()
export class ChatService {
  

  async passMessageToLLM(message: string): Promise<any> {
    try {
      const response = await fetch('https://api.lakera.ai/v2/guard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LakeraGuardConfig.apiKey}`,
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: message },
          ],
        }),
      });

      const data = await response.json();

      if (data.flagged) {
        return {
          message: "🚫 Your message has been flagged as harmful or inappropriate.",
        }       
       
      }
      return {
        message: "✅ Your message is safe.",       
      }      

    } catch (error) {
      console.error('Lakera API Error:', error);
      return {
        allowed: false,
        message: "❌ Error contacting moderation service.",
      };
    }
  }
}




