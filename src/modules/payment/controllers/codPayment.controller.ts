import { Controller, Post, Body, Param } from '@nestjs/common';
import { CodPaymentService } from '../services/codPayment.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';

class CodPaymentRequestDto {
  amount: number;
}

@ApiTags('Payment')
@Controller('payment/cod')
export class CodPaymentController {
  constructor(private readonly codPaymentService: CodPaymentService) {}

  @Post(':orderId')
  @ApiOperation({ summary: 'Xử lý thanh toán COD (Cash on Delivery)' })
  @ApiParam({ name: 'orderId', type: Number, description: 'ID của đơn hàng cần thanh toán' })
  @ApiBody({ type: CodPaymentRequestDto })
  @ApiResponse({ status: 201, description: 'Thanh toán COD đã được tạo thành công' })
  async createCodPayment(
    @Param('orderId') orderId: number,
    @Body() paymentData: CodPaymentRequestDto,
  ) {
    const result = await this.codPaymentService.processCodPayment(orderId, paymentData.amount);
    return {
      message: 'Thanh toán COD đã được xử lý',
      payment: result,
    };
  }
}
