import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  Article,
  ARTICLE_REPOSITORY,
  Comment,
  COMMENT_REPOSITORY,
  FetchArticlesOptions,
  IArticleRepository,
  ICommentRepository,
  ITagRepository,
  Tag,
  TAG_REPOSITORY,
} from '@orms-showcase/domain';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PushTagDto } from './dto/push-tag.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private articleRepo: IArticleRepository,
    @Inject(COMMENT_REPOSITORY) private commentRepo: ICommentRepository,
    @Inject(TAG_REPOSITORY) private tagRepo: ITagRepository
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articleRepo.create(createArticleDto);
  }

  async findAll(options: FetchArticlesOptions): Promise<Article[]> {
    return this.articleRepo.findAll(options);
  }

  async findOne(id: string, includeComments: boolean): Promise<Article> {
    const article = await this.articleRepo.findById(id, {
      includeComments,
    });
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return article;
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto
  ): Promise<Article> {
    const updatedArticle = await this.articleRepo.update(id, updateArticleDto);
    if (!updatedArticle) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return updatedArticle;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.articleRepo.delete(id);
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

  async addTagToArticle(
    articleId: string,
    param: PushTagDto
  ): Promise<Article> {
    let tagId: string;
    if (!param.tagId) {
      if (!param.tagName) {
        throw new NotFoundException('Either tagId or tagName must be provided');
      }
      const tag = await this.tagRepo.create(param.tagName);
      tagId = tag.id;
    } else {
      tagId = param.tagId;
    }
    const updatedArticle = await this.articleRepo.addTagToArticle(
      articleId,
      tagId
    );
    if (!updatedArticle) {
      throw new NotFoundException(
        `Article with id ${articleId} not found or tag with id ${tagId} not found`
      );
    }
    return updatedArticle;
  }

  async removeTagFromArticle(
    articleId: string,
    tagId: string
  ): Promise<Article> {
    const updatedArticle = await this.articleRepo.removeTagFromArticle(
      articleId,
      tagId
    );
    if (!updatedArticle) {
      throw new NotFoundException(
        `Article with id ${articleId} not found or tag with id ${tagId} not found`
      );
    }
    return updatedArticle;
  }

  async createTag(name: string): Promise<Tag> {
    const existingTag = await this.tagRepo.findByName(name);
    if (existingTag) {
      throw new NotFoundException(`Tag with name ${name} already exists`);
    }
    return this.tagRepo.create(name);
  }

  async findAllTags(): Promise<Tag[]> {
    return this.tagRepo.findAll();
  }

  async updateTag(id: string, name: string): Promise<Tag> {
    const updatedTag = await this.tagRepo.update(id, name);
    if (!updatedTag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }
    return updatedTag;
  }
}
