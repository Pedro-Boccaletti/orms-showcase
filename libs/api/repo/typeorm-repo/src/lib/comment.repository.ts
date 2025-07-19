import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './entities/comment.entity';
import { CreateCommentDto, UpdateCommentDto } from '@orms-showcase/domain';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>
  ) {}

  async create(
    comment: CreateCommentDto & { articleId: string }
  ): Promise<CommentEntity> {
    const commentEntity = this.commentRepository.create(comment);
    return this.commentRepository.save(commentEntity);
  }

  async update(
    id: string,
    comment: UpdateCommentDto
  ): Promise<CommentEntity | null> {
    const existingComment = await this.commentRepository.findOne({
      where: { id },
    });
    if (!existingComment) {
      return null;
    }
    Object.assign(existingComment, comment);
    return this.commentRepository.save(existingComment);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.commentRepository.delete(id);
    return result.affected ? true : false;
  }
}
