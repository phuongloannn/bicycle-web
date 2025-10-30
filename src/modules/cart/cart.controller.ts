import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/requests/add-to-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // ✅ SỬA PATH ĐÚNG
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(@Req() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Get()
  async getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Patch(':id')
  async updateCartItem(
    @Req() req,
    @Param('id') cartItemId: number,
    @Body('quantity') quantity: number
  ) {
    return this.cartService.updateCartItem(req.user.id, cartItemId, quantity);
  }

  @Delete(':id')
  async removeFromCart(@Req() req, @Param('id') cartItemId: number) {
    return this.cartService.removeFromCart(req.user.id, cartItemId);
  }

  @Delete()
  async clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }
}