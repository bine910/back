import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductCardDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ao-cotton-trang' })
  slug: string;

  @ApiProperty({ example: 'Áo Cotton Trắng' })
  name: string;

  @ApiProperty({ example: 'Nike' })
  brand_name: string;

  @ApiProperty({ example: 'https://...' })
  thumbnail_url: string;

  @ApiProperty({ example: 250000 })
  base_price: number;

  @ApiProperty({ example: 225000 })
  final_price: number;

  @ApiProperty({ example: 10 })
  discount_percent: number;

  @ApiProperty({ example: 4.5 })
  rating_avg: number;

  @ApiPropertyOptional({ example: 128 })
  rating_count?: number;
}
