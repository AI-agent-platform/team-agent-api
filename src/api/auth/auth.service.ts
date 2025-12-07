import {
  Injectable,
  forwardRef,
  Inject,
  UnauthorizedException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { OAuth2Client } from "google-auth-library";
import { EmailService } from "../email/email.service";
import * as crypto from "crypto";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private UserService: UserService,
    private jwtService: JwtService,
    private mailService: EmailService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const query = { email: email };
    const user = await this.UserService.findOne(query);
    if (!user) throw new NotFoundException("Email Does not exist");
    const isMatched = await this.comparePasswords(pass, user.password);
    if (!isMatched) throw new UnauthorizedException("Invalid Password");
    return user;
  }

  async generateJwtToken(user: any) {
    const payload = {
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }

  async loginUser(user: any) {
    const accessToken = await this.generateJwtToken(user);
    await this.UserService.findOneAndUpdate(
      { email: user.email },
      { accessToken }
    );
    // return token and user so client receives the JWT
    return { access_token: accessToken, user };
  }

  async forgotPassword(email: string): Promise<any> {
    const user = await this.UserService.findOne({ email });
    if (!user) throw new NotFoundException("Email does not exist");

    const token = crypto.randomBytes(32).toString("hex");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.UserService.findOneAndUpdate(
      { email },
      {
        passwordResetToken: token,
        passwordResetOTP: otp,
        passwordResetExpires: expires,
      }
    );

    // Reset link
    const resetLink = `${
      process.env.WEB_URL || "http://localhost:3000"
    }/reset-password?token=${token}`;

    await this.mailService.sendEmail(
      email,
      "Reset your password",
      "email-forgot-password-verification",
      { otp: otp, resetLink: resetLink, useName: user.firstName }
    );

    return { message: "Password reset email sent" };
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    const user = await this.UserService.findOne({ passwordResetToken: token });
    if (!user || !user.passwordResetExpires) {
      throw new UnauthorizedException("Invalid or expired token");
    }
    const expires = new Date(user.passwordResetExpires);
    if (expires.getTime() < Date.now()) {
      throw new UnauthorizedException("Token has expired");
    }

    const hashed = await this.getHashedPassword(newPassword);

    await this.UserService.findOneAndUpdate(
      { email: user.email },
      {
        password: hashed,
        passwordResetToken: null,
        passwordResetOTP: null,
        passwordResetExpires: null,
      }
    );

    return { message: "Password has been reset successfully" };
  }

  async getHashedPassword(password: string): Promise<any> {
    if (!password) return null;
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  }

  async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<any> {
    return bcrypt
      .compare(password, hashedPassword)
      .then((isMatch) => {
        if (isMatch) return true;
        return false;
      })
      .catch((err) => err);
  }

  // Register a new user
  async register(newUser: CreateUserDto): Promise<any> {
    const query = { email: newUser.email };
    const isUser = await this.UserService.findOne(query);
    if (isUser)
      throw new HttpException("User Already Exist", HttpStatus.CONFLICT);
    const user = await this.UserService.create(newUser);
    await this.mailService.sendEmail(
      newUser.email,
      "Welcome!",
      "email-sign-up-user",
      { subject: "Welcome to our platform!" }
    );
    return { message: "Registration successfully Completed", user };
  }

  async refreshAccessToken(refreshToken: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: "JWT_SECRET",
      });

      const user = await this.UserService.findOne({ email: payload.email });
      if (!user) throw new UnauthorizedException("Invalid refresh token");
      return {
        access_token: this.jwtService.sign({ email: user.email }),
      };
    } catch (err) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async validateGoogleUser(profile: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }) {
    let user = await this.UserService.findOne({ email: profile.email });

    if (!user) {
      user = await this.UserService.create({
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        picture: profile.picture,
        password: null,
      });
    }

    const accessToken = await this.generateJwtToken(user);

    return { access_token: accessToken, user };
  }

  async loginWithGoogleToken(token: string) {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await this.UserService.findOne({ email: payload.email });
    if (!user) {
      user = await this.UserService.create({
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture,
        password: null,
      });
    }

    const access_token = await this.generateJwtToken(user);
    return { access_token, user };
  }
}
