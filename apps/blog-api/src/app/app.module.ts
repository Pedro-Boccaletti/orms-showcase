import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from '@orms-showcase/core';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Core module (includes repositories and business logic)
    CoreModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
