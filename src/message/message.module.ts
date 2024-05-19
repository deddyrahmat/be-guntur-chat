import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { PrismaService } from 'src/prisma.service';
import { MessageGateway } from './message.gateway';
import { UserService } from 'src/user/user.service';
// import { AuthMiddleware } from 'src/middleware/auth.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [MessageController],
  providers: [
    UserService,
    MessageService,
    PrismaService,
    MessageGateway,
    JwtService,
  ],
})
export class MessageModule {}
//  implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(AuthMiddleware)
//       .exclude({ path: 'auth/login', method: RequestMethod.POST }) // Excluding login route
//       .forRoutes('*');
//   }
// }
