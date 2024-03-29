import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  workspaceId: string;

  @IsNumber()
  likes: number;

  @IsString()
  content: string;
}
