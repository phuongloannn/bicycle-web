import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  private async syncProductQuantity(productId: number) {
    const rows = await this.inventoryRepo.find({
      where: { product: { id: productId } as any },
    });

    if (!rows.length) {
      // Nếu không còn dòng inventory nào, có thể giữ nguyên quantity hiện tại
      return;
    }

    const totalAvailable = rows.reduce(
      (sum, row) => sum + (row.quantity - row.reserved),
      0,
    );

    await this.productRepo.update(
      { id: productId },
      { quantity: totalAvailable < 0 ? 0 : totalAvailable },
    );
  }

  async create(dto: CreateInventoryDto) {
    const item = this.inventoryRepo.create({
      quantity: dto.quantity,
      reserved: dto.reserved ?? 0,
      min_stock: dto.min_stock ?? 0,
      location: dto.location ?? null,
      product: { id: dto.product_id } as any,
      category: dto.category_id ? ({ id: dto.category_id } as any) : null,
    });

    const saved = await this.inventoryRepo.save(item);
    await this.syncProductQuantity(dto.product_id);
    return saved;
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
    const originalProductId = item.product?.id;

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

    const saved = await this.inventoryRepo.save(item);

    // Đồng bộ quantity cho product cũ và product mới (nếu đổi product_id)
    if (originalProductId && originalProductId !== (dto.product_id ?? originalProductId)) {
      await this.syncProductQuantity(originalProductId);
    }
    const productIdToSync = dto.product_id ?? originalProductId;
    if (productIdToSync) {
      await this.syncProductQuantity(productIdToSync);
    }

    return saved;
  }

  async adjustQuantity(id: number, delta: number) {
    const item = await this.findOne(id);
    item.quantity = Math.max(0, item.quantity + delta);
    const saved = await this.inventoryRepo.save(item);

    if (item.product?.id) {
      await this.syncProductQuantity(item.product.id);
    }

    return saved;
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    const productId = item.product?.id;
    await this.inventoryRepo.remove(item);

    if (productId) {
      await this.syncProductQuantity(productId);
    }

    return { message: 'Inventory item deleted successfully' };
  }
}


