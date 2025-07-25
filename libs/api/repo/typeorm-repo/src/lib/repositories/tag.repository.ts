import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITagRepository, Tag } from '@orms-showcase/domain';
import { TagEntity } from '../entities/tag.entity';

@Injectable()
export class TagRepository implements ITagRepository {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    return tag;
  }

  async findByName(name: string): Promise<Tag | null> {
    const tag = await this.tagRepository.findOne({ where: { name } });
    return tag;
  }

  async create(name: string): Promise<Tag> {
    const existingTag = await this.findByName(name);
    if (existingTag) return existingTag;

    const tag = this.tagRepository.create({ name });
    return this.tagRepository.save(tag);
  }

  async update(id: string, name: string): Promise<Tag | null> {
    const tag = await this.findById(id);
    if (!tag) return null;

    tag.name = name;
    return this.tagRepository.save(tag);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.tagRepository.delete(id);
    return result.affected ? true : false;
  }
}
