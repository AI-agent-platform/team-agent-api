import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./api/user/user.module";
import { AuthModule } from "./api/auth/auth.module";
import { ChatModule } from "./api/chat/chat.module";
import { BusinessModule } from "./api/business/business.module";
import { EmailModule } from "./api/email/email.module";
import * as dotenv from "dotenv";
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URI),
    UserModule,
    AuthModule,
    ChatModule,
    BusinessModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
