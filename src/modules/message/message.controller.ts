import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Req,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { Message } from '../../schemas/message.schema';
import { MessageService } from './message.service';
import { AuthGuard, RequestWithUser } from '../../guards/auth.guard';
import { CreateMessageDto } from '../../dto/create-message.dto';
import { ChangeMessageDto } from '../../dto/change-message.dto';

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
  async createMessage(
    @Body() dto: CreateMessageDto,
    @Req() req: RequestWithUser,
  ): Promise<Message> {
    return await this.messageService.createMessage(dto, req);
  }

  //TODO: check if user is an owner of workspace, this message belongs to
  @UseGuards(AuthGuard)
  @Patch('/edit/:id')
  async editMessage(
    @Param('id') id,
    @Body() dto: ChangeMessageDto,
    @Req() req: RequestWithUser,
  ): Promise<Message> {
    return await this.messageService.changeMessage(dto, id, req);
  }

  @UseGuards(AuthGuard)
  @Delete('/delete/:id')
  async deleteMessage(
    @Param('id') id,
    @Req() req: RequestWithUser,
  ): Promise<Message> {
    return await this.messageService.deleteMessage(id, req);
  }
}
