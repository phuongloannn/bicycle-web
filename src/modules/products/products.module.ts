import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities/product.entity';
import { ProductSpecification } from './product-specifications.entity';

import { ProductsController } from './products.controller';
import { ProductSpecificationsController } from './product-specifications.controller';

import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductSpecification   // ⭐ Quan trọng
    ]),
  ],
  controllers: [
    ProductsController,
    ProductSpecificationsController,
  ],
  providers: [
    ProductsService
  ],
})
export class ProductsModule {}
