import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class AddToWishlistDto {
  @ApiProperty({ description: 'ID của sản phẩm cần thêm vào wishlist' })
  @IsInt()
  @IsPositive()
  product_id: number;
}
