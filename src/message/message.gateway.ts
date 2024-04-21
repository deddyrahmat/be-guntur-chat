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

  //=========================================================================
  // ini untuk dikelola ke database
  // async handleMessage(@MessageBody() payload: AddMessageDto) {
  //   const user = await this.userService.findByEmail(payload.sender);
  //   const send = { sender: user.id, message: payload.message };
  //   this.logger.log(`Message received: ${user.id} - ${payload.message}`);
  //   this.server.emit('message', send); // broadbast a message to all clients
  //   return send; // return the same payload data
  // }
  async validateRecipient(recipient: string): Promise<boolean> {
    // Implement your validation logic here
    // For example, check if recipient exists in the database
    // You can also check if the recipient is in the user's contact list or has permissions to receive messages
    // Return true if recipient is valid, otherwise return false
    return true; // Placeholder, replace with your actual validation logic
  }

  // it will be handled when a client connects to the server
  handleConnection(socket: Socket) {
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  // it will be handled when a client disconnects from the server
  handleDisconnect(socket: Socket) {
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }
}
