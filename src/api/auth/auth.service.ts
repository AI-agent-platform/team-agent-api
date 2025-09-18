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

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private UserService: UserService,
    private jwtService: JwtService
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
    return { access_token: accessToken, user };
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
    return { message: "Registration successful", user };
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
