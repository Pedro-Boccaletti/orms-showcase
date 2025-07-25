import { IsString, IsUUID } from 'class-validator';

export class PushTagDto {
  @IsUUID()
  tagId?: string;

  @IsString()
  tagName?: string;
}
