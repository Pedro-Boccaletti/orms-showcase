import { DynamicModule, Module } from '@nestjs/common';
import { TypeormRepoModule } from '@orms-showcase/typeorm-repo';
// import { DrizzleRepoModule } from '@orms-showcase/drizzle-repo';
// import { PrismaRepoModule } from '@orms-showcase/prisma-repo';

export enum Repositories {
  //  DRIZZLE = 'drizzle',
  TYPEORM = 'typeorm',
  //  PRISMA = 'prisma',
}

const RepositoryModules = {
  //  [Repositories.DRIZZLE]: DrizzleRepoModule,
  [Repositories.TYPEORM]: TypeormRepoModule,
  //  [Repositories.PRISMA]: PrismaRepoModule,
};

@Module({})
export class RepositoryConfigModule {
  static forRoot(repositoryType: Repositories): DynamicModule {
    if (!Object.values(Repositories).includes(repositoryType)) {
      throw new Error(`Unknown repository type: ${repositoryType}`);
    }
    return {
      module: RepositoryConfigModule,
      imports: [RepositoryModules[repositoryType]],
      exports: [RepositoryModules[repositoryType]],
      global: true, // This makes all providers from this module available globally
    };
  }
}
