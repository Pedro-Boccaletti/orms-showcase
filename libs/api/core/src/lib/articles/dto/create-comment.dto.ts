import { CreateCommentDto as dtoBase } from '@orms-showcase/domain';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto implements dtoBase {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  authorId: string;
}
