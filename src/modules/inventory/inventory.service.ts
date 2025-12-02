import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async create(dto: CreateInventoryDto) {
    const item = this.inventoryRepo.create({
      quantity: dto.quantity,
      reserved: dto.reserved ?? 0,
      min_stock: dto.min_stock ?? 0,
      location: dto.location ?? null,
      product: { id: dto.product_id } as any,
      category: dto.category_id ? ({ id: dto.category_id } as any) : null,
    });

    return this.inventoryRepo.save(item);
  }

  findAll() {
    return this.inventoryRepo.find({
      relations: ['product', 'category'],
      order: { id: 'ASC' },
    });
  }

  findByProduct(productId: number) {
    return this.inventoryRepo.find({
      where: { product: { id: productId } },
      relations: ['product', 'category'],
    });
  }

  async findOne(id: number) {
    const item = await this.inventoryRepo.findOne({
      where: { id },
      relations: ['product', 'category'],
    });
    if (!item) throw new NotFoundException('Inventory item not found');
    return item;
  }

  async update(id: number, dto: UpdateInventoryDto) {
    const item = await this.findOne(id);

    if (dto.product_id !== undefined) {
      (item as any).product = { id: dto.product_id };
    }
    if (dto.category_id !== undefined) {
      (item as any).category = dto.category_id
        ? ({ id: dto.category_id } as any)
        : null;
    }

    if (dto.quantity !== undefined) item.quantity = dto.quantity;
    if (dto.reserved !== undefined) item.reserved = dto.reserved;
    if (dto.min_stock !== undefined) item.min_stock = dto.min_stock;
    if (dto.location !== undefined) item.location = dto.location ?? null;

    return this.inventoryRepo.save(item);
  }

  async adjustQuantity(id: number, delta: number) {
    const item = await this.findOne(id);
    item.quantity = Math.max(0, item.quantity + delta);
    return this.inventoryRepo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.inventoryRepo.remove(item);
    return { message: 'Inventory item deleted successfully' };
  }
}


