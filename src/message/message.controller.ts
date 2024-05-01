import { Body, Controller, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { AddMessageDto } from './dto/add-message.dto';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  create(@Body() AddMessageDto: AddMessageDto) {
    return this.messageService.createMessage(AddMessageDto);
  }
}
