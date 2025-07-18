import { CreateCommentDto } from '../dtos/create-comment.dto';
import { Comment } from '../entities/comment.entity';
import { UpdateCommentDto } from '../dtos/update-comment.dto';

export interface ICommentRepository {
  create(comment: CreateCommentDto & { articleId: string }): Promise<Comment>;
  update(id: string, comment: UpdateCommentDto): Promise<Comment | null>;
  delete(id: string): Promise<boolean>;
}
