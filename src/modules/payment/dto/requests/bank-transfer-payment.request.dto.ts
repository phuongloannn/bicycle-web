// bank-transfer-payment.request.dto.ts

import { 
  IsNotEmpty, 
  IsNumber, 
  IsString, 
  IsOptional 
} from 'class-validator';

export class BankTransferPaymentRequestDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsString()
  bankName: string;

  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @IsNotEmpty()
  @IsNumber()
  transferAmount: number;

  @IsOptional()
  @IsString()
  transferProofUrl?: string;
}

