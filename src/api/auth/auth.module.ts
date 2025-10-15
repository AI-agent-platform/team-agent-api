import { Module, forwardRef } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwtStratergy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./localStrategy";
import { UserModule } from "../user/user.module";
import { GoogleStrategy } from "../business/google.strategy";
import { EmailService } from "../email/email.service";
import { EmailModule } from "../email/email.module";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "JWT_SECRET",
      signOptions: { expiresIn: "3000s" },
    }),
    forwardRef(() => UserModule),
    PassportModule,
    EmailModule
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
