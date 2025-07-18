import { CreateArticleDto } from '../dtos/create-article.dto';
import { UpdateArticleDto } from '../dtos/update-article.dto';
import { Article } from '../entities/article.entity';

export interface IArticleRepository {
  findAll(): Promise<Article[]>;
  findById(id: string): Promise<Article | null>;
  create(article: CreateArticleDto): Promise<Article>;
  update(id: string, article: UpdateArticleDto): Promise<Article | null>;
  delete(id: string): Promise<boolean>;
}
