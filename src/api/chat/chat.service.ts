import { Injectable } from '@nestjs/common';


@Injectable()
export class ChatService {
  

  async passMessageToLLM(message: string): Promise<any> {
    try {
      const response = await fetch('https://api.lakera.ai/v2/guard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 33797bdfd00edc90d3d952859d488150225d83bdc409f45704892b5a2538a6ad`,
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




