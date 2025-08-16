import { Tag } from '../entities/tag.entity';

export abstract class ITagRepository {
  abstract findAll(): Promise<Tag[]>;
  abstract findById(id: string): Promise<Tag | null>;
  abstract findByName(name: string): Promise<Tag | null>;
  abstract create(name: string): Promise<Tag>;
  abstract update(id: string, name: string): Promise<Tag | null>;
  abstract delete(id: string): Promise<boolean>;
}
