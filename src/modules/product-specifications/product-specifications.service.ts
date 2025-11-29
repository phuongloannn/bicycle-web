import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSpecification } from './entities/product-specification.entity';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { UpdateProductSpecificationDto } from './dto/update-product-specification.dto';

@Injectable()
export class ProductSpecificationsService {
  constructor(
    @InjectRepository(ProductSpecification)
    private specsRepository: Repository<ProductSpecification>,
  ) {}

  async create(createSpecDto: CreateProductSpecificationDto): Promise<ProductSpecification> {
    const specification = this.specsRepository.create(createSpecDto);
    return await this.specsRepository.save(specification);
  }

  async findByProductId(productId: number): Promise<ProductSpecification> {
    const specification = await this.specsRepository.findOne({
      where: { productId } // ✅ Sửa thành productId (theo entity)
    });

    if (!specification) {
      throw new NotFoundException(`Specifications for product ${productId} not found`);
    }

    return specification;
  }

  async updateByProductId(productId: number, updateSpecDto: UpdateProductSpecificationDto): Promise<ProductSpecification> {
    const specification = await this.findByProductId(productId);
    
    Object.assign(specification, updateSpecDto);
    return await this.specsRepository.save(specification);
  }

  async removeByProductId(productId: number): Promise<void> {
    const specification = await this.findByProductId(productId);
    await this.specsRepository.remove(specification);
  }

  async findAll(): Promise<ProductSpecification[]> {
    return await this.specsRepository.find();
  }
}