import {
  Article,
  CreateArticleDto,
  FetchArticlesOptions,
  IArticleRepository,
  UpdateArticleDto,
} from '@orms-showcase/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { TagEntity } from '../entities/tag.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ArticleRepository implements IArticleRepository {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private readonly dataSource: DataSource
  ) {}

  async findAll(options: FetchArticlesOptions): Promise<Article[]> {
    let query = this.articleRepository.createQueryBuilder('article');
    query = query.leftJoinAndSelect('article.tags', 'tag');
    query = query.innerJoin('article.tags', 'filter_tags');

    if (options.includeComments) {
      query = query.leftJoinAndSelect('article.comments', 'comment');
    }

    if (options.tagId) {
      query = query.andWhere('filter_tags.id = :tagId', {
        tagId: options.tagId,
      });
    } else if (options.tagName) {
      query = query.andWhere('filter_tags.name = :tagName', {
        tagName: options.tagName,
      });
    }

    if (options.authorId) {
      query = query.andWhere('article.authorId = :authorId', {
        authorId: options.authorId,
      });
    }

    query = query.orderBy('article.publishedAt', 'DESC');

    if (options.page && options.limit) {
      const skip = (options.page - 1) * options.limit;
      query = query.skip(skip).take(options.limit);
    }

    return query.getMany();
  }

  async findById(
    id: string,
    options: FetchArticlesOptions
  ): Promise<Article | null> {
    return this.articleRepository.findOne({
      where: { id },
      relations: ['tags', ...(options.includeComments ? ['comments'] : [])],
    });
  }

  async create(article: CreateArticleDto): Promise<Article> {
    return this.articleRepository.save(article);
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

  async addTagToArticle(
    articleId: string,
    tagId: string
  ): Promise<Article | null> {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
      relations: ['tags'],
    });

    if (!article) return null;

    const tag = await this.dataSource.getRepository(TagEntity).findOne({
      where: { id: tagId },
    });

    if (!tag) return null;

    if (!article.tags) {
      article.tags = [];
    }

    article.tags.push(tag);
    await this.articleRepository.save(article);

    return article;
  }

  async removeTagFromArticle(
    articleId: string,
    tagId: string
  ): Promise<Article | null> {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
      relations: ['tags'],
    });

    if (!article || !article.tags) return null;

    article.tags = article.tags.filter((tag) => tag.id !== tagId);
    await this.articleRepository.save(article);

    return article;
  }
}
