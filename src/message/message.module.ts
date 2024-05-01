import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { PrismaService } from 'src/prisma.service';
import { MessageGateway } from './message.gateway';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [MessageController],
  providers: [UserService, MessageService, PrismaService, MessageGateway],
})
export class MessageModule {}
