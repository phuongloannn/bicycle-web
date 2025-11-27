export class CreditCardPaymentResponseDto {
  id: number;
  orderId: number;
  status: 'processing' | 'authorized' | 'paid' | 'failed';
  transactionId?: string;
}