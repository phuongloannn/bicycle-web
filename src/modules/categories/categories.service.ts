import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  private slugify(text: string): string {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug || this.slugify(dto.name);

    const category = this.categoryRepo.create({
      ...dto,
      slug,
      parent: dto.parent_id ? { id: dto.parent_id } : undefined,
    });

    return await this.categoryRepo.save(category);
  }

  async findAll() {
    return await this.categoryRepo.find({
      relations: ['parent', 'children'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    // Re-generate slug if name changes
    if (dto.name && !dto.slug) {
      dto.slug = this.slugify(dto.name);
    }

    Object.assign(category, {
      ...dto,
      parent: dto.parent_id ? { id: dto.parent_id } : null,
    });

    return await this.categoryRepo.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
    return { message: 'Category deleted successfully' };
  }
}
