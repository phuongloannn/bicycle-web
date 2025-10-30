import { 
  IsInt, 
  IsArray, 
  IsString, 
  IsNumber, 
  IsOptional, 
  ValidateNested, 
  Min, 
  IsNotEmpty 
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transform } from 'class-transformer';

export class CreateOrderItemDto {
  @IsInt()
  @Min(1, { message: 'Product ID must be greater than 0' })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value)) // ✅ CHUYỂN ĐỔI SANG NUMBER
  productId: number;

  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1' })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value)) // ✅ CHUYỂN ĐỔI SANG NUMBER
  quantity: number;

  @IsNumber()
  @Min(0, { message: 'Unit price must be non-negative' })
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value)) // ✅ CHUYỂN ĐỔI SANG NUMBER
  unitPrice: number;
}

export class CreateOrderDto {
  @IsInt()
  @Min(1, { message: 'Customer ID must be greater than 0' })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value)) // ✅ CHUYỂN ĐỔI SANG NUMBER
  customerId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @IsNotEmpty()
  items: CreateOrderItemDto[];

  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @IsString()
  @IsOptional()
  billingAddress?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;
}