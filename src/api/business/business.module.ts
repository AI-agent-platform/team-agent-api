import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BusinessController } from "./business.controller";
import { BusinessService } from "./business.service";
import { Business, BusinessSchema } from "./model/business.model";
import { User, UserSchema } from "../user/model/user.model";
import { EmailService } from "../email/email.service";
import { MetaModule } from "../meta/meta.module";
import { ChatModule } from "../chat/chat.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
      { name: User.name, schema: UserSchema },
    ]),
    MetaModule,
    ChatModule
  ],
  controllers: [BusinessController],
  providers: [BusinessService, EmailService],
})
export class BusinessModule {}
