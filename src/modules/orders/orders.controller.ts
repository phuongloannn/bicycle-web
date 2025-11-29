import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/requests/create-order.dto';
import { UpdateOrderDto } from './dto/requests/update-order.dto';
import { OrderResponseDto } from './dto/responses/order-response.dto';
import { OrderStatus } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll(): Promise<OrderResponseDto[]> {
    return this.ordersService.findAll();
  }

  @Get('status/:status')
  async findByStatus(
    @Param('status') status: OrderStatus
  ): Promise<OrderResponseDto[]> {
    return this.ordersService.getOrdersByStatus(status);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<OrderResponseDto> {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ordersService.remove(id);
  }

  // -----------------------------
  // Lấy 10 đơn hàng gần nhất
  @Get('recent-activities')
  async getRecentOrders() {
    // Truy vấn từ service
    const orders = await this.ordersService.getRecentOrders();

    // Map dữ liệu thành format frontend cần
    return orders.map(order => ({
      id: order.id,
      action: `Order #${order.orderNumber} (${order.status})`,
      user: order.customer?.name || 'Guest', // Sửa: lấy từ customer relation
      email: order.customer?.email || '', // Thêm email nếu cần
      time: order.createdAt, // Sửa: createdAt thay vì created_at
      type: 'order',
      amount: order.totalAmount, // Thêm amount nếu cần
    }));
  }
}