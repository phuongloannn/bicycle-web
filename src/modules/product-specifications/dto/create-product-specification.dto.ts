import { IsInt, IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductSpecificationDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  productId: number;

  @IsString()
  @IsNotEmpty()
  frameSize: string;

  @IsString()
  @IsNotEmpty()
  wheelSize: string;

  @IsString()
  @IsNotEmpty()
  gearSystem: string;

  @IsString()
  @IsNotEmpty()
  brakeType: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  weight: number;

  @IsString()
  @IsNotEmpty()
  material: string;
}