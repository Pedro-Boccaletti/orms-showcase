# ORM Showcase Architecture

## Service Architecture Diagram

```mermaid
graph TB
    %% External Layer
    Client[Client/Browser] --> API[Blog API<br/>:3000]

    %% Application Layer
    API --> AppModule[App Module<br/>NestJS Application]
    AppModule --> CoreModule[Core Module<br/>Business Logic]

    %% Core Services
    CoreModule --> ArticlesModule[Articles Module]
    CoreModule --> UsersModule[Users Module]
    CoreModule --> RepoConfig[Repository Config Module]

    %% Controllers & Services
    ArticlesModule --> ArticlesController[Articles Controller]
    ArticlesModule --> ArticlesService[Articles Service]
    UsersModule --> UsersController[Users Controller]
    UsersModule --> UsersService[Users Service]

    %% Repository Abstraction Layer
    RepoConfig --> RepoChoice{REPOSITORY_TYPE<br/>Environment Variable}
    RepoChoice -->|typeorm| TypeORMRepo[TypeORM Repository Module]
    RepoChoice -->|drizzle| DrizzleRepo[Drizzle Repository Module<br/>🚧 Coming Soon]
    RepoChoice -->|prisma| PrismaRepo[Prisma Repository Module<br/>🚧 Coming Soon]

    %% Repository Implementations
    TypeORMRepo --> DB[(PostgreSQL Database)]

    %% Enhanced Styling
    classDef client fill:#4a90e2,stroke:#2c5282,stroke-width:3px,color:#ffffff
    classDef application fill:#38a169,stroke:#2f855a,stroke-width:2px,color:#ffffff
    classDef core fill:#805ad5,stroke:#553c9a,stroke-width:2px,color:#ffffff
    classDef repository fill:#ed8936,stroke:#c05621,stroke-width:2px,color:#ffffff
    classDef database fill:#e53e3e,stroke:#c53030,stroke-width:3px,color:#ffffff
    classDef environment fill:#319795,stroke:#2c7a7b,stroke-width:2px,color:#ffffff
    classDef comingSoon fill:#a0aec0,stroke:#718096,stroke-width:2px,stroke-dasharray:5 5,color:#2d3748

    class Client client
    class API,AppModule application
    class CoreModule,ArticlesModule,UsersModule,ArticlesController,ArticlesService,UsersController,UsersService core
    class RepoConfig,TypeORMRepo repository
    class DB database
    class RepoChoice environment
    class DrizzleRepo,PrismaRepo comingSoon
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

## API Endpoints Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as Articles Controller
    participant AS as Articles Service
    participant AR as Article Repository
    participant DB as PostgreSQL

    C->>AC: GET /articles
    AC->>AS: findAll()
    AS->>AR: findAll()
    AR->>DB: SELECT * FROM articles
    DB-->>AR: Article records
    AR-->>AS: Article entities
    AS-->>AC: Article DTOs
    AC-->>C: JSON Response

    C->>AC: POST /articles
    AC->>AS: create(articleDto)
    AS->>AR: save(article)
    AR->>DB: INSERT INTO articles
    DB-->>AR: Created article
    AR-->>AS: Article entity
    AS-->>AC: Article DTO
    AC-->>C: 201 Created
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
