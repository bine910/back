import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '../../entities/product.entity';
import { ProductSuggestionQueryDto } from './dto/product-suggestion-query.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  create(@Body() body: Partial<Product>) {
    return this.productService.create(body);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('cards')
  findAllCards() {
    return this.productService.findAllCards();
  }

  @Get('trending')
  getTrendingCards() {
    return this.productService.getTrendingCards();
  }

  @Get('suggestions')
  getSuggestions(@Query() query: ProductSuggestionQueryDto) {
    return this.productService.searchSuggestions(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Product>) {
    return this.productService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}