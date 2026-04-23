import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { ProductCardDto } from './dto/product-card.dto';
import { ProductSuggestionDto } from './dto/product-suggestion.dto';
import { ProductSuggestionQueryDto } from './dto/product-suggestion-query.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(data);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['images', 'variants', 'category', 'brand'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Danh sách card: join tối thiểu, không trả relations đầy đủ.
   */
  
  async findAllCards(): Promise<ProductCardDto[]> {
    const rows = await this.productRepository
      .createQueryBuilder('p')
      .leftJoin('p.brand', 'b')
      .leftJoin(
        'p.images',
        'img',
        'img.is_primary = :isPrimary',
        { isPrimary: true },
      )
      .leftJoin('p.reviews', 'r')
      .where('p.is_active = :active', { active: true })
      .select('p.id', 'id')
      .addSelect('p.slug', 'slug')
      .addSelect('p.name', 'name')
      .addSelect("COALESCE(b.name, '')", 'brand_name')
      .addSelect('img.image_url', 'thumbnail_url')
      .addSelect('p.base_price', 'base_price')
      .addSelect('p.discount_percent', 'discount_percent')
      .addSelect(
        'ROUND((p.base_price::numeric * (100 - p.discount_percent) / 100), 2)',
        'final_price',
      )
      .addSelect('COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)', 'rating_avg')
      .addSelect('COUNT(r.id)::int', 'rating_count')
      .groupBy('p.id')
      .addGroupBy('b.name')
      .addGroupBy('img.image_url')
      .orderBy('p.created_at', 'DESC')
      .getRawMany<Record<string, string | number | null>>();

    return rows.map((row) => this.mapRawToProductCard(row));
  }

  async getTrendingCards(): Promise<ProductCardDto[]> {
    const rows = await this.productRepository
      .createQueryBuilder('p')
      .leftJoin('p.brand', 'b')
      .leftJoin(
        'p.images',
        'img',
        'img.is_primary = :isPrimary',
        { isPrimary: true },
      )
      .leftJoin('p.reviews', 'r')
      .where('p.is_active = :active', { active: true })
      .select('p.id', 'id')
      .addSelect('p.slug', 'slug')
      .addSelect('p.name', 'name')
      .addSelect("COALESCE(b.name, '')", 'brand_name')
      .addSelect('img.image_url', 'thumbnail_url')
      .addSelect('p.base_price', 'base_price')
      .addSelect('p.discount_percent', 'discount_percent')
      .addSelect(
        'ROUND((p.base_price::numeric * (100 - p.discount_percent) / 100), 2)',
        'final_price',
      )
      .addSelect('COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)', 'rating_avg')
      .addSelect('COUNT(r.id)::int', 'rating_count')
      .groupBy('p.id')
      .addGroupBy('b.name')
      .addGroupBy('img.image_url')
      .orderBy('rating_avg', 'DESC')
      .limit(5)
      .getRawMany<Record<string, string | number | null>>();

    return rows.map((row) => this.mapRawToProductCard(row));
  }

  async searchSuggestions(
    query: ProductSuggestionQueryDto,
  ): Promise<ProductSuggestionDto[]> {
    const keyword = query.q.trim().toLowerCase();
    const rows = await this.productRepository
      .createQueryBuilder('p')
      .leftJoin(
        'p.images',
        'img',
        'img.is_primary = :isPrimary',
        { isPrimary: true },
      )
      .leftJoin('p.reviews', 'r')
      .where('p.is_active = :active', { active: true })
      .andWhere('LOWER(p.name) LIKE :prefix', { prefix: `${keyword}%` })
      .select('p.id', 'id')
      .addSelect('p.slug', 'slug')
      .addSelect('p.name', 'name')
      .addSelect('img.image_url', 'thumbnail_url')
      .addSelect('p.base_price', 'base_price')
      .addSelect('p.discount_percent', 'discount_percent')
      .addSelect(
        'ROUND((p.base_price::numeric * (100 - p.discount_percent) / 100), 2)',
        'final_price',
      )
      .addSelect('COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)', 'rating_avg')
      .groupBy('p.id')
      .addGroupBy('img.image_url')
      .orderBy('rating_avg', 'DESC')
      .addOrderBy('p.created_at', 'DESC')
      .limit(query.limit)
      .getRawMany<Record<string, string | number | null>>();

    return rows.map((row) => this.mapRawToSuggestion(row));
  }

  private mapRawToSuggestion(
    row: Record<string, string | number | null>,
  ): ProductSuggestionDto {
    return {
      id: this.toNumber(row.id),
      slug: String(row.slug ?? ''),
      name: String(row.name ?? ''),
      thumbnail_url: row.thumbnail_url != null ? String(row.thumbnail_url) : '',
      base_price: this.toNumber(row.base_price),
      final_price: this.toNumber(row.final_price),
      discount_percent: this.toNumber(row.discount_percent),
    };
  }

  private mapRawToProductCard(
    row: Record<string, string | number | null>,
  ): ProductCardDto {
    const ratingCount = this.toNumber(row.rating_count);
    const dto: ProductCardDto = {
      id: this.toNumber(row.id),
      slug: String(row.slug ?? ''),
      name: String(row.name ?? ''),
      brand_name: String(row.brand_name ?? ''),
      thumbnail_url: row.thumbnail_url != null ? String(row.thumbnail_url) : '',
      base_price: this.toNumber(row.base_price),
      final_price: this.toNumber(row.final_price),
      discount_percent: this.toNumber(row.discount_percent),
      rating_avg: this.toNumber(row.rating_avg),
    };
    if (ratingCount > 0) {
      dto.rating_count = ratingCount;
    }
    return dto;
  }

  private toNumber(v: string | number | null | undefined): number {
    return v === null || v === undefined ? 0 : typeof v === 'number' ? v : Number(v);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['images', 'variants', 'category', 'brand', 'reviews'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    const product = await this.findOne(id);
    this.productRepository.merge(product, data);
    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}