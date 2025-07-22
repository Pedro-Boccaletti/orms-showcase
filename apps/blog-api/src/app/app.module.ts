import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from '@orms-showcase/core';
import {
  RepositoryConfigModule,
  Repositories,
} from './config/repository.config';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Repository configuration module
    RepositoryConfigModule.forRoot(
      process.env['REPOSITORY_TYPE'] as Repositories
    ),

    // Core module (includes repositories and business logic)
    CoreModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
