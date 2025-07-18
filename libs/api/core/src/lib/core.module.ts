import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [ArticlesModule, UsersModule],
})
export class CoreModule {}
