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

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  findAll(@Query() query?: { includeComments?: string }) {
    return this.articlesService.findAll(query?.includeComments === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
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
}
