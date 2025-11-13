import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Headers } from '@nestjs/common';
import { GuestCartService } from './guest-cart.service';
import { CheckoutService } from './checkout.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Guest Cart')
@Controller('guest/cart')
// ✅ KHÔNG có @UseGuards - cho phép khách vãng lai
export class GuestCartController {
  constructor(
    private readonly guestCartService: GuestCartService,
    private readonly checkoutService: CheckoutService,
  ) {}

  @Post('add')
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ hàng (khách vãng lai)' })
  async addToCart(
    @Headers('x-session-id') sessionHeader: string,
    @Req() req,
    @Body() body: { productId: number; quantity: number }
  ) {
    console.log('🔍 [POST /guest/cart/add] Headers:', req.headers);
    console.log('🔍 [POST /guest/cart/add] Body:', body);
    
    const sessionId = this.getSessionId(req, sessionHeader);
    console.log('✅ [BE] Using sessionId:', sessionId);
    
    try {
      const result = await this.guestCartService.addToCart(sessionId, body.productId, body.quantity);
      
      console.log('✅ [BE] Add to cart success:', result);
      return {
        success: true,
        message: 'Đã thêm vào giỏ hàng',
        sessionId: sessionId,
        data: result
      };
    } catch (error) {
      console.error('❌ [BE] Add to cart error:', error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lấy giỏ hàng (khách vãng lai)' })
  async getCart(@Headers('x-session-id') sessionHeader: string, @Req() req) {
    console.log('🔍 [GET /guest/cart] Headers:', req.headers);
    
    const sessionId = this.getSessionId(req, sessionHeader);
    console.log('✅ [BE] Using sessionId:', sessionId);
    
    try {
      const cartItems = await this.guestCartService.getCart(sessionId);
      const itemCount = await this.guestCartService.getCartItemCount(sessionId);

      console.log('✅ [BE] Cart items found:', cartItems.length);
      console.log('✅ [BE] Cart items:', cartItems);
      
      return {
        success: true,
        sessionId: sessionId,
        data: cartItems,
        summary: {
          totalItems: itemCount,
          totalAmount: cartItems.reduce((sum, item) => sum + item.total, 0)
        }
      };
    } catch (error) {
      console.error('❌ [BE] Get cart error:', error);
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật số lượng sản phẩm' })
  async updateCartItem(
    @Headers('x-session-id') sessionHeader: string,
    @Req() req,
    @Param('id') cartItemId: number,
    @Body('quantity') quantity: number
  ) {
    const sessionId = this.getSessionId(req, sessionHeader);
    console.log('✅ [BE] Update cart item - session:', sessionId, 'item:', cartItemId, 'qty:', quantity);
    
    const result = await this.guestCartService.updateCartItem(sessionId, cartItemId, quantity);
    
    return {
      success: true,
      message: 'Đã cập nhật giỏ hàng',
      data: result
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa sản phẩm khỏi giỏ hàng' })
  async removeFromCart(
    @Headers('x-session-id') sessionHeader: string,
    @Req() req, 
    @Param('id') cartItemId: number
  ) {
    const sessionId = this.getSessionId(req, sessionHeader);
    console.log('✅ [BE] Remove from cart - session:', sessionId, 'item:', cartItemId);
    
    await this.guestCartService.removeFromCart(sessionId, cartItemId);
    
    return {
      success: true,
      message: 'Đã xóa sản phẩm khỏi giỏ hàng'
    };
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Đặt hàng (khách vãng lai)' })
  async checkout(
    @Headers('x-session-id') sessionHeader: string,
    @Req() req, 
    @Body() customerInfo: any
  ) {
    const sessionId = this.getSessionId(req, sessionHeader);
    console.log('✅ [BE] Checkout - session:', sessionId);
    
    const result = await this.guestCartService.checkout(sessionId, customerInfo);
    
    return {
      success: true,
      message: 'Đặt hàng thành công',
      data: result
    };
  }

  @Delete()
  @ApiOperation({ summary: 'Xóa toàn bộ giỏ hàng' })
  async clearCart(
    @Headers('x-session-id') sessionHeader: string,
    @Req() req
  ) {
    const sessionId = this.getSessionId(req, sessionHeader);
    console.log('✅ [BE] Clear cart - session:', sessionId);
    
    await this.guestCartService.clearSessionCart(sessionId);
    
    return { 
      success: true,
      message: 'Đã xóa toàn bộ giỏ hàng' 
    };
  }

  @Get('count')
  @ApiOperation({ summary: 'Lấy số lượng sản phẩm trong giỏ' })
  async getCartCount(
    @Headers('x-session-id') sessionHeader: string,
    @Req() req
  ) {
    const sessionId = this.getSessionId(req, sessionHeader);
    console.log('✅ [BE] Get cart count - session:', sessionId);
    
    const count = await this.guestCartService.getCartItemCount(sessionId);
    
    return {
      success: true,
      sessionId: sessionId,
      count: count
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSessionId(@Req() req, sessionHeader?: string): string {
    // ✅ FIX QUAN TRỌNG: Ưu tiên dùng session từ header
    if (sessionHeader) {
      console.log('📥 [BE] Using session from header:', sessionHeader);
      return sessionHeader;
    }
    
    // Fallback: kiểm tra các header khác
    const headers = req.headers;
    let sessionId = headers['x-session-id'] as string;
    
    if (!sessionId) {
      // ❌ CHỈ tạo mới khi thực sự không có session nào
      sessionId = this.generateSessionId();
      console.warn('⚠️ [BE] No session ID found, generated new:', sessionId);
    } else {
      console.log('📥 [BE] Using session from req.headers:', sessionId);
    }
    
    return sessionId;
  }
}