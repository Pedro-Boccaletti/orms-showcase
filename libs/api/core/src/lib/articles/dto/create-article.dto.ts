import { CreateArticleDto as baseDto } from '@orms-showcase/domain';
import { IsString, IsUUID } from 'class-validator';

export class CreateArticleDto implements baseDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsUUID()
  authorId: string;
}
