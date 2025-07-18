import { CreateArticleDto } from '../dtos/create-article.dto';
import { UpdateDto } from '../dtos/update.dto';
import { Article } from '../entities/article.entity';

export interface IArticleRepository {
  findAll(): Promise<Article[]>;
  findById(id: string): Promise<Article | null>;
  create(article: CreateArticleDto): Promise<Article>;
  update(article: UpdateDto<Article>): Promise<Article>;
  delete(id: string): Promise<void>;
}
