import { 
  IsInt, 
  IsArray, 
  IsString, 
  IsNumber, 
  IsOptional, 
  ValidateNested, 
  Min, 
  IsNotEmpty, 
  IsIn 
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateOrderItemDto {
  @IsInt()
  @Min(1, { message: 'Item ID must be greater than 0' })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  itemId: number; // ✅ đổi từ productId sang itemId để hỗ trợ cả product và accessory

  @IsIn(['product', 'accessory'], { message: 'Type must be product or accessory' })
  @IsNotEmpty()
  type: 'product' | 'accessory'; // ✅ xác định loại: product hoặc accessory

  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1' })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  quantity: number;

  @IsNumber()
  @Min(0, { message: 'Unit price must be non-negative' })
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  unitPrice: number;

  @IsNumber()
  @Min(0, { message: 'Total price must be non-negative' })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  totalPrice?: number; // ✅ optional, có thể tính tự động
}

export class CreateOrderDto {
  @IsInt()
  @Min(1, { message: 'Customer ID must be greater than 0' })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  customerId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @IsNotEmpty()
  items: CreateOrderItemDto[];

  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsString()
  @IsOptional()
  billingAddress?: string;

  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
