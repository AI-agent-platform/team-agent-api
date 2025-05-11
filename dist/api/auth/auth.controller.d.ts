import { Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    logger: Logger;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, req: any): Promise<any>;
    getUser(req: any): Promise<any>;
    register(createUserDto: CreateUserDto): Promise<any>;
    refresh(req: any): Promise<any>;
}
