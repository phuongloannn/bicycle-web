import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { BankTransferService } from '../services/bankTransfer.service';
import { BankTransferPaymentRequestDto } from '../dto/requests/bankTransferPaymentRequest.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payment/bank-transfer')
export class BankTransferController {
  constructor(private readonly bankTransferService: BankTransferService) {}

  // POST: Tạo thanh toán chuyển khoản
  @Post(':orderId')
  @ApiOperation({ summary: 'Xử lý thanh toán chuyển khoản ngân hàng' })
  @ApiParam({ name: 'orderId', type: Number, description: 'ID của đơn hàng cần thanh toán' })
  @ApiBody({ type: BankTransferPaymentRequestDto })
  @ApiResponse({ status: 201, description: 'Thanh toán chuyển khoản đã được tạo thành công' })
  async createBankTransferPayment(
    @Param('orderId') orderId: number,
    @Body() paymentData: BankTransferPaymentRequestDto,
  ) {
    try {
      const result = await this.bankTransferService.createBankTransferPayment(orderId, paymentData);

      return {
        success: true,
        message: 'Thanh toán chuyển khoản đã được xử lý',
        payment: result,
      };
    } catch (error) {
      console.error('❌ [BankTransferController] Create bank transfer payment error:', error);
      return {
        success: false,
        message: 'Không thể tạo thanh toán chuyển khoản: ' + error.message,
      };
    }
  }

  // GET: Tạo QR code thanh toán
  @Get('qr/:orderId')
  @ApiOperation({ summary: 'Tạo mã QR thanh toán chuyển khoản' })
  @ApiParam({ name: 'orderId', type: Number, description: 'ID của đơn hàng' })
  async generateQRCode(
    @Param('orderId') orderId: number,
    @Query('amount') amount: number,
  ) {
    try {
      console.log('🔍 [BankTransferController] Generating QR for order:', orderId, 'amount:', amount);

      const qrCodeUrl = await this.bankTransferService.generateQRCode(orderId, amount);

      console.log('✅ [BankTransferController] QR code generated successfully');

      return {
        success: true,
        orderId: orderId,
        qrCode: qrCodeUrl,
        message: 'Mã QR đã được tạo thành công',
      };
    } catch (error) {
      console.error('❌ [BankTransferController] QR generation error:', error);
      return {
        success: false,
        message: 'Không thể tạo mã QR: ' + error.message,
      };
    }
  }
}
