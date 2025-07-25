import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ArticleEntity } from './article.entity';

@Entity('tags')
export class TagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => ArticleEntity, (article) => article.tags)
  articles: ArticleEntity[];
}
