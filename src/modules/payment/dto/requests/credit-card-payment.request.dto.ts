   import { 
  IsNotEmpty, 
  IsNumber, 
  IsString, 
  IsOptional 
} from 'class-validator';
   
   export class CreditCardPaymentRequestDto {
  [x: string]: any;
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsString()
  cardNumber: string;

  @IsNotEmpty()
  @IsString()
  cardHolderName: string;

  @IsNotEmpty()
  expiryDate: string;

  @IsNotEmpty()
  @IsNumber()
  cvv: number;
}