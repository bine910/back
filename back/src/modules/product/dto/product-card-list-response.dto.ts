import { ApiProperty } from '@nestjs/swagger';
import { ProductCardDto } from './product-card.dto';

export class ProductCardPaginationDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 12 })
  limit: number;

  @ApiProperty({ example: 128 })
  total: number;

  @ApiProperty({ example: 11 })
  total_pages: number;
}

export class ProductCardListResponseDto {
  @ApiProperty({ type: [ProductCardDto] })
  items: ProductCardDto[];

  @ApiProperty({ type: ProductCardPaginationDto })
  pagination: ProductCardPaginationDto;
}
