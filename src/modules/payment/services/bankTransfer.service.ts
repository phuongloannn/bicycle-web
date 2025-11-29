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
    console.log('🔍 [BankTransferService] Creating payment for order:', orderId);
    console.log('🔍 Payment data:', paymentData);

    try {
      // ✅ 1. Tạo payment record trong bảng payments
      const paymentEntity = this.paymentRepository.create({
        orderId: orderId,
        paymentMethod: 'bank_transfer',
        status: 'pending',
        amount: paymentData.transferAmount.toString(),
      });

      const payment = await this.paymentRepository.save(paymentEntity);
      console.log('✅ Payment record created with ID:', payment.id);

      // ✅ 2. Tạo bank transfer record - SỬA CHO KHỚP DATABASE THỰC TẾ
      const bankTransferData = {
        paymentId: payment.id,
        bankName: paymentData.bankName,
        accountNumber: paymentData.accountNumber,
        accountName: paymentData.bankName, // ✅ Dùng bankName làm accountName
        transferAmount: paymentData.transferAmount.toString(), // ✅ Thêm transferAmount
        transferDate: new Date(), // ✅ Thêm transferDate
      };

      const bankTransferEntity = this.bankTransferRepository.create(bankTransferData);
      const bankTransfer = await this.bankTransferRepository.save(bankTransferEntity);
      
      console.log('✅ Bank transfer record created with ID:', bankTransfer.id);

      // ✅ 3. Trả về kết quả đầy đủ
      return {
        id: payment.id,
        orderId: payment.orderId,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        amount: payment.amount,
        bankTransfer: {
          id: bankTransfer.id,
          bankName: bankTransfer.bankName,
          accountNumber: bankTransfer.accountNumber,
          accountName: bankTransfer.accountName,
          transferAmount: bankTransfer.transferAmount,
          transferDate: bankTransfer.transferDate,
        },
        createdAt: payment.createdAt,
        message: 'Thanh toán chuyển khoản đã được xử lý thành công'
      };

    } catch (error) {
      console.error('❌ [BankTransferService] ERROR:', error);
      throw new Error(`Không thể tạo thanh toán chuyển khoản: ${error.message}`);
    }
  }

  async verifyBankTransfer(paymentId: number) {
    console.log('🔍 [BankTransferService] Verifying payment:', paymentId);
    
    try {
      const result = await this.paymentRepository.update(
        { id: paymentId }, 
        { status: 'paid' }
      );
      
      console.log('✅ Payment verification result:', result);
      return {
        success: true,
        message: 'Thanh toán đã được xác nhận',
        affected: result.affected
      };
    } catch (error) {
      console.error('❌ [BankTransferService] Verification ERROR:', error);
      throw new Error(`Không thể xác nhận thanh toán: ${error.message}`);
    }
  }

  // ✅ Hàm sinh QR code chuẩn VietQR
  async generateQRCode(orderId: number, amount: number): Promise<string> {
    console.log('🔍 [BankTransferService] Generating QR for order:', orderId, 'amount:', amount);
    
    try {
      const bankCode = 'BIDV';
      const accountNumber = '2601609867';
      const addInfo = `ORDER-${orderId}`;
      
      // Tạo URL QR code từ VietQR
      const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-qr_only.png?amount=${amount}&addInfo=${encodeURIComponent(addInfo)}&accountName=CONG TY TNHH TECHSTORE`;
      
      console.log('✅ QR Code URL generated:', qrUrl);
      return qrUrl;
    } catch (error) {
      console.error('❌ [BankTransferService] QR Generation ERROR:', error);
      throw new Error(`Không thể tạo QR code: ${error.message}`);
    }
  }

  // ✅ Hàm lấy thông tin bank transfer bằng orderId
  async getBankTransferByOrderId(orderId: number) {
    console.log('🔍 [BankTransferService] Getting bank transfer for order:', orderId);
    
    try {
      const payment = await this.paymentRepository.findOne({
        where: { orderId: orderId, paymentMethod: 'bank_transfer' }
      });

      if (!payment) {
        console.log('❌ No payment found for order:', orderId);
        return null;
      }

      const bankTransfer = await this.bankTransferRepository.findOne({
        where: { paymentId: payment.id }
      });

      console.log('✅ Bank transfer found:', { payment, bankTransfer });
      
      return {
        payment,
        bankTransfer
      };
    } catch (error) {
      console.error('❌ [BankTransferService] Get Payment ERROR:', error);
      throw new Error(`Không thể lấy thông tin thanh toán: ${error.message}`);
    }
  }

  // ✅ Hàm mới: Cập nhật thông tin chuyển khoản (khi có proof)
  async updateBankTransferWithProof(paymentId: number, proofUrl: string) {
    console.log('🔍 [BankTransferService] Updating bank transfer with proof:', paymentId);
    
    try {
      const result = await this.bankTransferRepository.update(
        { paymentId: paymentId },
        { 
          transferProofUrl: proofUrl,
          transferDate: new Date()
        }
      );
      
      console.log('✅ Bank transfer updated with proof:', result);
      return {
        success: true,
        message: 'Đã cập nhật thông tin chuyển khoản',
        affected: result.affected
      };
    } catch (error) {
      console.error('❌ [BankTransferService] Update Proof ERROR:', error);
      throw new Error(`Không thể cập nhật thông tin chuyển khoản: ${error.message}`);
    }
  }
}