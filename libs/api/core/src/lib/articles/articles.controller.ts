import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PushTagDto } from './dto/push-tag.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  findAll(
    @Query()
    query: {
      includeComments?: boolean;
      tagId?: string;
      tagName?: string;
      authorId?: string;
      page?: number;
      limit?: number;
    }
  ) {
    return this.articlesService.findAll(query);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('includeComments') includeComments = false
  ) {
    return this.articlesService.findOne(id, includeComments);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }

  @Post(':id/comments')
  createComment(
    @Param('id') articleId: string,
    @Body() createCommentDto: CreateCommentDto
  ) {
    return this.articlesService.createComment(articleId, createCommentDto);
  }

  @Patch(':articleId/comments/:commentId')
  updateComment(
    @Param('articleId') articleId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto
  ) {
    return this.articlesService.updateComment(
      articleId,
      commentId,
      updateCommentDto
    );
  }

  @Delete(':articleId/comments/:commentId')
  deleteComment(
    @Param('articleId') articleId: string,
    @Param('commentId') commentId: string
  ) {
    return this.articlesService.deleteComment(articleId, commentId);
  }

  @Get(':id/comments')
  findCommentsByArticleId(@Param('id') id: string) {
    return this.articlesService.findCommentsByArticleId(id);
  }

  @Post(':articleId/tag')
  addTagToArticle(
    @Param('articleId') articleId: string,
    @Body() body: PushTagDto
  ) {
    return this.articlesService.addTagToArticle(articleId, body);
  }

  @Delete(':articleId/tag/:tagId')
  removeTagFromArticle(
    @Param('articleId') articleId: string,
    @Param('tagId') tagId: string
  ) {
    return this.articlesService.removeTagFromArticle(articleId, tagId);
  }

  @Post('tags')
  createTag(@Body('name') name: string) {
    return this.articlesService.createTag(name);
  }

  @Patch('tags/:id')
  updateTag(@Param('id') id: string, @Body('name') name: string) {
    return this.articlesService.updateTag(id, name);
  }

  @Get('tags')
  findAllTags() {
    return this.articlesService.findAllTags();
  }
}
