import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Payment } from '../payment/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Order,
      OrderItem,
      Customer,
      Payment,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}