import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Message, MessageSchema } from '../../schemas/message.schema';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { WorkspaceModule } from '../workspace/workspace.module';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    WorkspaceModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, JwtService],
  exports: [MessageService],
})
export class MessageModule {}
