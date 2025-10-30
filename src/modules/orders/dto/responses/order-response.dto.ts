import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../entities/order.entity';
import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderNumber: string;

  @ApiProperty()
  customerId: number;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  customerEmail: string;

  @ApiProperty()
  customerPhone: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty()
  shippingAddress: string;

  @ApiProperty()
  billingAddress: string;

  @ApiProperty()
  paymentMethod: string;

  @ApiProperty()
  isPaid: boolean;

  @ApiProperty({ nullable: true })
  paidAt: Date;

  @ApiProperty({ nullable: true })
  customerNotes: string;

  @ApiProperty({ nullable: true })
  cancellationReason: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  completedAt: Date;

  @ApiProperty({ nullable: true })
  cancelledAt: Date;
}