
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { GuestCartService } from './guest-cart.service';
import { CheckoutService } from './checkout.service';
import { CartController } from './cart.controller';
import { GuestCartController } from './guest-cart.controller';
import { Cart } from './entities/cart.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart, 
      Product, 
      Customer, 
      Order, 
      OrderItem
    ])
  ],
  controllers: [CartController, GuestCartController], // ✅ THÊM GuestCartController
  providers: [CartService, GuestCartService, CheckoutService], // ✅ THÊM SERVICES
  exports: [CartService, GuestCartService],
})
export class CartModule {}
