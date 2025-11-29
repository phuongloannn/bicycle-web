import { Controller, Post, Body, Param } from '@nestjs/common';
import { CreditCardPaymentService } from '../services/creditCard.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';

class CreditCardPaymentRequestDto {
  amount: number;
}

@ApiTags('Payment')
@Controller('payment/credit-card')
export class CreditCardController {
  constructor(private readonly creditCardService: CreditCardPaymentService) {}

  @Post(':orderId')
  @ApiOperation({ summary: 'Xử lý thanh toán bằng thẻ tín dụng' })
  @ApiParam({ name: 'orderId', type: Number, description: 'ID của đơn hàng cần thanh toán' })
  @ApiBody({ type: CreditCardPaymentRequestDto })
  @ApiResponse({ status: 201, description: 'Thanh toán thẻ tín dụng đã được tạo thành công' })
  async createCreditCardPayment(
    @Param('orderId') orderId: number,
    @Body() paymentData: CreditCardPaymentRequestDto,
  ) {
    const result = await this.creditCardService.processCreditCardPayment({
      orderId,
      amount: paymentData.amount,
    });
    return {
      message: 'Thanh toán thẻ tín dụng đã được xử lý',
      payment: result,
    };
  }
}