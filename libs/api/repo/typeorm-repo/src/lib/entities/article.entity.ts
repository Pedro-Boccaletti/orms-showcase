import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';
import { TagEntity } from './tag.entity';

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

  @ManyToMany(() => TagEntity, (tag) => tag.articles)
  @JoinTable({
    name: 'article_tags',
    joinColumn: {
      name: 'article_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: TagEntity[];
}
