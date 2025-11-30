import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
// ❌ XÓA: import { GuestCartService } from './guest-cart.service';
import { Customer } from '../customers/entities/customer.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Cart } from './entities/cart.entity'; // ✅ THÊM

@Injectable()
export class CheckoutService {
  constructor(
    // ❌ XÓA: private guestCartService: GuestCartService,
    @InjectRepository(Cart) // ✅ THÊM: Inject Cart repository
    private cartRepository: Repository<Cart>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  // ✅ Checkout cho khách vãng lai
  async guestCheckout(sessionId: string, customerInfo: any): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Lấy giỏ hàng TRỰC TIẾP từ database (thay vì qua GuestCartService)
      const cartItems = await this.cartRepository.find({
        where: { sessionId },
        relations: ['product']
      });

      console.log('🔍 [CheckoutService] Cart items found:', cartItems.length);
      
      if (!cartItems || cartItems.length === 0) {
        throw new NotFoundException('Giỏ hàng trống');
      }

      // Xử lý cart items thành format cần thiết
      const processedCartItems = cartItems.map(item => {
        if (!item.product) {
          throw new NotFoundException(`Product not found for cart item ${item.id}`);
        }
        return {
          id: item.id,
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          price: parseFloat(item.price.toString()),
          total: item.quantity * parseFloat(item.price.toString()),
        };
      });

      // 2. Validate thông tin khách hàng
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        throw new BadRequestException('Vui lòng điền đầy đủ thông tin khách hàng');
      }

      // 3. Tạo hoặc tìm customer
      let customer = await this.customerRepository.findOne({
        where: { email: customerInfo.email }
      });

      if (!customer) {
        customer = this.customerRepository.create({
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.shippingAddress
        });
        customer = await queryRunner.manager.save(customer);
      }

      // 4. Tạo order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const totalAmount = processedCartItems.reduce((sum, item) => sum + item.total, 0);

      // 5. Tạo order
      const order = this.orderRepository.create({
        orderNumber,
        customerId: customer.id,
        totalAmount,
        shippingAddress: customerInfo.shippingAddress,
        billingAddress: customerInfo.billingAddress || customerInfo.shippingAddress,
        paymentMethod: customerInfo.paymentMethod || 'COD',
        status: OrderStatus.PENDING,
        isPaid: false,
        phone: customerInfo.phone,
        email: customerInfo.email,
        customerNotes: customerInfo.notes || '',
        orderDate: new Date(),
      });

      const savedOrder = await queryRunner.manager.save(order);

      // 6. Tạo order items và cập nhật tồn kho
      for (const item of processedCartItems) {
        const product = await this.productRepository.findOne({
          where: { id: item.productId }
        });

        if (!product) {
          throw new NotFoundException(`Sản phẩm #${item.productId} không tồn tại`);
        }

        if (product.quantity < item.quantity) {
          throw new BadRequestException(`Sản phẩm "${product.name}" không đủ tồn kho`);
        }

        // Trừ tồn kho
        product.quantity -= item.quantity;
        await queryRunner.manager.save(product);

        // Tạo order item
        const orderItem = this.orderItemRepository.create({
          orderId: savedOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.total,
        });

        await queryRunner.manager.save(orderItem);
      }

      // 7. Xóa giỏ hàng TRỰC TIẾP (thay vì qua GuestCartService)
      await this.cartRepository.delete({ sessionId });

      // 8. Commit transaction
      await queryRunner.commitTransaction();

      return {
        orderId: savedOrder.id,
        orderNumber: savedOrder.orderNumber,
        customerName: customer.name,
        customerEmail: customer.email,
        totalAmount: savedOrder.totalAmount,
        status: savedOrder.status,
        items: processedCartItems,
        shippingAddress: savedOrder.shippingAddress,
        paymentMethod: savedOrder.paymentMethod,
        orderDate: savedOrder.orderDate
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ✅ Checkout cho user đã đăng nhập (nếu cần)
  async userCheckout(userId: number, shippingInfo: any): Promise<any> {
    // Logic cho user đã đăng nhập
    return { message: 'User checkout - to be implemented' };
  }
}