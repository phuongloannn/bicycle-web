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
import { Accessory } from '../accessories/entities/accessory.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Accessory)
    private accessoryRepository: Repository<Accessory>,

    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,

    private dataSource: DataSource,
  ) {}

  // CREATE ORDER - SUPPORT PRODUCTS + ACCESSORIES
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
        totalAmount: '0.00',
        shippingAddress: createOrderDto.shippingAddress,
        billingAddress: createOrderDto.billingAddress,
        paymentMethod: createOrderDto.paymentMethod,
        status: OrderStatus.Pending,
        isPaid: false,
      });

      const savedOrder = await queryRunner.manager.save(order);
      let totalAmount = 0;

      for (const itemDto of createOrderDto.items) {
        // Kiểm tra và xử lý theo type
        if (itemDto.type === 'product') {
          const product = await this.productRepository.findOne({ 
            where: { id: itemDto.itemId } 
          });
          if (!product) {
            throw new NotFoundException(`Product ${itemDto.itemId} not found`);
          }
          if (product.quantity < itemDto.quantity) {
            throw new BadRequestException(`Insufficient stock for product: ${product.name}`);
          }

          // Update product stock
          product.quantity -= itemDto.quantity;
          await queryRunner.manager.save(product);

        } else if (itemDto.type === 'accessory') {
          const accessory = await this.accessoryRepository.findOne({ 
            where: { id: itemDto.itemId } 
          });
          if (!accessory) {
            throw new NotFoundException(`Accessory ${itemDto.itemId} not found`);
          }
          if (accessory.in_stock < itemDto.quantity) {
            throw new BadRequestException(`Insufficient stock for accessory: ${accessory.name}`);
          }

          // Update accessory stock
          accessory.in_stock -= itemDto.quantity;
          await queryRunner.manager.save(accessory);
        }

        // Tính totalPrice (dùng giá từ DTO nếu có, hoặc tính tự động)
        const itemTotal = itemDto.totalPrice ?? (itemDto.quantity * itemDto.unitPrice);

        // Tạo order item
        const orderItem = this.orderItemRepository.create({
          orderId: savedOrder.id,
          itemId: itemDto.itemId,
          type: itemDto.type,
          quantity: itemDto.quantity,
          unitPrice: itemDto.unitPrice.toString(),
          totalPrice: itemTotal.toFixed(2),
        });

        await queryRunner.manager.save(orderItem);
        totalAmount += itemTotal;
      }

      // Update total amount - chuyển sang string để khớp entity
      savedOrder.totalAmount = totalAmount.toFixed(2);
      await queryRunner.manager.save(savedOrder);

      await queryRunner.commitTransaction();

      // Fetch full order với relations
      const fullOrder = await this.orderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ['customer', 'items'],
      });

      if (!fullOrder) {
        throw new NotFoundException('Order not found after creation');
      }

      return this.mapToOrderResponseDto(fullOrder);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // LIST ALL ORDERS
  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      relations: ['customer', 'items'],
      order: { createdAt: 'DESC' },
    });

    return Promise.all(
      orders.map((order) => this.mapToOrderResponseDto(order)),
    );
  }

  // GET ONE ORDER
  async findOne(id: number): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'items'],
    });

    if (!order) throw new NotFoundException(`Order ${id} not found`);

    return this.mapToOrderResponseDto(order);
  }

  // FILTER ORDERS BY STATUS
  async getOrdersByStatus(status: OrderStatus): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      where: { status },
      relations: ['customer', 'items'],
      order: { createdAt: 'DESC' },
    });

    return Promise.all(
      orders.map((order) => this.mapToOrderResponseDto(order)),
    );
  }

  // UPDATE ORDER
  async update(id: number, dto: UpdateOrderDto): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order ${id} not found`);

    Object.assign(order, dto);
    await this.orderRepository.save(order);

    return this.findOne(id);
  }

  // DELETE ORDER
  async remove(id: number): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order ${id} not found`);

    await this.orderRepository.remove(order);
  }

  // GET RECENT ORDERS FOR ACTIVITIES
  async getRecentOrders(): Promise<Order[]> {
    return this.orderRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
      relations: ['customer'],
    });
  }

  // MAPPING FUNCTION - UPDATED VERSION
  private async mapToOrderResponseDto(order: Order): Promise<OrderResponseDto> {
    const dto = new OrderResponseDto();

    dto.id = order.id;
    dto.orderNumber = order.orderNumber;
    dto.customerId = order.customerId;
    dto.customerName = order.customer?.name || '';
    dto.customerEmail = order.customer?.email || '';
    dto.customerPhone = order.customer?.phone || '';
    dto.totalAmount = parseFloat(order.totalAmount);
    dto.status = order.status;
    dto.shippingAddress = order.shippingAddress;
    dto.billingAddress = order.billingAddress;
    dto.paymentMethod = order.paymentMethod;
    dto.isPaid = order.isPaid;
    dto.customerNotes = order.customerNotes;
    dto.cancellationReason = order.cancellationReason;
    dto.createdAt = order.createdAt;
    dto.updatedAt = order.updatedAt;

    dto.items = await Promise.all(
      order.items.map(async (item) => {
        const itemDto = new OrderItemResponseDto();

        itemDto.id = item.id;
        itemDto.itemId = item.itemId;
        itemDto.type = item.type;
        itemDto.quantity = item.quantity;
        itemDto.unitPrice = parseFloat(item.unitPrice);
        itemDto.totalPrice = parseFloat(item.totalPrice);

        // Lấy thông tin sản phẩm/phụ kiện dựa trên type
        if (item.type === 'product') {
          const product = await this.productRepository.findOne({
            where: { id: item.itemId },
          });
          if (product) {
            itemDto.productName = product.name;
            itemDto.productImage = product.imageUrl;
          }
        } else if (item.type === 'accessory') {
          const accessory = await this.accessoryRepository.findOne({
            where: { id: item.itemId },
          });
          if (accessory) {
            itemDto.productName = accessory.name;
            itemDto.productImage = accessory.image_url;
          }
        }

        return itemDto;
      }),
    );

    return dto;
  }
}