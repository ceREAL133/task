import { IsString } from 'class-validator';

export class WorkspaceDto {
  @IsString()
  name: string;
}
