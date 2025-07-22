import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column('uuid', { name: 'author_id' })
  authorId: string;

  @Column({
    type: 'timestamp',
    name: 'published_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  publishedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.articles)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.article)
  comments: CommentEntity[];
}
