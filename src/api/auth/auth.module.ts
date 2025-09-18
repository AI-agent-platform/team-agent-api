import { Module, forwardRef } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwtStratergy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./localStrategy";
import { UserModule } from "../user/user.module";
import { GoogleStrategy } from "../business/google.strategy";

@Module({
  imports: [
    JwtModule.register({
      secret: "JWT_SECRET",
      signOptions: { expiresIn: "3000s" },
    }),
    forwardRef(() => UserModule),
    PassportModule,
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
