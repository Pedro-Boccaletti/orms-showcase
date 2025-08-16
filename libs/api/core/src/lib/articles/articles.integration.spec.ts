import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ArticlesService } from './articles.service';
import {
  ARTICLE_REPOSITORY,
  COMMENT_REPOSITORY,
  TAG_REPOSITORY,
  USER_REPOSITORY,
  IArticleRepository,
  ICommentRepository,
  ITagRepository,
  IUserRepository,
  Article,
  Comment,
  Tag,
  User,
} from '@orms-showcase/domain';
import {
  RepositoryConfigModule,
  Repositories,
} from '../config/repository.config';
import { NotFoundException } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

// Get the repository type from environment or default to TypeORM
const REPOSITORY_TYPE = process.env['REPOSITORY_TYPE'] as Repositories;

// Ensure the repository type is valid
if (!Object.values(Repositories).includes(REPOSITORY_TYPE)) {
  throw new Error(`Unknown repository type: ${REPOSITORY_TYPE}`);
}

// Helper function to execute shell commands
const execAsync = promisify(exec);

// Helper function to run SQL files
async function runSqlFile(filePath: string): Promise<void> {
  const dbHost = process.env['DB_HOST'];
  const dbPort = process.env['DB_PORT'];
  const dbUser = process.env['DB_USERNAME'];
  const dbPassword = process.env['DB_PASSWORD'];
  const dbName = process.env['DB_DATABASE'];

  const command = `PGPASSWORD=${dbPassword} psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -f ${filePath}`;

  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr && !stderr.includes('NOTICE')) {
      console.warn('SQL execution warnings:', stderr);
    }
    console.log('SQL execution output:', stdout);
  } catch (error) {
    console.error('Error executing SQL file:', error);
    throw error;
  }
}

// Helper function to run bash scripts
async function runBashScript(
  scriptPath: string,
  args: string[] = []
): Promise<void> {
  const command = `bash ${scriptPath} ${args.join(' ')}`;

  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      console.warn('Script execution warnings:', stderr);
    }
    console.log('Script execution output:', stdout);
  } catch (error) {
    console.error('Error executing bash script:', error);
    throw error;
  }
}

async function cleanupTestData(): Promise<void> {
  try {
    await runSqlFile(
      path.join(__dirname, '../../../../../database/cleanup-test-data.sql')
    );
    console.log('✅ Test data cleanup completed successfully');
  } catch (error) {
    console.warn('⚠️ Cleanup error (may be expected):', error);
    throw error;
  }
}

