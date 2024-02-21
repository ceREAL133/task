import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { User } from './user.schema';

@Schema()
export class Workspace {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;
}

export type WorkspaceDocument = Workspace & Document;

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
