import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../entities/order.entity';

export class OrderStatsDto {
  @ApiProperty()
  totalOrders: number;

  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  averageOrderValue: number;

  @ApiProperty()
  statusDistribution: Record<OrderStatus, number>;

  @ApiProperty()
  timeframe: string;
}