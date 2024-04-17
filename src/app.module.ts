import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MessageGateway } from './message/message.gateway';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway, MessageGateway],
})
export class AppModule {}
