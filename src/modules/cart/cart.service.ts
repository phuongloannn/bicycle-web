
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { AddToCartDto } from './dto/requests/add-to-cart.dto';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async addToCart(userId: number, addToCartDto: AddToCartDto): Promise<Cart> {
    // Kiểm tra sản phẩm tồn tại
    const product = await this.productRepository.findOne({
      where: { id: addToCartDto.productId }
    });
    
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Kiểm tra tồn kho
    if (product.quantity < addToCartDto.quantity) {
      throw new NotFoundException('Insufficient stock');
    }

    // Kiểm tra đã có trong giỏ hàng chưa
    const existingCartItem = await this.cartRepository.findOne({
      where: {
        userId,
        productId: addToCartDto.productId
      }
    });

    if (existingCartItem) {
      // Cập nhật số lượng
      existingCartItem.quantity += addToCartDto.quantity;
      return await this.cartRepository.save(existingCartItem);
    } else {
      // Thêm mới - SỬA LỖI: thiếu await
      const cartItem = this.cartRepository.create({
        userId,
        productId: addToCartDto.productId,
        quantity: addToCartDto.quantity,
        price: product.price // ✅ SỬA: Dùng price từ product, không từ DTO
      });
      return await this.cartRepository.save(cartItem); // ✅ THÊM AWAIT
    }
  }

  async getCart(userId: number): Promise<any[]> {
    const cartItems = await this.cartRepository.find({
      where: { userId },
      relations: ['product']
    });

    return cartItems.map(item => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
      image: item.product.imageUrl, // ✅ ĐÚNG: product có imageUrl
      stock: item.product.quantity, // ✅ THÊM: để hiển thị tồn kho
    }));
  }

  async updateCartItem(userId: number, cartItemId: number, quantity: number): Promise<Cart> {
    const cartItem = await this.cartRepository.findOne({
      where: { id: cartItemId, userId }
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Kiểm tra tồn kho trước khi update
    const product = await this.productRepository.findOne({
      where: { id: cartItem.productId }
    });

    if (product && product.quantity < quantity) {
      throw new NotFoundException('Insufficient stock');
    }

    cartItem.quantity = quantity;
    return await this.cartRepository.save(cartItem);
  }

  async removeFromCart(userId: number, cartItemId: number): Promise<void> {
    const cartItem = await this.cartRepository.findOne({
      where: { id: cartItemId, userId }
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartRepository.remove(cartItem);
  }

  async clearCart(userId: number): Promise<void> {
    await this.cartRepository.delete({ userId });
  }

  // ✅ THÊM METHOD CHECKOUT
  async checkout(userId: number): Promise<any> {
    const cartItems = await this.getCart(userId);
    
    if (cartItems.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    // Tính tổng tiền
    const totalAmount = cartItems.reduce((sum, item) => sum + item.total, 0);

    return {
      items: cartItems,
      totalAmount,
      itemCount: cartItems.length
    };
  }
}
