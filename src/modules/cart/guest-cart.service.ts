import { Injectable, NotFoundException, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class GuestCartService {
  private readonly logger = new Logger(GuestCartService.name);

  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async addToCart(sessionId: string, productId: number, quantity: number): Promise<Cart> {
    try {
      const product = await this.productRepository.findOne({ where: { id: productId } });
      if (!product) throw new NotFoundException('Product not found');
      if (product.quantity < quantity) throw new BadRequestException('Insufficient stock');

      const existing = await this.cartRepository.findOne({ where: { sessionId, productId } });
      if (existing) {
        existing.quantity += quantity;
        return this.cartRepository.save(existing);
      }

      const cartItem = this.cartRepository.create({
        sessionId,
        productId,
        quantity,
        price: product.price
      });
      return this.cartRepository.save(cartItem);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async getCart(sessionId: string): Promise<any[]> {
    try {
      const cartItems = await this.cartRepository.find({
        where: { sessionId },
        relations: ['product'],
      });

      return cartItems.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.product?.name || 'Unknown',
        quantity: item.quantity,
        price: parseFloat(item.price.toString()),
        total: item.quantity * parseFloat(item.price.toString()),
        image: item.product?.imageUrl || '/images/placeholder-product.jpg',
        stock: item.product?.quantity || 0,
      }));
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Failed to get cart');
    }
  }

  async updateCartItem(sessionId: string, cartItemId: number, quantity: number): Promise<Cart> {
    const item = await this.cartRepository.findOne({ where: { id: cartItemId, sessionId } });
    if (!item) throw new NotFoundException('Cart item not found');

    const product = await this.productRepository.findOne({ where: { id: item.productId } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.quantity < quantity) throw new BadRequestException('Insufficient stock');

    item.quantity = quantity;
    return this.cartRepository.save(item);
  }

  async removeFromCart(sessionId: string, cartItemId: number): Promise<void> {
    const item = await this.cartRepository.findOne({ where: { id: cartItemId, sessionId } });
    if (!item) throw new NotFoundException('Cart item not found');

    await this.cartRepository.remove(item);
  }

  async clearSessionCart(sessionId: string): Promise<void> {
    await this.cartRepository.delete({ sessionId });
  }

  async getCartItemCount(sessionId: string): Promise<number> {
    const result = await this.cartRepository
      .createQueryBuilder('cart')
      .where('cart.sessionId = :sessionId', { sessionId })
      .select('SUM(cart.quantity)', 'count')
      .getRawOne();
    return parseInt(result.count) || 0;
  }

  async checkout(sessionId: string, customerInfo: any): Promise<any> {
    const cartItems = await this.getCart(sessionId);
    if (!cartItems || cartItems.length === 0) throw new NotFoundException('Cart is empty');

    const totalAmount = cartItems.reduce((sum, i) => sum + i.total, 0);

    // TODO: Tạo order + order items ở đây nếu có entity Order

    await this.clearSessionCart(sessionId);

    return {
      success: true,
      items: cartItems,
      totalAmount,
      itemCount: cartItems.length,
      orderInfo: {
        customerName: customerInfo?.name || 'Guest',
        email: customerInfo?.email || '',
        phone: customerInfo?.phone || '',
        address: customerInfo?.address || '',
      },
    };
  }
}
