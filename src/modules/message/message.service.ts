import { Injectable, Logger, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Message } from '../../schemas/message.schema';
import { CreateMessageDto } from '../../dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @Optional() private logger = new Logger('Messages Service'),
  ) {}

  async getMessages(): Promise<Message[]> {
    return await this.messageModel.find().exec();
  }

  async createMessage(dto: CreateMessageDto): Promise<Message> {
    // TODO: check if userId in workspace and currentUserId matches
    // TODO: check if such workspace exists
    // TODO: Date should be current date

    return await this.messageModel.create(dto);
  }
}
