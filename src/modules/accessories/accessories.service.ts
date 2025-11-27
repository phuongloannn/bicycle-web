import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Accessory } from './entities/accessory.entity';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';

@Injectable()
export class AccessoriesService {
  constructor(
    @InjectRepository(Accessory)
    private accessoriesRepository: Repository<Accessory>,
  ) {}

  // GET ALL ACCESSORIES
  async findAll(): Promise<Accessory[]> {
    return this.accessoriesRepository.find({
      order: { created_at: 'DESC' }
    });
  }

  // SEARCH ACCESSORIES
  async search(query: string): Promise<Accessory[]> {
    return this.accessoriesRepository.find({
      where: [
        { name: Like(`%${query}%`) },
        { description: Like(`%${query}%`) },
        { category: Like(`%${query}%`) }
      ],
      order: { created_at: 'DESC' }
    });
  }

  // GET BY ID
  async findOne(id: number): Promise<Accessory> {
    const accessory = await this.accessoriesRepository.findOne({ where: { id } });
    if (!accessory) {
      throw new NotFoundException(`Accessory with ID ${id} not found`);
    }
    return accessory;
  }

  // CREATE ACCESSORY
  async create(createAccessoryDto: CreateAccessoryDto): Promise<Accessory> {
    const accessory = this.accessoriesRepository.create(createAccessoryDto);
    return this.accessoriesRepository.save(accessory);
  }

  // UPDATE ACCESSORY
  async update(id: number, updateAccessoryDto: UpdateAccessoryDto): Promise<Accessory> {
    const accessory = await this.findOne(id);
    
    Object.assign(accessory, updateAccessoryDto);
    return this.accessoriesRepository.save(accessory);
  }

  // DELETE ACCESSORY
  async remove(id: number): Promise<void> {
    const accessory = await this.findOne(id);
    await this.accessoriesRepository.remove(accessory);
  }
}