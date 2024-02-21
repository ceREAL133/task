import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document, Types } from 'mongoose';

import { Workspace } from './workspace.schema';

@Schema()
export class Message {
  @Prop({ required: true, type: Types.ObjectId, ref: Workspace.name })
  workspaceId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ required: true })
  likes: number;

  @Prop({ required: true })
  content: string;
}

export type MessageDocument = Message & Document;

export const MessageSchema = SchemaFactory.createForClass(Message);
