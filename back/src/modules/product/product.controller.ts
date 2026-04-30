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
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Sản phẩm (Products)')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiOperation({ summary: 'Tạo sản phẩm mới' })
  create(@Body() body: Partial<Product>) {
    return this.productService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả sản phẩm' })
  findAll() {
    return this.productService.findAll();
  }

 

  @Get('cards')
  @ApiOperation({ summary: 'Lấy danh sách tất cả thẻ sản phẩm' })
  findAllCards() {
    return this.productService.findAllCards();
  }

  @Get('trending')
  @ApiOperation({ summary: 'Lấy danh sách thẻ sản phẩm trending cho trang chủ' })
  getTrendingCards() {
    return this.productService.getTrendingCards();
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Lấy gợi ý sản phẩm cho thanh tìm kiếm' })
  getSuggestions(@Query() query: ProductSuggestionQueryDto) {
    return this.productService.searchSuggestions(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin sản phẩm theo ID' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin sản phẩm' })
  update(@Param('id') id: string, @Body() body: Partial<Product>) {
    return this.productService.update(+id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa sản phẩm theo id' })
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}