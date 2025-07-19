-- Seed data for Blog API - ORM Showcase
-- This file contains sample data for users, articles, and comments

-- Clear existing data (if any)
DELETE FROM comments;
DELETE FROM articles;
DELETE FROM users;

-- Insert sample users (IDs will be auto-generated as UUIDs)
INSERT INTO users (name, email, active) VALUES
('John Doe', 'john.doe@example.com', true),
('Jane Smith', 'jane.smith@example.com', true),
('Alice Johnson', 'alice.johnson@example.com', true),
('Bob Wilson', 'bob.wilson@example.com', true),
('Emma Davis', 'emma.davis@example.com', false),
('Michael Brown', 'michael.brown@example.com', true),
('Sarah Connor', 'sarah.connor@example.com', true),
('David Lee', 'david.lee@example.com', true);

-- Get user IDs for article references
-- Note: In a real scenario, you'd use the actual UUIDs returned from the inserts above
-- This is a simplified approach for seeding - in practice, you'd capture the generated IDs

-- Insert sample articles (using subqueries to get user IDs)
INSERT INTO articles (title, content, author_id, published_at) VALUES
('Getting Started with TypeScript', 
 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. In this comprehensive guide, we''ll explore the fundamentals of TypeScript and how it can improve your development workflow.

## Why TypeScript?

TypeScript offers several advantages over plain JavaScript:
- Static type checking
- Better IDE support
- Enhanced code maintainability
- Improved refactoring capabilities

## Basic Types

Let''s start with the basic types in TypeScript:

```typescript
let message: string = "Hello, TypeScript!";
let count: number = 42;
let isActive: boolean = true;
```

TypeScript helps catch errors at compile time, making your code more robust and reliable.',
 (SELECT id FROM users WHERE email = 'john.doe@example.com'), 
 '2024-01-15 10:00:00'),

('Understanding REST API Design', 
 'REST (Representational State Transfer) is an architectural style for designing networked applications. When building APIs, following REST principles ensures your API is scalable, maintainable, and easy to understand.

## Core REST Principles

1. **Stateless**: Each request must contain all information needed to process it
2. **Client-Server**: Clear separation between client and server
3. **Cacheable**: Responses should be cacheable when appropriate
4. **Uniform Interface**: Consistent interface design

## HTTP Methods

- **GET**: Retrieve data
- **POST**: Create new resources
- **PUT**: Update existing resources
- **PATCH**: Partial updates
- **DELETE**: Remove resources

## Status Codes

Understanding HTTP status codes is crucial:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error',
 (SELECT id FROM users WHERE email = 'jane.smith@example.com'), 
 '2024-01-20 14:30:00'),

('Database Design Best Practices', 
 'Good database design is the foundation of any successful application. Whether you''re using SQL or NoSQL databases, following best practices ensures your data is organized, performant, and maintainable.

## Normalization

Database normalization is the process of organizing data to reduce redundancy:

### First Normal Form (1NF)
- Eliminate repeating groups
- Each column should contain atomic values

### Second Normal Form (2NF)
- Must be in 1NF
- Remove partial dependencies

### Third Normal Form (3NF)
- Must be in 2NF
- Remove transitive dependencies

## Indexing Strategy

Proper indexing dramatically improves query performance:
- Index frequently queried columns
- Consider composite indexes for multi-column queries
- Monitor index usage and remove unused indexes

## Performance Considerations

- Use appropriate data types
- Implement proper constraints
- Regular maintenance and optimization',
 (SELECT id FROM users WHERE email = 'alice.johnson@example.com'), 
 '2024-01-25 09:15:00'),

