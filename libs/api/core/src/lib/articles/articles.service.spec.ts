import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  Article,
  Comment,
  IArticleRepository,
  ICommentRepository,
} from '@orms-showcase/domain';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let articleRepository: IArticleRepository;
  let commentRepository: ICommentRepository;

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

  const mockArticleRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCommentRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: 'ArticleRepository',
          useValue: mockArticleRepository,
        },
        {
          provide: 'CommentRepository',
          useValue: mockCommentRepository,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    articleRepository = module.get<IArticleRepository>('ArticleRepository');
    commentRepository = module.get<ICommentRepository>('CommentRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new article', async () => {
      const createArticleDto: CreateArticleDto = {
        title: 'Test Article',
        content: 'Test content',
        authorId: 'user1',
      };

      mockArticleRepository.create.mockResolvedValue(mockArticle);

      const result = await service.create(createArticleDto);

      expect(articleRepository.create).toHaveBeenCalledWith(createArticleDto);
      expect(result).toEqual(mockArticle);
    });

    it('should handle creation errors', async () => {
      const createArticleDto: CreateArticleDto = {
        title: 'Test Article',
        content: 'Test content',
        authorId: 'user1',
      };

      mockArticleRepository.create.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.create(createArticleDto)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('findAll', () => {
    it('should return all articles', async () => {
      const articles = [mockArticle];
      mockArticleRepository.findAll.mockResolvedValue(articles);

      const result = await service.findAll();

      expect(articleRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(articles);
    });

    it('should return empty array when no articles exist', async () => {
      mockArticleRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(articleRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an article by id', async () => {
      mockArticleRepository.findById.mockResolvedValue(mockArticle);

      const result = await service.findOne('1');

      expect(articleRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockArticle);
    });

    it('should throw NotFoundException when article not found', async () => {
      mockArticleRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(
        new NotFoundException('Article with id 999 not found')
      );
    });
  });

  describe('update', () => {
    it('should update an article', async () => {
      const updateArticleDto: UpdateArticleDto = {
        title: 'Updated Title',
      };

      const updatedArticle = { ...mockArticle, title: 'Updated Title' };
      mockArticleRepository.update.mockResolvedValue(updatedArticle);

      const result = await service.update('1', updateArticleDto);

      expect(articleRepository.update).toHaveBeenCalledWith(
        '1',
        updateArticleDto
      );
      expect(result).toEqual(updatedArticle);
    });

    it('should throw NotFoundException when updating non-existent article', async () => {
      const updateArticleDto: UpdateArticleDto = {
        title: 'Updated Title',
      };

      mockArticleRepository.update.mockResolvedValue(null);

      await expect(service.update('999', updateArticleDto)).rejects.toThrow(
        new NotFoundException('Article with id 999 not found')
      );
    });
  });

  describe('remove', () => {
    it('should delete an article', async () => {
      mockArticleRepository.delete.mockResolvedValue(true);

      await service.remove('1');

      expect(articleRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when deleting non-existent article', async () => {
      mockArticleRepository.delete.mockResolvedValue(false);

      await expect(service.remove('999')).rejects.toThrow(
        new NotFoundException('Article with id 999 not found')
      );
    });
  });

  describe('createComment', () => {
    it('should create a comment for an article', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Test comment',
        authorId: 'user2',
      };

      mockCommentRepository.create.mockResolvedValue(mockComment);

      const result = await service.createComment('1', createCommentDto);

      expect(commentRepository.create).toHaveBeenCalledWith({
        ...createCommentDto,
        articleId: '1',
      });
      expect(result).toEqual(mockComment);
    });

    it('should handle comment creation errors', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Test comment',
        authorId: 'user2',
      };

      mockCommentRepository.create.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        service.createComment('1', createCommentDto)
      ).rejects.toThrow('Database error');
    });
  });

  describe('updateComment', () => {
    it('should update a comment', async () => {
      const updateCommentDto: UpdateCommentDto = {
        content: 'Updated comment',
      };

      const updatedComment = { ...mockComment, content: 'Updated comment' };
      mockCommentRepository.update.mockResolvedValue(updatedComment);

      const result = await service.updateComment(
        '1',
        'comment1',
        updateCommentDto
      );

      expect(commentRepository.update).toHaveBeenCalledWith(
        'comment1',
        updateCommentDto
      );
      expect(result).toEqual(updatedComment);
    });

    it('should throw NotFoundException when updating non-existent comment', async () => {
      const updateCommentDto: UpdateCommentDto = {
        content: 'Updated comment',
      };

      mockCommentRepository.update.mockResolvedValue(null);

      await expect(
        service.updateComment('1', 'comment999', updateCommentDto)
      ).rejects.toThrow(
        new NotFoundException(
          'Comment with id comment999 not found for article 1'
        )
      );
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      mockCommentRepository.delete.mockResolvedValue(true);

      await service.deleteComment('1', 'comment1');

      expect(commentRepository.delete).toHaveBeenCalledWith('comment1');
    });

    it('should throw NotFoundException when deleting non-existent comment', async () => {
      mockCommentRepository.delete.mockResolvedValue(false);

      await expect(service.deleteComment('1', 'comment999')).rejects.toThrow(
        new NotFoundException(
          'Comment with id comment999 not found for article 1'
        )
      );
    });
  });
});
