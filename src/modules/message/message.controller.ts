import {
  Controller,
  Get,
  UseGuards,
  // Post, Req, UseGuards
} from '@nestjs/common';

import { Message } from '../../schemas/message.schema';
import { MessageService } from './message.service';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async getMessages(): Promise<Message[]> {
    return await this.messageService.getMessages();
  }

  // @UseGuards()
  // @Post('/')
  // async createMessage(@Req() req): Promise<Message> {
  //   return await this.messageService.createMessage(req);
  // }
}