('Modern JavaScript ES2023 Features', 
 'JavaScript continues to evolve with new features that make development more efficient and enjoyable. Let''s explore some of the latest additions to the language.

## Array Methods

New array methods provide powerful ways to manipulate data:

```javascript
// Array.prototype.findLast()
const numbers = [1, 2, 3, 4, 5];
const lastEven = numbers.findLast(n => n % 2 === 0); // 4

// Array.prototype.toReversed()
const reversed = numbers.toReversed(); // [5, 4, 3, 2, 1]
```

## Top-level await

You can now use await at the top level of modules:

```javascript
// module.js
const data = await fetch(''/api/data'').then(r => r.json());
export { data };
```

## Private class fields

True private fields in classes:

```javascript
class User {
  #id;
  #email;
  
  constructor(id, email) {
    this.#id = id;
    this.#email = email;
  }
  
  getId() {
    return this.#id;
  }
}
```',
 (SELECT id FROM users WHERE email = 'bob.wilson@example.com'), 
 '2024-02-01 16:45:00'),

('Docker for Developers', 
 'Docker has revolutionized how we build, ship, and run applications. Understanding Docker is essential for modern development workflows.

## What is Docker?

Docker is a containerization platform that packages applications and their dependencies into lightweight, portable containers.

## Key Concepts

### Images
- Read-only templates used to create containers
- Built from Dockerfiles
- Can be versioned and shared

### Containers
- Running instances of images
- Isolated from the host system
- Ephemeral by design

### Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Docker Compose

For multi-container applications:

```yaml
version: ''3.8''
services:
  web:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
```',
 (SELECT id FROM users WHERE email = 'john.doe@example.com'), 
 '2024-02-05 11:20:00');

-- Insert sample comments (using subqueries to get article and user IDs)
INSERT INTO comments (article_id, content, author_id, created_at) VALUES
-- Comments for TypeScript article
((SELECT id FROM articles WHERE title = 'Getting Started with TypeScript'), 
 'Great introduction! I''ve been hesitant to try TypeScript, but this makes it seem much more approachable.', 
 (SELECT id FROM users WHERE email = 'jane.smith@example.com'), 
 '2024-01-15 12:30:00'),

((SELECT id FROM articles WHERE title = 'Getting Started with TypeScript'), 
 'The code examples are really helpful. Do you have any recommendations for migrating an existing JavaScript project to TypeScript?', 
 (SELECT id FROM users WHERE email = 'alice.johnson@example.com'), 
 '2024-01-15 15:45:00'),

((SELECT id FROM articles WHERE title = 'Getting Started with TypeScript'), 
 'TypeScript has been a game-changer for our team. The type safety catches so many bugs early!', 
 (SELECT id FROM users WHERE email = 'bob.wilson@example.com'), 
 '2024-01-16 09:00:00'),

((SELECT id FROM articles WHERE title = 'Getting Started with TypeScript'), 
 '@alice.johnson I''d recommend starting with the strictest settings and gradually migrating file by file. It''s worth the effort!', 
 (SELECT id FROM users WHERE email = 'john.doe@example.com'), 
 '2024-01-16 10:15:00'),

-- Comments for REST API article
((SELECT id FROM articles WHERE title = 'Understanding REST API Design'), 
 'Excellent overview of REST principles! The status code section is particularly useful.', 
 (SELECT id FROM users WHERE email = 'john.doe@example.com'), 
 '2024-01-20 16:00:00'),

((SELECT id FROM articles WHERE title = 'Understanding REST API Design'), 
 'What''s your take on GraphQL vs REST? Are there scenarios where one is clearly better?', 
 (SELECT id FROM users WHERE email = 'bob.wilson@example.com'), 
 '2024-01-21 08:30:00'),

((SELECT id FROM articles WHERE title = 'Understanding REST API Design'), 
 'The HTTP methods explanation is crystal clear. Bookmarking this for future reference!', 
 (SELECT id FROM users WHERE email = 'michael.brown@example.com'), 
 '2024-01-21 14:20:00'),

((SELECT id FROM articles WHERE title = 'Understanding REST API Design'), 
 '@bob.wilson Great question! GraphQL excels for complex data fetching, while REST is simpler for CRUD operations.', 
 (SELECT id FROM users WHERE email = 'jane.smith@example.com'), 
 '2024-01-21 15:45:00'),

