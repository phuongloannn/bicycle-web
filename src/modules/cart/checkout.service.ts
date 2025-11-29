import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Customer } from '../customers/entities/customer.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(Cart)
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

  async guestCheckout(sessionId: string, customerInfo: any): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Lấy giỏ hàng TRỰC TIẾP từ database
      const cartItems = await this.cartRepository.find({
        where: { sessionId },
        relations: ['product']
      });

      console.log('🔍 [CheckoutService] Cart items found:', cartItems.length);

      if (!cartItems || cartItems.length === 0) {
        throw new NotFoundException('Giỏ hàng trống');
      }

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

    console.log('🔍 [CheckoutService] Customer info:', {
      name: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone
    });

    // 3. Tạo hoặc tìm customer - THÊM DEBUG
    let customer = await this.customerRepository.findOne({
      where: { email: customerInfo.email }
    });

    console.log('🔍 [CheckoutService] Existing customer found:', customer);

    if (!customer) {
      console.log('🔍 [CheckoutService] Creating new customer...');
      customer = this.customerRepository.create({
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.shippingAddress
      });
      
      console.log('🔍 [CheckoutService] Customer before save:', customer);
      customer = await this.customerRepository.save(customer); // DÙNG repository thay vì queryRunner
      console.log('🔍 [CheckoutService] Customer after save:', customer);
    }

    // KIỂM TRA customer.id
    if (!customer?.id) {
      throw new BadRequestException('Không thể tạo thông tin khách hàng');
    }

    console.log('🔍 [CheckoutService] Using customer ID:', customer.id);


      // 4. Tạo order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      const totalAmount = processedCartItems.reduce((sum, item) => sum + item.total, 0).toString();

      // 5. Tạo order
      const order = this.orderRepository.create({
        orderNumber: orderNumber,
        customerId: customer.id,
        totalAmount: totalAmount,
        shippingAddress: customerInfo.shippingAddress || '',
        billingAddress: customerInfo.billingAddress || customerInfo.shippingAddress || '',
        paymentMethod: customerInfo.paymentMethod || 'COD',
        status: OrderStatus.Pending,
        isPaid: false,
        phone: customerInfo.phone,
        email: customerInfo.email,
        customerNotes: customerInfo.notes || '',
        orderDate: new Date(),
      });

      const savedOrder = await queryRunner.manager.save(Order, order);

      // 6. Tạo order items và cập nhật tồn kho - FIXED
      for (const item of processedCartItems) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId }
        });

        if (!product) {
          throw new NotFoundException(`Sản phẩm #${item.productId} không tồn tại`);
        }

        if (product.quantity < item.quantity) {
          throw new BadRequestException(`Sản phẩm "${product.name}" không đủ tồn kho`);
        }

        product.quantity -= item.quantity;
        await queryRunner.manager.save(Product, product);

        // FIX: Sử dụng itemId và type thay vì productId
        const orderItem = this.orderItemRepository.create({
          orderId: savedOrder.id,
          itemId: item.productId, // Đổi từ productId sang itemId
          type: 'product', // Thêm trường type
          quantity: item.quantity,
          unitPrice: item.price.toString(),
          totalPrice: item.total.toFixed(2).toString(),
        });

        await queryRunner.manager.save(orderItem);
      }

      // 7. Xóa giỏ hàng TRỰC TIẾP bằng queryRunner
      await queryRunner.manager.delete(Cart, { sessionId });

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

  async userCheckout(userId: number, shippingInfo: any): Promise<any> {
    return { message: 'User checkout - to be implemented' };
  }
}