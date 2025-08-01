# 🧰 ORM Showcase Repository

This repository demonstrates how to implement the same **Blog API** using different Object-Relational Mappers (ORMs) and query builders. The goal is to provide a side-by-side comparison of developer experience and patterns.

---

## 📚 Purpose

- Explore and compare ORM libraries
- Provide minimal, consistent API implementations with different ORM libraries
- Serve as a reference for developers choosing between ORMs

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker (for database)

### Running the Application

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd orms-showcase
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set database environment variables**

   Edit .env to configure your database

   ```bash
   cp .env.example .env
   ```

4. **Set app environment variables**
   Edit app .env to configure REPOSITORY_TYPE

   ```bash
   cd apps/blog-api && cp .env.example .env
   ```

5. **Start the database (if using docker)**

   ```bash
   npm run compose:up
   ```

6. **Create Database, apply schema and seed test data**

   ```bash
   npm run setup
   ```

7. **Start the development server**
   ```bash
   npm run serve:dev
   ```

The API will be available at `http://localhost:3000`

---

## 🔗 Implementations

| ORM / Tool | Status             | Repository Library                                            |
| ---------- | ------------------ | ------------------------------------------------------------- |
| TypeORM    | ✅ **Implemented** | [`/libs/api/repo/typeorm-repo`](./libs/api/repo/typeorm-repo) |
| Prisma     | 🚧 **Coming Soon** | [`/libs/api/repo/prisma-repo`](./libs/api/repo/prisma-repo)   |
| Drizzle    | 🚧 **Coming Soon** | [`/libs/api/repo/drizzle-repo`](./libs/api/repo/drizzle-repo) |

> This project uses a **monorepo architecture** with pluggable repository implementations. The active ORM is selected via the `REPOSITORY_TYPE` environment variable in the main Blog API application.

---

## 📘 OpenAPI Specification

You can view the full OpenAPI spec here:

## 👉 [`openapi.yaml`](./openapi.yaml)

## 🧪 Testing

Planned

---

## 📝 Contributing

Pull requests with new ORMs or improvements to existing ones are welcome! Please ensure:

- Data repository must be inside [`/libs/api/repo`](./libs/api/repo)
- API structure follows the pattern described above
- Follow the configuration pattern in [`/libs/api/core/config`](./libs/api/core/src/lib/config/repository.config.ts)

---

## 📄 License

MIT License.
