import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
  @ApiProperty({ example: 1 })
  cart_item_id: number;

  @ApiProperty({ example: 5 })
  product_id: number;

  @ApiProperty({ example: 'Áo thun Basic' })
  product_name: string;

  @ApiProperty({ example: 'ao-thun-basic' })
  slug: string;

  @ApiProperty({ example: 10 })
  product_variant_id: number;

  @ApiProperty({ example: 'SKU-001' })
  sku: string;

  @ApiProperty({ example: 'Đen' })
  color: string;

  @ApiProperty({ example: 'M' })
  size: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 299000 })
  unit_price: number;

  @ApiProperty({ example: 598000 })
  subtotal: number;

  @ApiProperty({ example: 'https://example.com/image.jpg', nullable: true })
  thumbnail: string | null;

  @ApiProperty({ example: 50 })
  stock_quantity: number;
}

export class CartResponseDto {
  @ApiProperty({ type: [CartItemDto] })
  items: CartItemDto[];

  @ApiProperty({ example: 1196000 })
  total_amount: number;
}
