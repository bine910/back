import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductSuggestionQueryDto {
  @ApiProperty({ example: 'áo', description: 'Từ khóa tìm kiếm (prefix match)' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  q!: string;

  @ApiPropertyOptional({ example: 8, minimum: 1, maximum: 20, default: 8 })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return 8;
    }
    return Number(value);
  })
  @IsInt()
  @Min(1)
  @Max(20)
  limit = 8;
}
