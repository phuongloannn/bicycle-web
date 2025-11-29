// bank-transfer-payment.response.dto.ts
export class BankTransferPaymentResponseDto {
  id: number;
  orderId: number;
  status: 'pending' | 'verified' | 'failed';
  verifiedAt?: Date;
}