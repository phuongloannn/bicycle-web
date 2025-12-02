import { IsInt, IsNotEmpty, IsOptional, Min, IsString } from 'class-validator';

export class CreateInventoryDto {
  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @IsOptional()
  @IsInt()
  category_id?: number;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  reserved?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  min_stock?: number;

  @IsOptional()
  @IsString()
  location?: string;
}


