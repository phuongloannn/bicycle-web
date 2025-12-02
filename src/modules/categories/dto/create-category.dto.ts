import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  // Cho phép bật/tắt trạng thái danh mục từ FE
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
