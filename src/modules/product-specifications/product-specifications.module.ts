import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSpecificationsService } from './product-specifications.service';
import { ProductSpecificationsController } from './product-specifications.controller';
import { ProductSpecification } from './entities/product-specification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSpecification])],
  controllers: [ProductSpecificationsController],
  providers: [ProductSpecificationsService],
  exports: [ProductSpecificationsService],
})
export class ProductSpecificationsModule {}