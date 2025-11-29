import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/databases/database.module';

import { AuthModule } from './modules/auth/auth.module';
import { CustomerModule } from './modules/customers/customer.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UploadModule } from './modules/upload/upload.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CartModule } from './modules/cart/cart.module';
import { CheckoutModule } from './modules/cart/checkout.module';
import { AccessoriesModule } from './modules/accessories/accessories.module';
import { PaymentModule } from './modules/payment/payment.module';

import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';
import { ProductSpecificationsModule } from './modules/product-specifications/product-specifications.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    CustomerModule,
    ProductsModule,
    OrdersModule,
    UploadModule,
    DashboardModule,
    CartModule,
    CheckoutModule,
    AccessoriesModule,
    PaymentModule,
    ProductSpecificationsModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}