import {
  FetchArticlesOptions,
  IArticleRepository,
  Article,
  Comment,
  CreateArticleDto,
  UpdateArticleDto,
} from '@orms-showcase/domain';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Inject, Injectable } from '@nestjs/common';
import * as schema from '../schema';
import { eq, and, inArray } from 'drizzle-orm';
import { DrizzleProvider } from '../drizzle.provider';

@Injectable()
export class ArticleRepository implements IArticleRepository {
  constructor(
    @Inject(DrizzleProvider) private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async findAll(options: FetchArticlesOptions): Promise<Article[]> {
    // First, build a query to get article IDs that match the filtering criteria
    const query = this.db
      .select({
        id: schema.article.id,
        title: schema.article.title,
        content: schema.article.content,
        authorId: schema.article.authorId,
        publishedAt: schema.article.publishedAt,
        tagId: schema.tag.id,
        tagName: schema.tag.name,
      })
      .from(schema.article)
      .leftJoin(
        schema.articleTag,
        eq(schema.articleTag.articleId, schema.article.id)
      )
      .leftJoin(schema.tag, eq(schema.articleTag.tagId, schema.tag.id))
      .where(
        and(
          options.authorId
            ? eq(schema.article.authorId, options.authorId)
            : undefined,
          options.tagId
            ? eq(schema.articleTag.tagId, options.tagId)
            : undefined,
          options.tagName ? eq(schema.tag.name, options.tagName) : undefined
        )
      )
      .limit(options.limit ?? 100) // Default limit if not provided
      .offset(((options.page ?? 1) - 1) * (options.limit ?? 100)); // Default offset if not provided

    const articles = await query.execute();

    if (articles.length === 0) {
      return [];
    }

    // Group the data by article
    const articleMap = new Map<string, Article>();

    for (const row of articles) {
      const articleId = row.id;

      if (!articleMap.has(articleId)) {
        articleMap.set(articleId, {
          id: row.id,
          title: row.title,
          content: row.content,
          authorId: row.authorId,
          publishedAt: row.publishedAt,
          comments: [],
          tags: [],
        });
      }

      const article = articleMap.get(articleId);
      if (!article)
        throw new Error('Unexpected error: Article not found in map');

      // Add tag if it exists and isn't already added
      const { tagId, tagName } = row;
      if (tagId && tagName && !article.tags.some((t) => t.id === tagId)) {
        article.tags.push({
          id: tagId,
          name: tagName,
        });
      }
    }

    if (options.includeComments) {
      const ids = articles.map((a) => a.id);
      const comments: Comment[] = await this.db
        .select({
          id: schema.comment.id,
          content: schema.comment.content,
          authorId: schema.comment.authorId,
          articleId: schema.comment.articleId,
          createdAt: schema.comment.createdAt,
        })
        .from(schema.comment)
        .where(inArray(schema.comment.articleId, ids))
        .execute();

      // Add comments to articles
      for (const comment of comments) {
        const article = articleMap.get(comment.articleId);
        if (!article) {
          throw new Error(
            `Unexpected error: Article with ID ${comment.articleId} not found in map`
          );
        }

        article.comments.push({
          id: comment.id,
          content: comment.content,
          authorId: comment.authorId,
          articleId: comment.articleId,
          createdAt: comment.createdAt,
        });
      }
    }

    return Array.from(articleMap.values());
  }

  async findById(id: string): Promise<Article | null> {
    const result = await this.db
      .select({
        id: schema.article.id,
        title: schema.article.title,
        content: schema.article.content,
        authorId: schema.article.authorId,
        publishedAt: schema.article.publishedAt,
        tagId: schema.tag.id,
        tagName: schema.tag.name,
      })
      .from(schema.article)
      .leftJoin(
        schema.articleTag,
        eq(schema.articleTag.articleId, schema.article.id)
      )
      .leftJoin(schema.tag, eq(schema.articleTag.tagId, schema.tag.id))
      .where(eq(schema.article.id, id))
      .execute();
    if (result.length === 0) {
      return null;
    }
    console.log(result);
    const article: Article = {
      id: result[0].id,
      title: result[0].title,
      content: result[0].content,
      authorId: result[0].authorId,
      publishedAt: result[0].publishedAt,
      tags: [],
      comments: [],
    };
    for (const { tagId, tagName } of result) {
      if (!tagId || !tagName) break; // Skip if tagId or tagName is missing
      article.tags.push({
        id: tagId,
        name: tagName,
      });
    }
    article.comments = await this.db
      .select({
        id: schema.comment.id,
        content: schema.comment.content,
        authorId: schema.comment.authorId,
        articleId: schema.comment.articleId,
        createdAt: schema.comment.createdAt,
      })
      .from(schema.comment)
      .where(eq(schema.comment.articleId, id))
      .execute();
    return article;
  }

  async create(article: CreateArticleDto): Promise<Article> {
    const [createdArticle] = (await this.db
      .insert(schema.article)
      .values(article)
      .returning({
        id: schema.article.id,
        title: schema.article.title,
        content: schema.article.content,
        authorId: schema.article.authorId,
        publishedAt: schema.article.publishedAt,
      })
      .execute()) as Article[];
    createdArticle.comments = [];
    createdArticle.tags = [];

    return createdArticle;
  }

  async update(id: string, article: UpdateArticleDto): Promise<Article | null> {
    const [updatedArticle] = (await this.db
      .update(schema.article)
      .set(article)
      .where(eq(schema.article.id, id))
      .returning({
        id: schema.article.id,
        title: schema.article.title,
        content: schema.article.content,
        authorId: schema.article.authorId,
        publishedAt: schema.article.publishedAt,
      })
      .execute()) as Article[];
    updatedArticle.comments = [];
    updatedArticle.tags = [];

    return updatedArticle;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(schema.article)
      .where(eq(schema.article.id, id))
      .execute();
    return !!result.rowCount;
  }

  async addTagToArticle(
    articleId: string,
    tagId: string
  ): Promise<Article | null> {
    const result = await this.db
      .insert(schema.articleTag)
      .values({
        articleId,
        tagId,
      })
      .execute();
    if (!result.rowCount) {
      return null;
    }
    return this.findById(articleId);
  }

  async removeTagFromArticle(
    articleId: string,
    tagId: string
  ): Promise<Article | null> {
    const result = await this.db
      .delete(schema.articleTag)
      .where(
        and(
          eq(schema.articleTag.articleId, articleId),
          eq(schema.articleTag.tagId, tagId)
        )
      )
      .execute();
    if (!result.rowCount) {
      return null;
    }
    return this.findById(articleId);
  }
}
