import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm'; // 🔥 THÊM 'ILike' cho case-insensitive
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/requests/create-product.dto';
import { UpdateProductDto } from './dto/requests/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  // 🔥 TỐI ƯU METHOD SEARCH - hỗ trợ nhiều từ
  async searchProducts(query: string): Promise<Product[]> {
    if (!query || query.trim() === '') {
      return this.findAll();
    }

    const searchTerm = query.trim();
    
    // Tách thành các từ riêng biệt để tìm kiếm linh hoạt hơn
    const words = searchTerm.split(/\s+/).filter(word => word.length > 0);
    
    if (words.length === 0) {
      return this.findAll();
    }

    // Nếu chỉ có 1 từ, tìm kiếm đơn giản
    if (words.length === 1) {
      const searchQuery = `%${words[0]}%`;
      return await this.productRepository.find({
        where: [
          { name: ILike(searchQuery) },        // ILike cho case-insensitive
          { description: ILike(searchQuery) },
          { category: ILike(searchQuery) }
        ],
      });
    }

    // Nếu có nhiều từ, tìm kiếm kết hợp
    const searchQueries = words.map(word => `%${word}%`);
    
    // Tạo điều kiện OR cho mỗi từ trong mỗi trường
    const whereConditions = searchQueries.flatMap(searchQuery => [
      { name: ILike(searchQuery) },
      { description: ILike(searchQuery) },
      { category: ILike(searchQuery) }
    ]);

    return await this.productRepository.find({
      where: whereConditions,
    });
  }

  // 🔥 THÊM TÌM KIẾM NÂNG CAO (tùy chọn)
  async advancedSearch(searchParams: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> {
    const { query, category, minPrice, maxPrice } = searchParams;
    
    const qb = this.productRepository.createQueryBuilder('product');
    
    if (query) {
      qb.andWhere('(product.name ILIKE :query OR product.description ILIKE :query)', {
        query: `%${query}%`
      });
    }
    
    if (category) {
      qb.andWhere('product.category ILIKE :category', {
        category: `%${category}%`
      });
    }
    
    if (minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice });
    }
    
    if (maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }
    
    return await qb.getMany();
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      order: { id: 'ASC' } // 🔥 THÊM SẮP XẾP MẶC ĐỊNH
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  // 🔥 TỐI ƯU UPDATE - chỉ update các field được gửi lên
  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    
    // Chỉ update các field có trong DTO
    const updatedProduct = this.productRepository.merge(product, updateProductDto);
    
    return await this.productRepository.save(updatedProduct);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  // 🔥 THÊM METHOD COUNT (tùy chọn)
  async count(): Promise<number> {
    return await this.productRepository.count();
  }
}