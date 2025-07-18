import { Comment } from './comment.entity';

export interface Article {
  readonly id: string;
  title: string;
  content: string;
  authorId: string;
  readonly publishedAt: Date;
  comments: Comment[];
}
