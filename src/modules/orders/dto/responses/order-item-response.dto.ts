import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  itemId: number; // Đổi từ productId sang itemId

  @ApiProperty({ enum: ['product', 'accessory'] })
  type: 'product' | 'accessory'; // Thêm trường type

  @ApiProperty()
  productName: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number; // Đổi từ string sang number

  @ApiProperty()
  totalPrice: number; // Đổi từ string sang number

  @ApiProperty({ required: false })
  productImage?: string;
}