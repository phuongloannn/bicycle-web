export class CODPaymentResponseDto {
  id: number;
  orderId: number;
  status: 'pending' | 'delivered' | 'paid';
  deliveredAt?: Date;
}