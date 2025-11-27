import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { BankTransferService } from '../services/bankTransfer.service';
import { BankTransferPaymentRequestDto } from '../dto/requests/bankTransferPaymentRequest.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payment/bank-transfer')
export class BankTransferController {
  constructor(private readonly bankTransferService: BankTransferService) {}

  @Post(':orderId')
  @ApiOperation({ summary: 'Xử lý thanh toán chuyển khoản ngân hàng' })
  @ApiParam({ name: 'orderId', type: Number, description: 'ID của đơn hàng cần thanh toán' })
  @ApiBody({ type: BankTransferPaymentRequestDto })
  @ApiResponse({ status: 201, description: 'Thanh toán chuyển khoản đã được tạo thành công' })
  async createBankTransferPayment(
    @Param('orderId') orderId: number,
    @Body() paymentData: BankTransferPaymentRequestDto,
  ) {
    const result = await this.bankTransferService.createBankTransferPayment(orderId, paymentData);
    return {
      message: 'Thanh toán chuyển khoản đã được xử lý',
      payment: result,
    };
  }

@Get('qr/:orderId')
async generateQRCode(
  @Param('orderId') orderId: number,
  @Query('amount') amount: number,
) {
  const qrCodeUrl = await this.bankTransferService.generateQRCode(orderId, amount);
  return { qrCode: qrCodeUrl };
}
}