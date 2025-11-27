import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateAccessoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  compatible_with?: string;

  @IsOptional()
  @IsNumber()
  in_stock?: number;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsString()
  image_filename?: string;
}