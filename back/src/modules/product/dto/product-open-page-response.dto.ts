import { ApiProperty } from '@nestjs/swagger';
import { ProductCardDto } from './product-card.dto';

export class ProductOpenPageProductDto {
  @ApiProperty({ example: 10 })
  id: number;

  @ApiProperty({ example: 'casual-cotton-tee-10' })
  slug: string;

  @ApiProperty({ example: 'Casual Cotton Tee' })
  name: string;

  @ApiProperty({ example: 'Soft cotton T-shirt for everyday comfort' })
  description: string;

  @ApiProperty({ example: 'Brand Name' })
  brand_name: string;

  @ApiProperty({ example: 11000 })
  base_price: number;

  @ApiProperty({ example: 9900 })
  final_price: number;

  @ApiProperty({ example: 10 })
  discount_percent: number;

  @ApiProperty({ example: 4.3 })
  rating_avg: number;

  @ApiProperty({ example: 12 })
  rating_count: number;
}

export class ProductOpenPageImageDto {
  @ApiProperty({
    example: 'https://images.pexels.com/photos/810775/pexels-photo-810775.jpeg',
  })
  url: string;

  @ApiProperty({ example: 'Default', nullable: true })
  color_code: string | null;

  @ApiProperty({ example: true })
  is_primary: boolean;

  @ApiProperty({ example: 1 })
  display_order: number;
}

export class ProductOpenPageMediaAndOptionsDto {
  @ApiProperty({ type: [ProductOpenPageImageDto] })
  images: ProductOpenPageImageDto[];

  @ApiProperty({ type: [String], example: ['XS', 'S', 'M', 'L', 'XL'] })
  available_sizes: string[];

  @ApiProperty({ type: [String], example: ['Default', 'Black'] })
  available_colors: string[];
}

export class ProductOpenPageTabsDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: {
      Size_Fit: 'Regular fit',
      Material_Care: 'Machine wash cold',
      Product_detail: 'Soft cotton T-shirt for everyday comfort',
    },
  })
  product_details: Record<string, string>;

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: {
      sleeveLength: 'Short',
      collar: 'Round',
      occasion: 'Casual',
    },
  })
  specifications: Record<string, string>;
}

export class ProductOpenPageReviewSummaryDto {
  @ApiProperty({ example: 4.2 })
  rating_avg: number;

  @ApiProperty({ example: 6 })
  rating_count: number;
}

export class ProductOpenPageReviewItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Anne Doe' })
  user_name: string;

  @ApiProperty({ example: 4 })
  rating: number;

  @ApiProperty({
    example: 'Comfortable and soft material. Good for daily wear.',
  })
  content: string;

  @ApiProperty({ example: true })
  is_verified_purchase: boolean;

  @ApiProperty({ example: '2025-09-10T00:00:00.000Z' })
  created_at: string;

  @ApiProperty({
    type: [String],
    example: [
      'https://images.pexels.com/photos/810775/pexels-photo-810775.jpeg',
    ],
  })
  images: string[];
}

export class ProductOpenPageReviewsDto {
  @ApiProperty({ type: ProductOpenPageReviewSummaryDto })
  summary: ProductOpenPageReviewSummaryDto;

  @ApiProperty({ type: [ProductOpenPageReviewItemDto] })
  items: ProductOpenPageReviewItemDto[];
}

export class ProductOpenPageRelatedSectionsDto {
  @ApiProperty({ type: [ProductCardDto] })
  similar_products: ProductCardDto[];

  @ApiProperty({ type: [ProductCardDto] })
  customer_also_like: ProductCardDto[];
}

export class ProductOpenPageResponseDto {
  @ApiProperty({ type: ProductOpenPageProductDto })
  product: ProductOpenPageProductDto;

  @ApiProperty({ type: ProductOpenPageMediaAndOptionsDto })
  media_and_options: ProductOpenPageMediaAndOptionsDto;

  @ApiProperty({ type: ProductOpenPageTabsDto })
  tabs: ProductOpenPageTabsDto;

  @ApiProperty({ type: ProductOpenPageRelatedSectionsDto })
  related_sections: ProductOpenPageRelatedSectionsDto;

  @ApiProperty({ type: ProductOpenPageReviewsDto })
  reviews: ProductOpenPageReviewsDto;
}
