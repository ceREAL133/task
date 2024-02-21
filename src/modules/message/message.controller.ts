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
  Query,
} from '@nestjs/common';

import { Message, MessageDocument } from '../../schemas/message.schema';
import { MessageService } from './message.service';
import { AuthGuard, RequestWithUser } from '../../guards/auth.guard';
import { CreateMessageDto } from '../../dto/create-message.dto';
import { ChangeMessageDto } from '../../dto/change-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async getUsersMessages(
    @Req() req: RequestWithUser,
    @Query('searchText') searchText: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('minLikes') minLikes: number,
  ): Promise<MessageDocument[]> {
    return await this.messageService.getUsersMessages(
      req.user._id,
      searchText,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      minLikes,
    );
  }

  @UseGuards(AuthGuard)
  @Post('/createMessage')
  async createMessage(
    @Body() dto: CreateMessageDto,
    @Req() req: RequestWithUser,
  ): Promise<Message> {
    return await this.messageService.createMessage(dto, req);
  }

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
