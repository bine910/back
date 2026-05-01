import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const parseStringList = (value: unknown): string[] => {
  const toSafeString = (item: unknown): string => {
    if (typeof item === 'string') {
      return item;
    }
    if (typeof item === 'number' || typeof item === 'boolean') {
      return String(item);
    }
    return '';
  };

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => toSafeString(item).split(','))
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
  return toSafeString(value)
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const parseNumberList = (value: unknown): number[] =>
  parseStringList(value)
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item));

export class ProductFiltersQueryDto {
  @ApiPropertyOptional({ example: 100000, minimum: 0 })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsInt()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 2000000, minimum: 0 })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    example: '1,2,3',
    description: 'Comma-separated brand ids',
  })
  @IsOptional()
  @Transform(({ value }) => parseNumberList(value))
  @IsArray()
  @ArrayMaxSize(50)
  @IsInt({ each: true })
  @Min(1, { each: true })
  brandIds?: number[];

  @ApiPropertyOptional({
    example: 'red,blue,black',
    description: 'Comma-separated variant colors',
  })
  @IsOptional()
  @Transform(({ value }) => parseStringList(value))
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  colors?: string[];

  @ApiPropertyOptional({ example: 30, minimum: 0, maximum: 100 })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsInt()
  @Min(0)
  @Max(100)
  minDiscount?: number;
}
