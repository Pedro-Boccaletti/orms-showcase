# ORM Showcase Architecture

## Service Architecture Diagram

```mermaid
graph TD
    subgraph apps["🚀 Applications"]
        blog_api["Blog API App"]
        blog_api_e2e["E2E Tests"]
    end

    domain["Domain Entities<br/>DTOs & Interfaces"]

    subgraph libs_api["⚙️ API Libraries"]
        api_core["Core Module"]
        articles_module["Articles Module"]
        users_module["Users Module"]
        repository_config["Repository Config<br/>Dynamic ORM Selection"]
    end

    subgraph libs_repos["🗄️ Repository Libraries"]
        typeorm_repo[("TypeORM Repository")]
        prisma_repo[("Prisma Repository")]
        drizzle_repo[("Drizzle Repository")]
    end

    %% Main app dependencies
    blog_api --> api_core
    blog_api_e2e -.-> blog_api

    %% Core module dependencies
    api_core --> articles_module
    api_core --> users_module
    api_core --> repository_config

    %% Business modules depend on domain
    articles_module -->|uses types| domain
    users_module -->|uses types| domain

    %% Repository config selects ORM implementation
    repository_config -->|injects one| libs_repos

    %% All repositories implement domain interfaces
    libs_repos -->|implements| domain

    %% All repositories connect to the database
    libs_repos -->|connects to| database[(Database)]

    %% Enhanced Styling
    classDef appNode fill:#1e293b,stroke:#3b82f6,stroke-width:3px,color:#ffffff,font-weight:bold
    classDef domainNode fill:#7c3aed,stroke:#a855f7,stroke-width:3px,color:#ffffff,font-weight:bold
    classDef apiNode fill:#059669,stroke:#10b981,stroke-width:3px,color:#ffffff,font-weight:bold
    classDef repoNode fill:#dc2626,stroke:#ef4444,stroke-width:3px,color:#ffffff,font-weight:bold
    classDef databaseNode fill:#92400e,stroke:#f59e0b,stroke-width:4px,color:#ffffff,font-weight:bold

    %% Subgraph styling
    style apps fill:#f8fafc,stroke:#334155,stroke-width:2px,stroke-dasharray: 5 5
    style libs_api fill:#f0fdf4,stroke:#166534,stroke-width:2px,stroke-dasharray: 5 5
    style libs_repos fill:#fef2f2,stroke:#991b1b,stroke-width:2px,stroke-dasharray: 5 5

    %% Apply classes to nodes
    class blog_api,blog_api_e2e appNode
    class domain domainNode
    class api_core,articles_module,users_module,repository_config apiNode
    class typeorm_repo,prisma_repo,drizzle_repo repoNode
    class database databaseNode
```

## Database Schema Relationships

```mermaid
erDiagram
    users {
        uuid id PK
        varchar name
        varchar email UK
        boolean active
    }

    articles {
        uuid id PK
        varchar title
        text content
        uuid author_id FK
        timestamp published_at
    }

    comments {
        uuid id PK
        text content
        uuid article_id FK
        uuid author_id FK
        timestamp created_at
    }

    tags {
        uuid id PK
        varchar name UK
    }

    article_tags {
        uuid article_id FK
        uuid tag_id FK
    }

    users ||--o{ articles : "authors"
    users ||--o{ comments : "writes"
    articles ||--o{ comments : "has"
    articles }o--o{ tags : "tagged_with"
    articles }o--|| article_tags : ""
    tags }o--|| article_tags : ""
```

## ORM Strategy Pattern

```mermaid
graph LR
    Service[Articles/Users Service] --> Interface[Repository Interface<br/>Domain Layer]
    Interface --> Strategy{ORM Strategy}
    Strategy -->|REPOSITORY_TYPE| TypeORM[TypeORM Implementation]
    Strategy -->|REPOSITORY_TYPE| Drizzle[Drizzle Implementation<br/>🚧 Coming Soon]
    Strategy -->|REPOSITORY_TYPE| Prisma[Prisma Implementation<br/>🚧 Coming Soon]

    TypeORM --> TypeORMEntities[TypeORM Entities]
    Drizzle --> DrizzleSchema[Drizzle Schema]
    Prisma --> PrismaSchema[Prisma Schema]

    TypeORMEntities --> Database[(PostgreSQL)]
    DrizzleSchema --> Database
    PrismaSchema --> Database

    %% Enhanced Styling with Modern Colors
    classDef service fill:#667eea,stroke:#4c51bf,stroke-width:3px,color:#ffffff
    classDef interface fill:#f093fb,stroke:#c53030,stroke-width:2px,color:#ffffff
    classDef strategy fill:#4fd1c7,stroke:#319795,stroke-width:3px,color:#ffffff
    classDef activeImplementation fill:#48bb78,stroke:#38a169,stroke-width:2px,color:#ffffff
    classDef comingSoon fill:#fed7d7,stroke:#fc8181,stroke-width:2px,stroke-dasharray:8 4,color:#742a2a
    classDef entities fill:#fbb6ce,stroke:#d53f8c,stroke-width:2px,color:#ffffff
    classDef database fill:#ffd89b,stroke:#f6ad55,stroke-width:3px,color:#744210

    class Service service
    class Interface interface
    class Strategy strategy
    class TypeORM,TypeORMEntities activeImplementation
    class Drizzle,DrizzleSchema,Prisma,PrismaSchema comingSoon
    class Database database
```

## Key Features

- **Multi-ORM Support**: Pluggable repository pattern allowing different ORM implementations
- **Clean Architecture**: Separation of concerns with domain, application, and infrastructure layers
- **NestJS Framework**: Enterprise-grade Node.js framework with dependency injection
- **PostgreSQL Database**: Relational database with UUID primary keys
- **Docker Support**: Containerized database setup
- **Validation**: Request validation using class-validator
- **OpenAPI Specification**: Complete API documentation

## Environment Configuration

The application uses environment variables to determine which ORM implementation to use:

- `REPOSITORY_TYPE=typeorm` - Uses TypeORM (currently implemented)
- `REPOSITORY_TYPE=drizzle` - Will use Drizzle (planned)
- `REPOSITORY_TYPE=prisma` - Will use Prisma (planned)
