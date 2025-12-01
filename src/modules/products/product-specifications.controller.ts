import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// ⭐ IMPORT BỊ THIẾU — LỖI CHÍNH
import { ProductSpecification } from './product-specifications.entity';

@Controller('product-specifications')
export class ProductSpecificationsController {

  constructor(
    @InjectRepository(ProductSpecification)
    private specRepo: Repository<ProductSpecification>,
  ) {}

  @Get('product/:productId')
  async getSpecs(@Param('productId') productId: number) {
    return this.specRepo.findOne({
      where: { product_id: productId }
    });
  }
}
