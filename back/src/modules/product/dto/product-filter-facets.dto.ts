import { ApiProperty } from '@nestjs/swagger';

export class PriceRangeDto {
  @ApiProperty({ example: 99000 })
  min: number;

  @ApiProperty({ example: 2500000 })
  max: number;
}

export class BrandFacetDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Tokyo Talkies' })
  name: string;

  @ApiProperty({ example: 42 })
  count: number;
}

export class ColorFacetDto {
  @ApiProperty({ example: 'red' })
  value: string;

  @ApiProperty({ example: 18 })
  count: number;
}

export class DiscountBucketFacetDto {
  @ApiProperty({ example: '0-10' })
  key: string;

  @ApiProperty({ example: 0 })
  min: number;

  @ApiProperty({ example: 10, nullable: true })
  max: number | null;

  @ApiProperty({ example: 12 })
  count: number;
}

export class ProductFilterFacetsDto {
  @ApiProperty({ type: PriceRangeDto })
  price_range: PriceRangeDto;

  @ApiProperty({ type: [BrandFacetDto] })
  brands: BrandFacetDto[];

  @ApiProperty({ type: [ColorFacetDto] })
  colors: ColorFacetDto[];

  @ApiProperty({ type: [DiscountBucketFacetDto] })
  discount_buckets: DiscountBucketFacetDto[];

  @ApiProperty({ example: 120 })
  total_matching: number;
}
