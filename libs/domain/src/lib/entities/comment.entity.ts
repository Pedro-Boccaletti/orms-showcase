export interface Comment {
  readonly id: string;
  articleId: string;
  content: string;
  authorId: string;
  readonly createdAt: Date;
}
