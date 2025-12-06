import {
  Controller,
  Post,
  Logger,
  Request,
  UseGuards,
  Get,
  Body,
  Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.gaurd";
import { LocalAuthGuard } from "./local-auth.gaurd";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  logger: Logger;
  constructor(private readonly authService: AuthService) {
    this.logger = new Logger(AuthController.name);
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req) {
    return req.user;
  }

  @Post("google-login")
  async googleLogin(@Body("token") token: string) {
    return this.authService.loginWithGoogleToken(token);
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  async login(@Body() loginDto: LoginDto, @Request() req): Promise<any> {
    try {
      return await this.authService.loginUser(req.user);
      //return req.user;
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("viewProfile")
  async getUser(@Request() req): Promise<any> {
    return req.user;
  }

  @Post("register")
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.authService.register(createUserDto);
  }

  @Post("forgot-password")
  async forgotPassword(@Body('email') email: string): Promise<any> {
    return this.authService.forgotPassword(email);
  }

  @Post("reset-password")
  async resetPassword(@Body() body: { token: string; password: string }): Promise<any> {
    const { token, password } = body;
    return this.authService.resetPassword(token, password);
  }

  @Post("refresh")
  async refresh(@Request() req): Promise<any> {
    // expects { refreshToken } in body
    const { refreshToken } = req.body;
    return this.authService.refreshAccessToken(refreshToken);
  }
}