-- Comments for Database Design article
((SELECT id FROM articles WHERE title = 'Database Design Best Practices'), 
 'The normalization explanation is spot on. I wish I had read this before designing my first database!', 
 (SELECT id FROM users WHERE email = 'sarah.connor@example.com'), 
 '2024-01-25 11:30:00'),

((SELECT id FROM articles WHERE title = 'Database Design Best Practices'), 
 'Could you do a follow-up on NoSQL design patterns? The principles are quite different.', 
 (SELECT id FROM users WHERE email = 'jane.smith@example.com'), 
 '2024-01-25 13:15:00'),

((SELECT id FROM articles WHERE title = 'Database Design Best Practices'), 
 'The indexing section saved me hours of debugging. Performance improved dramatically after following these tips.', 
 (SELECT id FROM users WHERE email = 'david.lee@example.com'), 
 '2024-01-26 09:45:00'),

-- Comments for JavaScript ES2023 article
((SELECT id FROM articles WHERE title = 'Modern JavaScript ES2023 Features'), 
 'Top-level await is a game changer! No more IIFE wrappers for async module initialization.', 
 (SELECT id FROM users WHERE email = 'alice.johnson@example.com'), 
 '2024-02-01 18:00:00'),

((SELECT id FROM articles WHERE title = 'Modern JavaScript ES2023 Features'), 
 'The private class fields feature is long overdue. Finally, true encapsulation in JavaScript!', 
 (SELECT id FROM users WHERE email = 'michael.brown@example.com'), 
 '2024-02-02 10:30:00'),

((SELECT id FROM articles WHERE title = 'Modern JavaScript ES2023 Features'), 
 'Great examples! When do you think these features will have broader browser support?', 
 (SELECT id FROM users WHERE email = 'sarah.connor@example.com'), 
 '2024-02-02 14:15:00'),

((SELECT id FROM articles WHERE title = 'Modern JavaScript ES2023 Features'), 
 '@sarah.connor Most modern browsers already support these features. For older browsers, Babel can transpile them.', 
 (SELECT id FROM users WHERE email = 'bob.wilson@example.com'), 
 '2024-02-02 15:30:00'),

-- Comments for Docker article
((SELECT id FROM articles WHERE title = 'Docker for Developers'), 
 'Docker has completely changed our deployment process. This guide covers all the essentials!', 
 (SELECT id FROM users WHERE email = 'jane.smith@example.com'), 
 '2024-02-05 13:45:00'),

((SELECT id FROM articles WHERE title = 'Docker for Developers'), 
 'The Docker Compose example is perfect for getting started with multi-container apps.', 
 (SELECT id FROM users WHERE email = 'david.lee@example.com'), 
 '2024-02-05 16:20:00'),

((SELECT id FROM articles WHERE title = 'Docker for Developers'), 
 'Any tips for optimizing Docker image sizes? Our images are getting quite large.', 
 (SELECT id FROM users WHERE email = 'alice.johnson@example.com'), 
 '2024-02-06 09:00:00'),

((SELECT id FROM articles WHERE title = 'Docker for Developers'), 
 '@alice.johnson Use multi-stage builds, .dockerignore files, and alpine base images. Can reduce size by 70%+', 
 (SELECT id FROM users WHERE email = 'john.doe@example.com'), 
 '2024-02-06 10:30:00'),

((SELECT id FROM articles WHERE title = 'Docker for Developers'), 
 'Would love to see a follow-up on Docker security best practices!', 
 (SELECT id FROM users WHERE email = 'sarah.connor@example.com'), 
 '2024-02-06 11:45:00');

-- Display summary of inserted data
SELECT 'Seed data inserted successfully!' as message;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as article_count FROM articles;
SELECT COUNT(*) as comment_count FROM comments;

-- Display summary of inserted data
SELECT 'Seed data inserted successfully!' as message;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as article_count FROM articles;
SELECT COUNT(*) as comment_count FROM comments;