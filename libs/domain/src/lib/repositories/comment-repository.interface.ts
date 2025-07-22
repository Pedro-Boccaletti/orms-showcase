import { CreateCommentDto } from '../dtos/create-comment.dto';
import { Comment } from '../entities/comment.entity';
import { UpdateCommentDto } from '../dtos/update-comment.dto';

export abstract class ICommentRepository {
  abstract create(
    comment: CreateCommentDto & { articleId: string }
  ): Promise<Comment>;
  abstract update(
    id: string,
    comment: UpdateCommentDto
  ): Promise<Comment | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract findByArticleId(articleId: string): Promise<Comment[]>;
}
