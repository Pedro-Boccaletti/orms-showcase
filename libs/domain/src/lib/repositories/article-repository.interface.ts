import { CreateArticleDto } from '../dtos/create-article.dto';
import { UpdateArticleDto } from '../dtos/update-article.dto';
import { Article } from '../entities/article.entity';

export interface FetchArticlesOptions {
  includeComments?: boolean;
}

export abstract class IArticleRepository {
  abstract findAll(options?: FetchArticlesOptions): Promise<Article[]>;
  abstract findById(
    id: string,
    options?: FetchArticlesOptions
  ): Promise<Article | null>;
  abstract create(article: CreateArticleDto): Promise<Article>;
  abstract update(
    id: string,
    article: UpdateArticleDto
  ): Promise<Article | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract findByAuthorId(authorId: string): Promise<Article[]>;
}
