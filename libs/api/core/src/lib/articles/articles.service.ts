import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  Article,
  ARTICLE_REPOSITORY,
  Comment,
  COMMENT_REPOSITORY,
  IArticleRepository,
  ICommentRepository,
} from '@orms-showcase/domain';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private repo: IArticleRepository,
    @Inject(COMMENT_REPOSITORY) private commentRepo: ICommentRepository
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    return this.repo.create(createArticleDto);
  }

  async findAll(includeComments: boolean): Promise<Article[]> {
    return this.repo.findAll({ includeComments });
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.repo.findById(id, { includeComments: true });
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return article;
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto
  ): Promise<Article> {
    const updatedArticle = await this.repo.update(id, updateArticleDto);
    if (!updatedArticle) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return updatedArticle;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
  }

  async createComment(
    articleId: string,
    createCommentDto: CreateCommentDto
  ): Promise<Comment> {
    return this.commentRepo.create({ ...createCommentDto, articleId });
  }

  async updateComment(
    articleId: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto
  ): Promise<Comment> {
    const updated = await this.commentRepo.update(commentId, updateCommentDto);
    if (!updated) {
      throw new NotFoundException(
        `Comment with id ${commentId} not found for article ${articleId}`
      );
    }
    return updated;
  }

  async deleteComment(articleId: string, commentId: string): Promise<void> {
    const deleted = await this.commentRepo.delete(commentId);
    if (!deleted) {
      throw new NotFoundException(
        `Comment with id ${commentId} not found for article ${articleId}`
      );
    }
  }

  async findCommentsByArticleId(articleId: string): Promise<Comment[]> {
    const comments = await this.commentRepo.findByArticleId(articleId);
    if (!comments.length) {
      throw new NotFoundException(
        `No comments found for article with id ${articleId}`
      );
    }
    return comments;
  }
}
