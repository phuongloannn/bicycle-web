import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Accessory } from './entities/accessory.entity';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';

// 🔥 CORRECTED BIKE TYPE MAPPING - BASED ON PRODUCTS TABLE
const BIKE_TYPE_MAPPING = {
  'Mountain Bike': 1,        // Product ID 1
  'Kids Bike': 2,            // Product ID 2  
  'Touring Bike': 3,         // Product ID 3
  'Road Bike': 4,            // Product ID 4
};

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

  // 🔥 FIXED: FIND COMPATIBLE ACCESSORIES BY BIKE TYPE ID
  async findCompatibleByBikeType(bikeTypeId: number): Promise<Accessory[]> {
    const allAccessories = await this.accessoriesRepository.find({
      where: { in_stock: 1 },
      order: { category: 'ASC', price: 'ASC' }
    });

    // 🔥 FIX: Filter bằng JavaScript vì compatible_with là string JSON
    return allAccessories.filter(accessory => {
      if (!accessory.compatible_with) return false;
      
      try {
        const compatibleArray = JSON.parse(accessory.compatible_with);
        return Array.isArray(compatibleArray) && compatibleArray.includes(bikeTypeId);
      } catch (error) {
        console.error('Error parsing compatible_with:', accessory.compatible_with);
        return false;
      }
    });
  }

  // 🔥 FIXED: FIND COMPATIBLE ACCESSORIES BY PRODUCT ID
  async findCompatibleByProductId(productId: number): Promise<any> {
    try {
      // Get product using raw query
      const productQuery = `SELECT * FROM products WHERE id = ?`;
      const [products] = await this.accessoriesRepository.manager.query(productQuery, [productId]);
      
      if (products.length === 0) {
        throw new NotFoundException('Product not found');
      }
      
      const product = products[0];
      
      // 🔥 FIX: Check if bike_type exists and is in mapping
      if (!product.bike_type || !BIKE_TYPE_MAPPING[product.bike_type]) {
        return {
          product: product.name,
          bike_type: product.bike_type || 'Not specified',
          category: product.category,
          message: 'Product does not have compatible bike type mapping',
          compatible_accessories: []
        };
      }
      
      const bikeTypeId = BIKE_TYPE_MAPPING[product.bike_type];
      const compatibleAccessories = await this.findCompatibleByBikeType(bikeTypeId);
      
      return {
        product: product.name,
        bike_type: product.bike_type,
        category: product.category,
        compatible_accessories: compatibleAccessories
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Error finding product or compatible accessories');
    }
  }

  // 🔥 NEW: GET ALL BIKE TYPES MAPPING (for frontend)
  getBikeTypesMapping(): any {
    return {
      mapping: BIKE_TYPE_MAPPING,
      available_bike_types: Object.keys(BIKE_TYPE_MAPPING)
    };
  }

  // 🔥 FIXED: FIND ACCESSORIES BY MULTIPLE BIKE TYPES
  async findCompatibleByBikeTypes(bikeTypes: string[]): Promise<Accessory[]> {
    const bikeTypeIds = bikeTypes.map(type => BIKE_TYPE_MAPPING[type]).filter(id => id);
    
    if (bikeTypeIds.length === 0) {
      return [];
    }

    const allAccessories = await this.accessoriesRepository.find({
      where: { in_stock: 1 },
      order: { category: 'ASC', price: 'ASC' }
    });

    // 🔥 FIX: Filter bằng JavaScript
    return allAccessories.filter(accessory => {
      if (!accessory.compatible_with) return false;
      
      try {
        const compatibleArray = JSON.parse(accessory.compatible_with);
        return Array.isArray(compatibleArray) && 
               compatibleArray.some(id => bikeTypeIds.includes(id));
      } catch (error) {
        console.error('Error parsing compatible_with:', accessory.compatible_with);
        return false;
      }
    });
  }

  // 🔥 NEW: GET COMPATIBLE ACCESSORIES BY BIKE TYPE NAME
  async findCompatibleByBikeTypeName(bikeTypeName: string): Promise<Accessory[]> {
    const bikeTypeId = BIKE_TYPE_MAPPING[bikeTypeName];
    if (!bikeTypeId) {
      return [];
    }
    return this.findCompatibleByBikeType(bikeTypeId);
  }

  // 🔥 NEW: PARSE COMPATIBLE_WITH STRING TO NUMBER[]
  parseCompatibleWith(compatibleWith: string): number[] {
    if (!compatibleWith) return [];
    
    try {
      const parsed = JSON.parse(compatibleWith);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing compatible_with:', compatibleWith);
      return [];
    }
  }

  // 🔥 FIXED: GET PRODUCTS WITH COMPATIBLE ACCESSORIES (SIMPLE VERSION)
  async getProductsWithCompatibility(): Promise<any[]> {
    try {
      const productsQuery = `SELECT * FROM products WHERE bike_type IS NOT NULL`;
      const [products] = await this.accessoriesRepository.manager.query(productsQuery);
      
      const result: any[] = [];
      
      for (const product of products) {
        const bikeTypeId = BIKE_TYPE_MAPPING[product.bike_type];
        
        if (bikeTypeId) {
          const compatibleAccessories = await this.findCompatibleByBikeType(bikeTypeId);
          
          result.push({
            product_id: product.id,
            product_name: product.name,
            bike_type: product.bike_type,
            category: product.category,
            compatible_accessories_count: compatibleAccessories.length,
            compatible_accessories: compatibleAccessories
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error getting products with compatibility:', error);
      return [];
    }
  }
}