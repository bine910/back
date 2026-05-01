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
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProductCardFilterQueryDto } from './dto/product-card-filter-query.dto';
import { ProductFiltersQueryDto } from './dto/product-filters-query.dto';
import { ProductCardListResponseDto } from './dto/product-card-list-response.dto';
import { ProductFilterFacetsDto } from './dto/product-filter-facets.dto';

@ApiTags('Sản phẩm (Products)')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

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
  @ApiOperation({
    summary: 'Lấy danh sách thẻ sản phẩm có phân trang và filter',
  })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'brandIds', required: false, type: String, example: '1,2' })
  @ApiQuery({
    name: 'colors',
    required: false,
    type: String,
    example: 'red,blue',
  })
  @ApiQuery({ name: 'minDiscount', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 12 })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['created_at', 'final_price', 'rating_avg'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  @ApiOkResponse({ type: ProductCardListResponseDto })
  findAllCards(@Query() query: ProductCardFilterQueryDto) {
    return this.productService.findCardsByFilters(query);
  }

  @Get('trending')
  @ApiOperation({
    summary: 'Lấy danh sách thẻ sản phẩm trending cho trang chủ',
  })
  getTrendingCards() {
    return this.productService.getTrendingCards();
  }

  @Get('filters')
  @ApiOperation({ summary: 'Lấy dữ liệu sidebar filter sản phẩm' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'brandIds', required: false, type: String, example: '1,2' })
  @ApiQuery({
    name: 'colors',
    required: false,
    type: String,
    example: 'red,blue',
  })
  @ApiQuery({ name: 'minDiscount', required: false, type: Number })
  @ApiOkResponse({ type: ProductFilterFacetsDto })
  getFilters(@Query() query: ProductFiltersQueryDto) {
    return this.productService.getFilterFacets(query);
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
