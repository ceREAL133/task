import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';

import { Message } from '../../schemas/message.schema';
import { MessageService } from './message.service';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateMessageDto } from '../../dto/create-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async getMessages(): Promise<Message[]> {
    return await this.messageService.getMessages();
  }

  @UseGuards(AuthGuard)
  @Post('/createMessage')
  async createMessage(@Body() dto: CreateMessageDto): Promise<Message> {
    return await this.messageService.createMessage(dto);
  }
}
