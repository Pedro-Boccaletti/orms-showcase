import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ArticlesModule, UsersModule],
  providers: [],
})
export class CoreModule {}