describe(`ArticlesService Integration Tests - ${REPOSITORY_TYPE}`, () => {
  let service: ArticlesService;
  let module: TestingModule;

  // Repository instances for direct data manipulation
  let articleRepo: IArticleRepository;
  let commentRepo: ICommentRepository;
  let tagRepo: ITagRepository;
  let userRepo: IUserRepository;

  // Test data
  let testUser: User;
  let testArticle: Article;
  let testTag: Tag;
  let testComment: Comment;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        RepositoryConfigModule.forRoot(REPOSITORY_TYPE),
      ],
      providers: [ArticlesService],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);

    // Get repository instances for test data setup
    articleRepo = module.get<IArticleRepository>(ARTICLE_REPOSITORY);
    commentRepo = module.get<ICommentRepository>(COMMENT_REPOSITORY);
    tagRepo = module.get<ITagRepository>(TAG_REPOSITORY);
    userRepo = module.get<IUserRepository>(USER_REPOSITORY);
  });

  beforeEach(async () => {
    // Clean up data from previous tests
    await cleanupTestData();

    // seed test data
    try {
      await runSqlFile(
        path.join(__dirname, '../../../../../database/seed-test-data.sql')
      );
    } catch (error) {
      console.error('❌ Error setting up test data:', error);
      throw error;
    }

    const foundUser = await userRepo.findById(
      '550e8400-e29b-41d4-a716-446655440001'
    );
    if (!foundUser) {
      throw new Error('Test user not found');
    }
    testUser = foundUser;
  });

  afterAll(async () => {
    // Clean up data from previous tests
    try {
      await runSqlFile(
        path.join(__dirname, '../../../../../database/cleanup-test-data.sql')
      );
      console.log('✅ Test data cleanup completed successfully');
    } catch (error) {
      console.warn('⚠️ Cleanup error (may be expected):', error);
      throw error;
    }
    await module.close();
  });

  describe('findAll', () => {
    it('should return all articles', async () => {
      const articles = await service.findAll({});
      expect(articles).toBeDefined();
      expect(articles).toBeInstanceOf(Array);
      expect(articles.length).toEqual(5);
    });

    it('should return null if no articles found', async () => {
      await cleanupTestData();

      const articles = await service.findAll({});

      expect(articles.length).toEqual(0);
    });

    it('should return articles with comments when includeComments is true', async () => {
      const articles = await service.findAll({ includeComments: true });

      expect(articles.length).toEqual(5);
      for (const article of articles) {
        expect(article.comments).toBeDefined();
        expect(article.comments).toBeInstanceOf(Array);
      }
    });

    it('should filter articles by authorId', async () => {
      const articles = await service.findAll({ authorId: testUser.id });

      expect(articles.length).toEqual(2);
      // All returned articles should belong to the testUser
      articles.forEach((article) => {
        expect(article.authorId).toBe(testUser.id);
      });
    });

    it('should handle pagination', async () => {
      await cleanupTestData();

      // Create additional articles
      for (let i = 0; i < 10; i++) {
        await articleRepo.create({
          title: `Article ${i}`,
          content: `Content ${i}`,
          authorId: testUser.id,
        });
      }

      let articles = await service.findAll({ page: 0, limit: 3 });

      expect(articles.length).toEqual(3);

      articles = await service.findAll({ page: 3, limit: 3 });
      expect(articles.length).toBeLessThanOrEqual(3);
    });
  });

  describe('findOne', () => {
    it('should return article by id', async () => {
      const article = await service.findOne(testArticle.id, false);

      expect(article).toBeDefined();
      expect(article.id).toBe(testArticle.id);
      expect(article.title).toBe('Test Article');
    });

    it('should return article with comments when includeComments is true', async () => {
      const article = await service.findOne(testArticle.id, true);

      expect(article).toBeDefined();
      expect(article.comments).toBeDefined();
      expect(article.comments.length).toBeGreaterThanOrEqual(1);
    });

    it('should throw NotFoundException for non-existent article', async () => {
      await expect(service.findOne('non-existent-id', false)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('create', () => {
    it('should create a new article', async () => {
      const createDto = {
        title: 'New Article',
        content: 'New article content',
        authorId: testUser.id,
      };

      const article = await service.create(createDto);

      expect(article).toBeDefined();
      expect(article.title).toBe('New Article');
      expect(article.content).toBe('New article content');
      expect(article.authorId).toBe(testUser.id);
      expect(article.id).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update an existing article', async () => {
      const updateDto = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      const updatedArticle = await service.update(testArticle.id, updateDto);

      expect(updatedArticle).toBeDefined();
      expect(updatedArticle.title).toBe('Updated Title');
      expect(updatedArticle.content).toBe('Updated content');
      expect(updatedArticle.authorId).toBe(testUser.id); // Should remain unchanged
    });

    it('should throw NotFoundException for non-existent article', async () => {
      const updateDto = { title: 'Updated Title' };

      await expect(
        service.update('non-existent-id', updateDto)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an existing article', async () => {
      await expect(service.remove(testArticle.id)).resolves.not.toThrow();

      // Verify article is deleted
      await expect(service.findOne(testArticle.id, false)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw NotFoundException for non-existent article', async () => {
      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('createComment', () => {
    it('should create a comment for an article', async () => {
      const createCommentDto = {
        authorId: testUser.id,
        content: 'New comment content',
      };

      const comment = await service.createComment(
        testArticle.id,
        createCommentDto
      );

      expect(comment).toBeDefined();
      expect(comment.content).toBe('New comment content');
      expect(comment.articleId).toBe(testArticle.id);
    });
  });

  describe('findCommentsByArticleId', () => {
    it('should return comments for an article', async () => {
      const comments = await service.findCommentsByArticleId(testArticle.id);

      expect(comments.length).toBeGreaterThanOrEqual(1);
      const testCommentFound = comments.find(
        (c) => c.content === 'This is a test comment'
      );
      expect(testCommentFound).toBeDefined();
    });

    it('should throw NotFoundException when no comments found', async () => {
      // Create article without comments
      const articleWithoutComments = await articleRepo.create({
        title: 'Article without comments',
        content: 'Content',
        authorId: testUser.id,
      });

      await expect(
        service.findCommentsByArticleId(articleWithoutComments.id)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateComment', () => {
    it('should update an existing comment', async () => {
      const updateDto = {
        content: 'Updated comment content',
      };

      const updatedComment = await service.updateComment(
        testArticle.id,
        testComment.id,
        updateDto
      );

      expect(updatedComment).toBeDefined();
      expect(updatedComment.content).toBe('Updated comment content');
    });

    it('should throw NotFoundException for non-existent comment', async () => {
      const updateDto = { content: 'Updated content' };

      await expect(
        service.updateComment(testArticle.id, 'non-existent-id', updateDto)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteComment', () => {
    it('should delete an existing comment', async () => {
      await expect(
        service.deleteComment(testArticle.id, testComment.id)
      ).resolves.not.toThrow();
    });

    it('should throw NotFoundException for non-existent comment', async () => {
      await expect(
        service.deleteComment(testArticle.id, 'non-existent-id')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('addTagToArticle', () => {
    it('should add existing tag to article', async () => {
      const updatedArticle = await service.addTagToArticle(testArticle.id, {
        tagId: testTag.id,
      });

      expect(updatedArticle).toBeDefined();
      expect(updatedArticle.tags).toBeDefined();
      expect(updatedArticle.tags.length).toBeGreaterThanOrEqual(1);
      const testTagFound = updatedArticle.tags.find(
        (t) => t.name === 'integration-test'
      );
      expect(testTagFound).toBeDefined();
    });

    it('should create new tag and add to article', async () => {
      const uniqueTagName = `new-tag-${Date.now()}`;
      const updatedArticle = await service.addTagToArticle(testArticle.id, {
        tagName: uniqueTagName,
      });

      expect(updatedArticle).toBeDefined();
      expect(updatedArticle.tags).toBeDefined();
      const newTagFound = updatedArticle.tags.find(
        (t) => t.name === uniqueTagName
      );
      expect(newTagFound).toBeDefined();
    });

    it('should throw NotFoundException when neither tagId nor tagName provided', async () => {
      await expect(service.addTagToArticle(testArticle.id, {})).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('removeTagFromArticle', () => {
    beforeEach(async () => {
      // Add tag to article first
      await service.addTagToArticle(testArticle.id, { tagId: testTag.id });
    });

    it('should remove tag from article', async () => {
      const updatedArticle = await service.removeTagFromArticle(
        testArticle.id,
        testTag.id
      );

      expect(updatedArticle).toBeDefined();
      expect(updatedArticle.tags).toBeDefined();
      const testTagFound = updatedArticle.tags.find((t) => t.id === testTag.id);
      expect(testTagFound).toBeUndefined();
    });

    it('should throw NotFoundException for non-existent article or tag', async () => {
      await expect(
        service.removeTagFromArticle('non-existent-id', testTag.id)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTag', () => {
    it('should create a new tag', async () => {
      const uniqueTagName = `new-unique-tag-${Date.now()}`;
      const tag = await service.createTag(uniqueTagName);

      expect(tag).toBeDefined();
      expect(tag.name).toBe(uniqueTagName);
      expect(tag.id).toBeDefined();
    });

    it('should throw NotFoundException when tag already exists', async () => {
      await expect(
        service.createTag('integration-test') // This tag already exists
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllTags', () => {
    it('should return all tags', async () => {
      const tags = await service.findAllTags();

      expect(tags.length).toBeGreaterThanOrEqual(1);
      const testTagFound = tags.find((t) => t.name === 'integration-test');
      expect(testTagFound).toBeDefined();
    });
  });
});
