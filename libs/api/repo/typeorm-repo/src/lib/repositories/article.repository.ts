import {
  Article,
  CreateArticleDto,
  IArticleRepository,
  UpdateArticleDto,
} from '@orms-showcase/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleRepository implements IArticleRepository {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>
  ) {}

  async findAll(): Promise<Article[]> {
    const articles = await this.articleRepository.find();
    return articles;
  }

  async findById(id: string): Promise<Article | null> {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) return null;
    return article;
  }

  async create(dto: CreateArticleDto): Promise<Article> {
    const article = await this.articleRepository.save(dto);
    return article;
  }

  async update(id: string, article: UpdateArticleDto): Promise<Article | null> {
    const existingArticle = await this.articleRepository.findOne({
      where: { id },
    });
    if (!existingArticle) {
      return null;
    }
    const updatedArticle = Object.assign(existingArticle, article);
    return this.articleRepository.save(updatedArticle);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.articleRepository.delete(id);
    return result.affected ? true : false;
  }

  async findByAuthorId(authorId: string): Promise<Article[]> {
    const articles = await this.articleRepository.find({
      where: { authorId },
    });
    return articles;
  }
}
