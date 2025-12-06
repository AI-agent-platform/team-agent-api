import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      "https://icy-desert-09c5afe00.3.azurestaticapps.net",
      "http://localhost:3000",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    credentials: true,
  });

  await app.listen(process.env.PORT);
  console.log(`Server is running on port ${process.env.PORT}`);
}
bootstrap();
