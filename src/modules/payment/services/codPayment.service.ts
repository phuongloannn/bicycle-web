import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { CODPayment } from '../entities/codPayment.entity';

@Injectable()
export class CodPaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(CODPayment)
    private codPaymentRepository: Repository<CODPayment>,
  ) {}

  async processCodPayment(orderId: number, amount: number) {
    // Lưu thông tin thanh toán chung
    const payment = await this.paymentRepository.save({
      orderId,
      paymentMethod: 'cod',
      status: 'pending', // COD thường pending cho tới khi giao hàng
      amount: amount.toFixed ? amount.toFixed(2).toString() : String(amount),
    } as Partial<Payment>);

    // Lưu chi tiết COD (nếu cần thêm thông tin riêng)
    await this.codPaymentRepository.save({
      paymentId: payment.id,
      deliveryStatus: 'waiting_for_delivery',
    } as Partial<CODPayment>);

    return payment;
  }
}
