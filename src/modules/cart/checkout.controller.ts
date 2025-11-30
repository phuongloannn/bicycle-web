import { Controller, Post, Body } from '@nestjs/common';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('guest')
  async guestCheckout(@Body() body: any) {
    const { sessionId, customerInfo } = body;
    console.log("[POST] /checkout/guest");
    console.log("Request body:", body);

    return this.checkoutService.guestCheckout(sessionId, customerInfo);
  }
}
