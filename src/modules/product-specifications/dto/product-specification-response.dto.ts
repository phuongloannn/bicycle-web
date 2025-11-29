import { ApiProperty } from '@nestjs/swagger';

export class ProductSpecificationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  frameSize: string;

  @ApiProperty()
  wheelSize: string;

  @ApiProperty()
  gearSystem: string;

  @ApiProperty()
  brakeType: string;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  material: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}