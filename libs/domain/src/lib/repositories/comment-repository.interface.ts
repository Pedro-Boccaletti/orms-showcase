import { CreateCommentDto } from '../dtos/create-comment.dto';
import { UpdateDto } from '../dtos/update.dto';

export interface ICommentRepository {
  create(comment: CreateCommentDto): Promise<Comment>;
  update(comment: UpdateDto<Comment>): Promise<Comment>;
  delete(id: string): Promise<void>;
}
