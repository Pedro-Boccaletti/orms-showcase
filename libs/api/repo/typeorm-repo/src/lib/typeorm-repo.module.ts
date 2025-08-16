import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ArticleEntity } from './entities/article.entity';
import { CommentEntity } from './entities/comment.entity';
import { TagEntity } from './entities/tag.entity';
import { UserRepository } from './repositories/user.repository';
import { ArticleRepository } from './repositories/article.repository';
import { CommentRepository } from './repositories/comment.repository';
import { TagRepository } from './repositories/tag.repository';
import {
  ARTICLE_REPOSITORY,
  COMMENT_REPOSITORY,
  USER_REPOSITORY,
  TAG_REPOSITORY,
} from '@orms-showcase/domain';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true, // This automatically loads entities from forFeature
        synchronize: false,
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([
      UserEntity,
      ArticleEntity,
      CommentEntity,
      TagEntity,
    ]),
  ],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: TAG_REPOSITORY,
      useClass: TagRepository,
    },
    {
      provide: ARTICLE_REPOSITORY,
      useClass: ArticleRepository,
    },
    {
      provide: COMMENT_REPOSITORY,
      useClass: CommentRepository,
    },
  ],
  exports: [
    ARTICLE_REPOSITORY,
    COMMENT_REPOSITORY,
    USER_REPOSITORY,
    TAG_REPOSITORY,
  ],
})
export class TypeormRepoModule {}
