import { IsNumber, IsString } from 'class-validator';

export class ChangeMessageDto {
  @IsNumber()
  likes: number;

  @IsString()
  content: string;
}
