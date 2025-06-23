import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import dbConfig from './config/dbConfig';
import { ChatModule } from './api/chat/chat.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://buwa26889:fyp@cluster0.tmbq7fs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    UserModule,
    AuthModule,
    ChatModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
