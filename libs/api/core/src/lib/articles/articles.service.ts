import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  Article,
  Comment,
  IArticleRepository,
  ICommentRepository,
} from '@orms-showcase/domain';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject('ArticleRepository') private repo: IArticleRepository,
    @Inject('CommentRepository') private commentRepo: ICommentRepository
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    return this.repo.create(createArticleDto);
  }

  async findAll(): Promise<Article[]> {
    return this.repo.findAll();
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.repo.findById(id);
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
}
