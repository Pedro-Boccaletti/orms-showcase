import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { ArticleEntity } from './article.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];
}
