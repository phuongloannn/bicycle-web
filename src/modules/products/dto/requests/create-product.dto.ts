import { IsString, IsNumber, IsOptional, Min, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  @IsOptional()
  category?: string;

  // 🔥 THÊM TRƯỜNG ẢNH
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  imageFilename?: string;
}