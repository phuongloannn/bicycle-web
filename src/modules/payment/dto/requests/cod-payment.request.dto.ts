import { 
  IsNotEmpty, 
  IsNumber, 
  IsString, 
  IsOptional 
} from 'class-validator';

export class CODPaymentRequestDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsOptional()
  @IsNumber()
  actualReceivedAmount?: number;
}