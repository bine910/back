import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class ProductSuggestionQueryDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  q: string;

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
