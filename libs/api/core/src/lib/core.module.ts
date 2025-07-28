import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import {
  RepositoryConfigModule,
  Repositories,
} from './config/repository.config';

@Module({
  imports: [
    // Repository configuration module
    RepositoryConfigModule.forRoot(
      process.env['REPOSITORY_TYPE'] as Repositories
    ),
    ArticlesModule,
    UsersModule,
  ],
  providers: [],
})
export class CoreModule {}
