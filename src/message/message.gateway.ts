import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { AddMessageDto } from './dto/add-message.dto';
import { UserService } from '../user/user.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly userService: UserService) {}

  private logger = new Logger('MessageGateway');
  private onlineUsers = new Set<string>();

  @SubscribeMessage('message') // subscribe to chat event messages
  async handleMessage(
    @MessageBody() payload: AddMessageDto,
  ): Promise<AddMessageDto> {
    const checkUser = await this.userService.findByEmail(payload.receiver);
    if (checkUser) {
      this.logger.log(
        `Message received: from ${payload.sender} to ${payload.receiver} on ${payload.createdAt} - ${payload.message}`,
      );
      this.server.emit('message', payload); // broadbast a message to all clients
      return payload; // return the same payload data
    }
    return;
  }

  // it will be handled when a client connects to the server
  handleConnection(socket: Socket) {
    // ambil id user yang dikirim dari FE, lalu simpan
    const userId = socket.handshake.auth.userId;
    this.logger.log(`Socket connected: ${socket.id}`);
    this.onlineUsers.add(userId);
    // Update status online users
    this.updateOnlineUsers();
  }

  // it will be handled when a client disconnects from the server
  handleDisconnect(socket: Socket) {
    // ambil id user yang dikirim dari FE, lalu hapus
    const userId = socket.handshake.auth.userId;
    this.logger.log(`Socket disconnected: ${socket.id}`);
    this.onlineUsers.delete(userId);
    // Update status online users
    this.updateOnlineUsers();
  }

  private updateOnlineUsers() {
    const onlineUsersArray = Array.from(this.onlineUsers);
    // console.log('onlineUsersArray', onlineUsersArray);
    this.server.emit('onlineUsers', onlineUsersArray);
  }
}
