import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { CartResponseDto } from './dto/cart-response.dto';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('Giỏ hàng (Cart)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm trong giỏ hàng' })
  @ApiOkResponse({ type: CartResponseDto })
  getCart(@Request() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa sản phẩm khỏi giỏ hàng theo cart item ID' })
  @ApiNoContentResponse({ description: 'Xóa thành công' })
  @ApiNotFoundResponse({ description: 'Cart item không tồn tại' })
  removeFromCart(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.cartService.removeFromCart(req.user.id, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Thêm sản phẩm vào giỏ hàng — nếu đã có thì tăng số lượng',
  })
  @ApiCreatedResponse({ description: 'Thêm vào giỏ hàng thành công' })
  @ApiNotFoundResponse({ description: 'Variant sản phẩm không tồn tại' })
  addToCart(@Request() req: any, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, dto);
  }
}
