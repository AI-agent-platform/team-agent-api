import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class AuthService {
    private UserService;
    private jwtService;
    constructor(UserService: UserService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    generateJwtToken(user: any): Promise<{
        access_token: string;
    }>;
    getHashedPassword(password: string): Promise<any>;
    comparePasswords(password: string, hashedPassword: string): Promise<any>;
    register(newUser: CreateUserDto): Promise<any>;
    refreshAccessToken(refreshToken: string): Promise<any>;
}
