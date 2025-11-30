import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { Customer } from '../customers/entities/customer.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Cart } from './entities/cart.entity';
import { GuestCartService } from './guest-cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Order,
      OrderItem,
      Product,
      Cart
    ]),
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService, GuestCartService],
})
export class CheckoutModule {}
