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
    const products = await this.productRepository.find({
      where: [
        { name: ILike(searchQuery) },        // ILike cho case-insensitive
        { description: ILike(searchQuery) },
        { category: ILike(searchQuery) }
      ],
      relations: ['categoryRelation'],
    });
    return this.transformProducts(products);
    }

    // Nếu có nhiều từ, tìm kiếm kết hợp
    const searchQueries = words.map(word => `%${word}%`);
    
    // Tạo điều kiện OR cho mỗi từ trong mỗi trường
    const whereConditions = searchQueries.flatMap(searchQuery => [
      { name: ILike(searchQuery) },
      { description: ILike(searchQuery) },
      { category: ILike(searchQuery) }
    ]);

    const products = await this.productRepository.find({
      where: whereConditions,
      relations: ['categoryRelation'],
    });
    return this.transformProducts(products);
  }

  // 🔥 THÊM TÌM KIẾM NÂNG CAO (tùy chọn)
  async advancedSearch(searchParams: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> {
    const { query, category, minPrice, maxPrice } = searchParams;
    
    const qb = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.categoryRelation', 'category');
    
    if (query) {
      qb.andWhere('(product.name ILIKE :query OR product.description ILIKE :query)', {
        query: `%${query}%`
      });
    }
    
    if (category) {
      qb.andWhere('(product.category ILIKE :category OR category.name ILIKE :category)', {
        category: `%${category}%`
      });
    }
    
    if (minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice });
    }
    
    if (maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }
    
    const products = await qb.getMany();
    return this.transformProducts(products);
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  private transformProduct(product: Product): Product {
    // Map categoryRelation.name vào category field nếu có
    if (product.categoryRelation && !product.category) {
      product.category = product.categoryRelation.name;
    }
    return product;
  }

  private transformProducts(products: Product[]): Product[] {
    return products.map(p => this.transformProduct(p));
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productRepository.find({
      relations: ['categoryRelation'],
      order: { id: 'ASC' } // 🔥 THÊM SẮP XẾP MẶC ĐỊNH
    });
    return this.transformProducts(products);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ 
      where: { id },
      relations: ['categoryRelation']
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return this.transformProduct(product);
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