import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',  
    credentials: true,  
  });
  await app.listen(4001);
  console.log('Server is running on port 4001');
}
bootstrap();
