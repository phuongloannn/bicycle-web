import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './modules/customers/customer.module';
import { DatabaseModule } from './common/databases/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';
import { ProductsModule } from './modules/products/products.module';
import { UploadModule } from './modules/upload/upload.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    CustomerModule,
    ProductsModule,
    UploadModule,
    AuthModule, 
    DashboardModule,
    OrdersModule, // ✅ THÊM VÀO ĐÂY
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); 
  }
}