import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://buwa26889:693hln3lxzC7UZ9P@cluster0.tmbq7fs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
