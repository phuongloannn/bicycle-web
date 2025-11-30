
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/requests/add-to-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController { // ✅ BỎ @UseGuards ở controller level
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard) // ✅ CHỈ bảo vệ APIs cần auth
  @ApiBearerAuth('access-token')
  async addToCart(@Req() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard) // ✅ CHỈ bảo vệ APIs cần auth
  @ApiBearerAuth('access-token')
  async getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) // ✅ CHỈ bảo vệ APIs cần auth
  @ApiBearerAuth('access-token')
  async updateCartItem(
    @Req() req,
    @Param('id') cartItemId: number,
    @Body('quantity') quantity: number
  ) {
    return this.cartService.updateCartItem(req.user.id, cartItemId, quantity);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // ✅ CHỈ bảo vệ APIs cần auth
  @ApiBearerAuth('access-token')
  async removeFromCart(@Req() req, @Param('id') cartItemId: number) {
    return this.cartService.removeFromCart(req.user.id, cartItemId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard) // ✅ CHỈ bảo vệ APIs cần auth
  @ApiBearerAuth('access-token')
  async clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard) // ✅ CHỈ bảo vệ APIs cần auth
  @ApiBearerAuth('access-token')
  async checkout(@Req() req) {
    return this.cartService.checkout(req.user.id);
  }
}
