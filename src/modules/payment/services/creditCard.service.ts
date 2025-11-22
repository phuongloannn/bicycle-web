import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreditCardPaymentRequestDto } from "../dto/requests/credit-card-payment.request.dto";
import { CreditCardPayment } from "../entities/creditCardPayment.entity";
import { Payment } from "../entities/payment.entity";

@Injectable()
export class CreditCardPaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async processCreditCardPayment(paymentData: { orderId: number; amount: number }) {
    const payment = await this.paymentRepository.save({
      orderId: paymentData.orderId,
      paymentMethod: 'credit_card',
      status: 'pending',
      amount: paymentData.amount.toFixed
        ? paymentData.amount.toFixed(2).toString()
        : String(paymentData.amount),
    } as Partial<Payment>);

    return payment;
  }
}
