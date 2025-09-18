// auth/google.strategy.ts
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "../auth/auth.service";
import GoogleAuthConfig from "../../configurations/googleAuthConfig";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private authService: AuthService) {
    super({
      clientID: GoogleAuthConfig.clientId,
      clientSecret: GoogleAuthConfig.clientSecret,
      callbackURL: GoogleAuthConfig.redirectUri,
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const user = await this.authService.validateGoogleUser({
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
    });

    done(null, user);
  }
}
