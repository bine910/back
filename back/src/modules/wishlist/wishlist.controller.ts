import {
  Controller,
  Post,
  Get,
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
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ProductCardDto } from '../product/dto/product-card.dto';
import { WishlistService } from './wishlist.service';
import { WishlistDto } from './dto/add-to-wishlist.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('Danh sách yêu thích (Wishlist)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Thêm sản phẩm vào wishlist của người dùng' })
  @ApiCreatedResponse({ description: 'Thêm vào wishlist thành công' })
  @ApiConflictResponse({ description: 'Sản phẩm đã có trong wishlist' })
  @ApiNotFoundResponse({ description: 'Sản phẩm không tồn tại' })
  addToWishlist(@Request() req: any, @Body() dto: WishlistDto) {
    return this.wishlistService.addToWishlist(req.user.id, dto);
  }

  @Post('remove')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa sản phẩm khỏi wishlist của người dùng' })
  @ApiOkResponse({ description: 'Xóa khỏi wishlist thành công' })
  @ApiNotFoundResponse({ description: 'Sản phẩm không tồn tại trong wishlist' })
  removeFromWishlist(@Request() req: any, @Body() dto: WishlistDto) {
    return this.wishlistService.removeFromWishlist(req.user.id, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách wishlist của người dùng' })
  @ApiOkResponse({ type: [ProductCardDto] })
  getWishlist(@Request() req: any) {
    return this.wishlistService.getWishlist(req.user.id);
  }

}
