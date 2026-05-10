import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ description: 'ID của variant sản phẩm cần thêm vào giỏ hàng' })
  @IsInt()
  @IsPositive()
  product_variant_id: number;

  @ApiPropertyOptional({ description: 'Số lượng cần thêm', default: 1 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  quantity?: number;
}
