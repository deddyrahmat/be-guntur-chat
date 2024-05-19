import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { MessageService } from './message.service';
import { AddMessageDto } from './dto/add-message.dto';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  create(@Body() AddMessageDto: AddMessageDto) {
    return this.messageService.createMessage(AddMessageDto);
  }

  @Get()
  async find(@Request() req) {
    const user = req.user;
    console.log('user', user);
    return this.messageService.findMessage(user.id);
  }
}
