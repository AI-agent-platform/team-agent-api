import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  
    async passMessageToLLM(message: string): Promise<any> {        
        return {response:'hi'};
    }
    
}