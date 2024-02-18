import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';

import { Workspace } from './workspace.schema';

export type MessageDocument = HydratedDocument<Message>;

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

export const MessageSchema = SchemaFactory.createForClass(Message);
