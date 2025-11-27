import { IsOptional, IsEnum, IsString, IsBoolean, IsDateString } from 'class-validator';
import { OrderStatus } from '../../entities/order.entity';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  billingAddress?: string;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @IsDateString()
  paidAt?: string;
}
