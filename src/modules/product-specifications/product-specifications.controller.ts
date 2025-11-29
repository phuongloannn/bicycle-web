// src/modules/product-specifications/product-specifications.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ProductSpecificationsService } from './product-specifications.service';

@Controller('product-specifications')
export class ProductSpecificationsController {
  constructor(private readonly specsService: ProductSpecificationsService) {}

  @Get('product/:productId')
  async getByProductId(@Param('productId') productId: number) {
    return this.specsService.findByProductId(productId);
  }
}