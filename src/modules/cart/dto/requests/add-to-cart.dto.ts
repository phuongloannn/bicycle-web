import { IsInt, IsPositive, IsNumber } from 'class-validator';

export class AddToCartDto {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}