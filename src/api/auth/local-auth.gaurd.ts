import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  handleRequest(err: any, user: any, info: any) {
    if (err) {
      throw err;
    }
    if (!user) {
      // User not found or invalid credentials
      throw new UnauthorizedException(info?.message || "Invalid credentials");
    }
    return user;
  }
}
