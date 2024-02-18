import {
  //   BadRequestException,
  Injectable,
  Logger,
  Optional,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { inspect } from 'util';

import { Message } from '../../schemas/message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @Optional() private logger = new Logger('Messages Service'),
  ) {}

  async getMessages(): Promise<Message[]> {
    return await this.messageModel.find().exec();
  }

  //   async createMessage(): Promise<Message>{

  //     return await this.messageModel.create()
  //   }
}
