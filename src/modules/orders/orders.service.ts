import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CreateOrderDto } from './dto/requests/create-order.dto';
import { UpdateOrderDto } from './dto/requests/update-order.dto';
import { OrderResponseDto } from './dto/responses/order-response.dto';
import { OrderItemResponseDto } from './dto/responses/order-item-response.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,

    private dataSource: DataSource,
  ) {}

  // ✅ CREATE ORDER
  async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const customer = await this.customerRepository.findOne({
        where: { id: createOrderDto.customerId },
      });
      if (!customer) throw new NotFoundException('Customer not found');

      const orderNumber = `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const order = this.orderRepository.create({
        orderNumber,
        customerId: createOrderDto.customerId,
        totalAmount: 0,
        shippingAddress: createOrderDto.shippingAddress,
        billingAddress: createOrderDto.billingAddress,
        paymentMethod: createOrderDto.paymentMethod,
        status: OrderStatus.PENDING,
        isPaid: false,
      });

      const savedOrder = await queryRunner.manager.save(order);

      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      for (const itemDto of createOrderDto.items) {
        const product = await this.productRepository.findOne({
          where: { id: itemDto.productId },
        });
        if (!product)
          throw new NotFoundException(
            `Product with ID ${itemDto.productId} not found`,
          );

        if (product.quantity < itemDto.quantity)
          throw new BadRequestException(
            `Insufficient stock for product: ${product.name}`,
          );

        product.quantity -= itemDto.quantity;
        await queryRunner.manager.save(product);

        const orderItem = this.orderItemRepository.create({
          orderId: savedOrder.id,
          productId: itemDto.productId,
          quantity: itemDto.quantity,
          unitPrice: itemDto.unitPrice,
          totalPrice: itemDto.quantity * itemDto.unitPrice,
        });

        const savedItem = await queryRunner.manager.save(orderItem);
        orderItems.push(savedItem);
        totalAmount += savedItem.totalPrice;
      }

      savedOrder.totalAmount = totalAmount;
      await queryRunner.manager.save(savedOrder);
      await queryRunner.commitTransaction();

      const completeOrder = await this.orderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ['customer', 'items', 'items.product'],
      });

      if (!completeOrder) {
        throw new NotFoundException('Order not found after creation');
      }

      return this.mapToOrderResponseDto(completeOrder);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ✅ FIND ALL ORDERS
  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      relations: ['customer', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });

    return orders.map((order) => this.mapToOrderResponseDto(order));
  }

  // ✅ FIND ONE ORDER
  async findOne(id: number): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'items', 'items.product'],
    });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    return this.mapToOrderResponseDto(order);
  }

  // ✅ UPDATE ORDER
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'items', 'items.product'],
    });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    Object.assign(order, updateOrderDto);
    const updatedOrder = await this.orderRepository.save(order);

    return this.mapToOrderResponseDto(updatedOrder);
  }

  // ✅ DELETE ORDER
  async remove(id: number): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    await this.orderRepository.remove(order);
  }

  // ✅ FIND BY STATUS
  async getOrdersByStatus(status: OrderStatus): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      where: { status },
      relations: ['customer', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });

    return orders.map((order) => this.mapToOrderResponseDto(order));
  }

  // ✅ FIND BY CUSTOMER
  async getOrdersByCustomer(customerId: number): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      where: { customerId },
      relations: ['customer', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });

    return orders.map((order) => this.mapToOrderResponseDto(order));
  }

  // ✅ UPDATE STATUS
  async updateStatus(id: number, status: OrderStatus): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'items', 'items.product'],
    });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    order.status = status;

    // cập nhật completedAt hoặc cancelledAt tương ứng
    if (status === OrderStatus.COMPLETED) order.completedAt = new Date();
    if (status === OrderStatus.CANCELLED) order.cancelledAt = new Date();

    const updatedOrder = await this.orderRepository.save(order);
    return this.mapToOrderResponseDto(updatedOrder);
  }

  // ✅ MARK AS PAID
  async markAsPaid(id: number): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'items', 'items.product'],
    });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    order.isPaid = true;
    order.paidAt = new Date();

    const updatedOrder = await this.orderRepository.save(order);
    return this.mapToOrderResponseDto(updatedOrder);
  }

  // ✅ CHUẨN HÓA MAPPING - SỬA LỖI DATE
  private mapToOrderResponseDto(order: any): OrderResponseDto {
    const orderResponse = new OrderResponseDto();
    
    orderResponse.id = order.id;
    orderResponse.orderNumber = order.orderNumber;
    orderResponse.customerId = order.customerId;
    orderResponse.customerName = order.customer?.name || 'Unknown Customer';
    orderResponse.customerEmail = order.customer?.email || '';
    orderResponse.customerPhone = order.customer?.phone || '';
    orderResponse.totalAmount = order.totalAmount;
    orderResponse.status = order.status;
    orderResponse.shippingAddress = order.shippingAddress;
    orderResponse.billingAddress = order.billingAddress;
    orderResponse.paymentMethod = order.paymentMethod;
    orderResponse.isPaid = order.isPaid;
    
    // Sửa lỗi Date - chỉ gán nếu có giá trị
    if (order.paidAt) orderResponse.paidAt = order.paidAt;
    if (order.completedAt) orderResponse.completedAt = order.completedAt;
    if (order.cancelledAt) orderResponse.cancelledAt = order.cancelledAt;
    
    orderResponse.customerNotes = order.customerNotes || '';
    orderResponse.cancellationReason = order.cancellationReason || '';

    // Map order items
    orderResponse.items = order.items?.map((item) => {
      const itemDto = new OrderItemResponseDto();
      itemDto.id = item.id;
      itemDto.productId = item.productId;
      itemDto.productName = item.product?.name || 'Unknown Product';
      // Sửa lỗi image field - kiểm tra cả imageUrl và image
      itemDto.productImage = (item.product as any)?.image || (item.product as any)?.imageUrl || undefined;
      itemDto.quantity = item.quantity;
      itemDto.unitPrice = item.unitPrice;
      itemDto.totalPrice = item.totalPrice;
      return itemDto;
    }) || [];

    orderResponse.createdAt = order.createdAt;
    orderResponse.updatedAt = order.updatedAt;

    return orderResponse;
  }
}