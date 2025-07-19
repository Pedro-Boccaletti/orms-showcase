import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';

@Entity()
export class ArticleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column('uuid', { name: 'author_id' })
  authorId: string;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.articles)
  author: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.articleId)
  comments: CommentEntity[];
}
