import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Article, Comment } from '@orms-showcase/domain';
import { NotFoundException } from '@nestjs/common';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let service: ArticlesService;

  const mockArticle: Article = {
    id: '1',
    title: 'Test Article',
    content: 'Test content',
    authorId: 'user1',
    publishedAt: new Date('2023-01-01'),
    comments: [],
  };

  const mockComment: Comment = {
    id: 'comment1',
    articleId: '1',
    content: 'Test comment',
    authorId: 'user2',
    createdAt: new Date('2023-01-02'),
  };

  const mockArticlesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    createComment: jest.fn(),
    updateComment: jest.fn(),
    deleteComment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: mockArticlesService,
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    service = module.get<ArticlesService>(ArticlesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /articles', () => {
    it('should create a new article', async () => {
      const createArticleDto: CreateArticleDto = {
        title: 'Test Article',
        content: 'Test content',
        authorId: 'user1',
      };

      mockArticlesService.create.mockResolvedValue(mockArticle);

      const result = await controller.create(createArticleDto);

      expect(service.create).toHaveBeenCalledWith(createArticleDto);
      expect(result).toEqual(mockArticle);
    });

    it('should handle article creation errors', async () => {
      const createArticleDto: CreateArticleDto = {
        title: 'Test Article',
        content: 'Test content',
        authorId: 'user1',
      };

      mockArticlesService.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(createArticleDto)).rejects.toThrow(
        'Database error'
      );
      expect(service.create).toHaveBeenCalledWith(createArticleDto);
    });
  });

  describe('GET /articles', () => {
    it('should return all articles', async () => {
      const articles = [mockArticle];
      mockArticlesService.findAll.mockResolvedValue(articles);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(articles);
    });

    it('should return empty array when no articles exist', async () => {
      mockArticlesService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('GET /articles/:id', () => {
    it('should return a specific article by id', async () => {
      mockArticlesService.findOne.mockResolvedValue(mockArticle);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockArticle);
    });

    it('should handle article not found', async () => {
      mockArticlesService.findOne.mockRejectedValue(
        new NotFoundException('Article with id 999 not found')
      );

      await expect(controller.findOne('999')).rejects.toThrow(
        'Article with id 999 not found'
      );
      expect(service.findOne).toHaveBeenCalledWith('999');
    });
  });

  describe('PATCH /articles/:id', () => {
    it('should update an existing article', async () => {
      const updateArticleDto: UpdateArticleDto = {
        title: 'Updated Title',
      };
      const updatedArticle = { ...mockArticle, title: 'Updated Title' };

      mockArticlesService.update.mockResolvedValue(updatedArticle);

      const result = await controller.update('1', updateArticleDto);

      expect(service.update).toHaveBeenCalledWith('1', updateArticleDto);
      expect(result).toEqual(updatedArticle);
    });

    it('should handle update of non-existent article', async () => {
      const updateArticleDto: UpdateArticleDto = {
        title: 'Updated Title',
      };

      mockArticlesService.update.mockRejectedValue(
        new NotFoundException('Article with id 999 not found')
      );

      await expect(controller.update('999', updateArticleDto)).rejects.toThrow(
        'Article with id 999 not found'
      );
      expect(service.update).toHaveBeenCalledWith('999', updateArticleDto);
    });
  });

  describe('DELETE /articles/:id', () => {
    it('should delete an article', async () => {
      mockArticlesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
      expect(result).toBeUndefined();
    });

    it('should handle deletion of non-existent article', async () => {
      mockArticlesService.remove.mockRejectedValue(
        new NotFoundException('Article with id 999 not found')
      );

      await expect(controller.remove('999')).rejects.toThrow(
        'Article with id 999 not found'
      );
      expect(service.remove).toHaveBeenCalledWith('999');
    });
  });

  describe('POST /articles/:id/comments', () => {
    it('should create a comment on an article', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Test comment',
        authorId: 'user2',
      };

      mockArticlesService.createComment.mockResolvedValue(mockComment);

      const result = await controller.createComment('1', createCommentDto);

      expect(service.createComment).toHaveBeenCalledWith('1', createCommentDto);
      expect(result).toEqual(mockComment);
    });

    it('should handle comment creation on non-existent article', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Test comment',
        authorId: 'user2',
      };

      mockArticlesService.createComment.mockRejectedValue(
        new NotFoundException('Article with id 999 not found')
      );

      await expect(
        controller.createComment('999', createCommentDto)
      ).rejects.toThrow('Article with id 999 not found');
      expect(service.createComment).toHaveBeenCalledWith(
        '999',
        createCommentDto
      );
    });
  });

  describe('PATCH /articles/:articleId/comments/:commentId', () => {
    it('should update a comment', async () => {
      const updateCommentDto: UpdateCommentDto = {
        content: 'Updated comment',
      };
      const updatedComment = { ...mockComment, content: 'Updated comment' };

      mockArticlesService.updateComment.mockResolvedValue(updatedComment);

      const result = await controller.updateComment(
        '1',
        'comment1',
        updateCommentDto
      );

      expect(service.updateComment).toHaveBeenCalledWith(
        '1',
        'comment1',
        updateCommentDto
      );
      expect(result).toEqual(updatedComment);
    });

    it('should handle update of non-existent comment', async () => {
      const updateCommentDto: UpdateCommentDto = {
        content: 'Updated comment',
      };

      mockArticlesService.updateComment.mockRejectedValue(
        new NotFoundException(
          'Comment with id comment999 not found for article 1'
        )
      );

      await expect(
        controller.updateComment('1', 'comment999', updateCommentDto)
      ).rejects.toThrow('Comment with id comment999 not found for article 1');
      expect(service.updateComment).toHaveBeenCalledWith(
        '1',
        'comment999',
        updateCommentDto
      );
    });
  });

  describe('DELETE /articles/:articleId/comments/:commentId', () => {
    it('should delete a comment', async () => {
      mockArticlesService.deleteComment.mockResolvedValue(undefined);

      const result = await controller.deleteComment('1', 'comment1');

      expect(service.deleteComment).toHaveBeenCalledWith('1', 'comment1');
      expect(result).toBeUndefined();
    });

    it('should handle deletion of non-existent comment', async () => {
      mockArticlesService.deleteComment.mockRejectedValue(
        new NotFoundException(
          'Comment with id comment999 not found for article 1'
        )
      );

      await expect(controller.deleteComment('1', 'comment999')).rejects.toThrow(
        'Comment with id comment999 not found for article 1'
      );
      expect(service.deleteComment).toHaveBeenCalledWith('1', 'comment999');
    });
  });
});
