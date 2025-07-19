import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { ArticleEntity } from './article.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  active: boolean;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  comments: CommentEntity[];

  @ManyToOne(() => UserEntity, (user) => user.articles)
  articles: ArticleEntity[];
}
