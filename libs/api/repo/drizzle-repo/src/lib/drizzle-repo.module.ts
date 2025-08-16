import { Module } from '@nestjs/common';
import {
  ARTICLE_REPOSITORY,
  COMMENT_REPOSITORY,
  TAG_REPOSITORY,
  USER_REPOSITORY,
} from '@orms-showcase/domain';
import { ArticleRepository } from './repositories/article.repository';
import { UserRepository } from './repositories/user.repository';
import { CommentRepository } from './repositories/comment.repository';
import { TagRepository } from './repositories/tag.repository';
import { drizzleProvider } from './drizzle.provider';

@Module({
  imports: [],
  controllers: [],
  providers: [
    ...drizzleProvider,
    {
      provide: ARTICLE_REPOSITORY,
      useClass: ArticleRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: COMMENT_REPOSITORY,
      useClass: CommentRepository,
    },
    {
      provide: TAG_REPOSITORY,
      useClass: TagRepository,
    },
  ],
  exports: [
    ARTICLE_REPOSITORY,
    USER_REPOSITORY,
    COMMENT_REPOSITORY,
    TAG_REPOSITORY,
  ],
})
export class DrizzleRepoModule {}
