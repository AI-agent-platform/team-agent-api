import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://icy-desert-09c5afe00.3.azurestaticapps.net",
  ];

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);  
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  });

  await app.listen(process.env.PORT);
  console.log(`Server is running on port ${process.env.PORT}`);
}
bootstrap();
