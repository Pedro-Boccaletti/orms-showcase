-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT true
);

-- Articles Table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL,
  published_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),

  CONSTRAINT fk_article_author FOREIGN KEY (author_id)
    REFERENCES users(id) ON DELETE CASCADE
);

-- Comments Table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  article_id UUID NOT NULL,
  author_id UUID NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),

  CONSTRAINT fk_comment_article FOREIGN KEY (article_id)
    REFERENCES articles(id) ON DELETE CASCADE,
  CONSTRAINT fk_comment_user FOREIGN KEY (author_id)
    REFERENCES users(id) ON DELETE CASCADE
);

-- Tags Table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL UNIQUE
);

-- Article-Tags Table (Many-to-Many Relationship)
CREATE TABLE article_tags (
  article_id UUID NOT NULL,
  tag_id UUID NOT NULL,

  PRIMARY KEY (article_id, tag_id),
  
  CONSTRAINT fk_article_tag_article FOREIGN KEY (article_id)
    REFERENCES articles(id) ON DELETE CASCADE,
  CONSTRAINT fk_article_tag_tag FOREIGN KEY (tag_id)
    REFERENCES tags(id) ON DELETE CASCADE
);
