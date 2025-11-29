import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { BankTransferPayment } from '../entities/bankTransferPayment.entity';
import { BankTransferPaymentRequestDto } from '../dto/requests/bankTransferPaymentRequest.dto';

@Injectable()
export class BankTransferService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(BankTransferPayment)
    private bankTransferRepository: Repository<BankTransferPayment>
  ) {}

  async createBankTransferPayment(
    orderId: number, 
    paymentData: BankTransferPaymentRequestDto
  ) {
    const paymentEntity = this.paymentRepository.create({
      orderId,
      paymentMethod: 'bank_transfer',
      status: 'pending',
      amount: paymentData.transferAmount && typeof paymentData.transferAmount === 'number'
        ? paymentData.transferAmount.toFixed(2).toString()
        : String(paymentData.transferAmount ?? '0.00'),
    } as Partial<Payment>);

    const payment = await this.paymentRepository.save(paymentEntity);

    await this.bankTransferRepository.save({
      paymentId: payment.id,
      bankName: paymentData.bankName,
      accountNumber: paymentData.accountNumber,
      transferProofUrl: paymentData.transferProofUrl,
    } as Partial<BankTransferPayment>);

    return payment;
  }

  async verifyBankTransfer(paymentId: number) {
    return this.paymentRepository.update(
      { id: paymentId }, 
      { status: 'paid' }
    );
  }

  // ✅ Hàm mới: sinh QR code chuẩn VietQR
  async generateQRCode(orderId: number, amount: number): Promise<string> {
    const bankCode = 'BIDV'; // Mã ngân hàng BIDV
    const accountNumber = '2601609867'; // Số tài khoản thật của bạn
    const addInfo = `ORDER-${orderId}`;

    // Trả về URL ảnh QR từ VietQR
    return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-qr_only.png?amount=${amount}&addInfo=${addInfo}`;
  }
}
