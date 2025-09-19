import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./api/user/user.module";
import { AuthModule } from "./api/auth/auth.module";
import { ChatModule } from "./api/chat/chat.module";
import { BusinessModule } from "./api/business/business.module";
import dbConfig from "./configurations/dbConfig";
import { EmailModule } from "./api/email/email.module";

@Module({
  imports: [
    MongooseModule.forRoot(dbConfig.uri),
    UserModule,
    AuthModule,
    ChatModule,
    BusinessModule,
    EmailModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
