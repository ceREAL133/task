import { IsDate, IsNumber, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateMessageDto {
  @IsNumber()
  workspaceId: ObjectId;

  @IsDate()
  date: Date;

  @IsNumber()
  likes: number;

  @IsString()
  content: string;
}
