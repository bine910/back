import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { ProductCardDto } from './dto/product-card.dto';
import { ProductSuggestionDto } from './dto/product-suggestion.dto';
import { ProductSuggestionQueryDto } from './dto/product-suggestion-query.dto';
import { ProductRelationType } from '../../common/enums';
import {
  ProductCardFilterQueryDto,
  ProductCardSortBy,
  SortOrder,
} from './dto/product-card-filter-query.dto';
import {
  DiscountBucketFacetDto,
  ProductFilterFacetsDto,
} from './dto/product-filter-facets.dto';
import { ProductFiltersQueryDto } from './dto/product-filters-query.dto';
import { ProductOpenPageResponseDto } from './dto/product-open-page-response.dto';

const FINAL_PRICE_SQL =
  '(p.base_price::numeric * (100 - p.discount_percent) / 100)';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Tạo sản phẩm mới
  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(data);
    return await this.productRepository.save(product);
  }

  // Lấy tất cả sản phẩm kèm full relations (dùng cho admin)
  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['images', 'variants', 'category', 'brand'],
      order: { created_at: 'DESC' },
    });
  }

  // Alias → findCardsByFilters
  async findAllCards(query: ProductCardFilterQueryDto) {
    return this.findCardsByFilters(query);
  }

  // Lấy danh sách card có filter, sort, phân trang → trả { items, pagination }
  async findCardsByFilters(query: ProductCardFilterQueryDto): Promise<{
    items: ProductCardDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  }> {
    const cardsQuery = this.buildCardBaseQuery();
    this.applyCardFilters(cardsQuery, query);
    this.applyCardSort(cardsQuery, query);

    const offset = (query.page - 1) * query.limit;
    const rows = await cardsQuery
      .offset(offset)
      .limit(query.limit)
      .getRawMany<Record<string, string | number | null>>();

    const totalRaw = await this.createFilteredProductsQuery(query)
      .select('COUNT(DISTINCT p.id)::int', 'total')
      .getRawOne<{ total: string | number | null }>();
    const total = this.toNumber(totalRaw?.total);

    return {
      items: rows.map((row) => this.mapRawToProductCard(row)),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        total_pages: total === 0 ? 0 : Math.ceil(total / query.limit),
      },
    };
  }

  // Top 5 sản phẩm trending, sort by rating_avg DESC
  async getTrendingCards(): Promise<ProductCardDto[]> {
    const rows = await this.buildCardBaseQuery()
      .orderBy('rating_avg', 'DESC')
      .addOrderBy('p.created_at', 'DESC')
      .limit(5)
      .getRawMany<Record<string, string | number | null>>();

    return rows.map((row) => this.mapRawToProductCard(row));
  }

  // Gợi ý tìm kiếm: prefix match theo tên, trả danh sách tối giản
  async searchSuggestions(
    query: ProductSuggestionQueryDto,
  ): Promise<ProductSuggestionDto[]> {
    const keyword = query.q.trim().toLowerCase();
    const rows = await this.productRepository
      .createQueryBuilder('p')
      .leftJoin('p.images', 'img', 'img.is_primary = :isPrimary', {
        isPrimary: true,
      })
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

  // Tính facets cho sidebar filter: price range, brands, colors, discount buckets
  async getFilterFacets(
    query: ProductFiltersQueryDto,
  ): Promise<ProductFilterFacetsDto> {
    const scopeQuery = this.createFilteredProductsQuery(query);

    const totalRaw = await scopeQuery
      .clone()
      .select('COUNT(DISTINCT p.id)::int', 'total')
      .getRawOne<{ total: string | number | null }>();
    const totalMatching = this.toNumber(totalRaw?.total);

    const priceRaw = await scopeQuery
      .clone()
      .select(`COALESCE(MIN(${FINAL_PRICE_SQL}), 0)`, 'min')
      .addSelect(`COALESCE(MAX(${FINAL_PRICE_SQL}), 0)`, 'max')
      .getRawOne<{
        min: string | number | null;
        max: string | number | null;
      }>();

    const brandRows = await scopeQuery
      .clone()
      .leftJoin('p.brand', 'b')
      .andWhere('p.brand_id IS NOT NULL')
      .select('b.id', 'id')
      .addSelect("COALESCE(b.name, '')", 'name')
      .addSelect('COUNT(DISTINCT p.id)::int', 'count')
      .groupBy('b.id')
      .addGroupBy('b.name')
      .orderBy('count', 'DESC')
      .addOrderBy('b.name', 'ASC')
      .getRawMany<Record<string, string | number | null>>();

    const colorRows = await scopeQuery
      .clone()
      .innerJoin('p.variants', 'pv')
      .andWhere("COALESCE(TRIM(pv.color), '') <> ''")
      .select('LOWER(pv.color)', 'value')
      .addSelect('COUNT(DISTINCT p.id)::int', 'count')
      .groupBy('LOWER(pv.color)')
      .orderBy('count', 'DESC')
      .addOrderBy('LOWER(pv.color)', 'ASC')
      .getRawMany<Record<string, string | number | null>>();

    const discountRaw = await scopeQuery
      .clone()
      .select(
        'SUM(CASE WHEN p.discount_percent BETWEEN 0 AND 9 THEN 1 ELSE 0 END)::int',
        'bucket_0_10',
      )
      .addSelect(
        'SUM(CASE WHEN p.discount_percent BETWEEN 10 AND 19 THEN 1 ELSE 0 END)::int',
        'bucket_10_20',
      )
      .addSelect(
        'SUM(CASE WHEN p.discount_percent BETWEEN 20 AND 29 THEN 1 ELSE 0 END)::int',
        'bucket_20_30',
      )
      .addSelect(
        'SUM(CASE WHEN p.discount_percent BETWEEN 30 AND 49 THEN 1 ELSE 0 END)::int',
        'bucket_30_50',
      )
      .addSelect(
        'SUM(CASE WHEN p.discount_percent >= 50 THEN 1 ELSE 0 END)::int',
        'bucket_50_plus',
      )
      .getRawOne<Record<string, string | number | null>>();

    const discountBuckets: DiscountBucketFacetDto[] = [
      {
        key: '0-10',
        min: 0,
        max: 10,
        count: this.toNumber(discountRaw?.bucket_0_10),
      },
      {
        key: '10-20',
        min: 10,
        max: 20,
        count: this.toNumber(discountRaw?.bucket_10_20),
      },
      {
        key: '20-30',
        min: 20,
        max: 30,
        count: this.toNumber(discountRaw?.bucket_20_30),
      },
      {
        key: '30-50',
        min: 30,
        max: 50,
        count: this.toNumber(discountRaw?.bucket_30_50),
      },
      {
        key: '50+',
        min: 50,
        max: null,
        count: this.toNumber(discountRaw?.bucket_50_plus),
      },
    ];

    return {
      price_range: {
        min: this.toNumber(priceRaw?.min),
        max: this.toNumber(priceRaw?.max),
      },
      brands: brandRows.map((row) => ({
        id: this.toNumber(row.id),
        name: String(row.name ?? ''),
        count: this.toNumber(row.count),
      })),
      colors: colorRows.map((row) => ({
        value: String(row.value ?? ''),
        count: this.toNumber(row.count),
      })),
      discount_buckets: discountBuckets,
      total_matching: totalMatching,
    };
  }

  // Toàn bộ dữ liệu trang chi tiết: product + media/options + tabs + related + reviews
  async getOpenPageById(id: number): Promise<ProductOpenPageResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id, is_active: true },
      relations: [
        'brand',
        'images',
        'variants',
        'reviews',
        'reviews.user',
        'reviews.images',
      ],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const sortedImages = [...(product.images ?? [])].sort(
      (a, b) => a.display_order - b.display_order,
    );
    const reviews = [...(product.reviews ?? [])].sort(
      (a, b) => b.created_at.getTime() - a.created_at.getTime(),
    );
    const ratingCount = reviews.length;
    const ratingAvg =
      ratingCount === 0
        ? 0
        : Number(
            (
              reviews.reduce((sum, review) => sum + review.rating, 0) /
              ratingCount
            ).toFixed(1),
          );

    const relatedSimilar = await this.getRelatedCardsByType(
      product.id,
      ProductRelationType.SIMILAR,
    );
    const relatedAlsoLike = await this.getRelatedCardsByType(
      product.id,
      ProductRelationType.CUSTOMER_ALSO_LIKE,
    );

    return {
      product: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description ?? '',
        brand_name: product.brand?.name ?? '',
        base_price: this.toNumber(product.base_price),
        final_price: this.calculateFinalPrice(
          this.toNumber(product.base_price),
          this.toNumber(product.discount_percent),
        ),
        discount_percent: this.toNumber(product.discount_percent),
        rating_avg: ratingAvg,
        rating_count: ratingCount,
      },
      media_and_options: {
        images: sortedImages.map((image) => ({
          url: image.image_url,
          color_code: image.color_code ?? null,
          is_primary: image.is_primary,
          display_order: image.display_order,
        })),
        available_sizes: this.sortSizes(
          Array.from(
            new Set(
              (product.variants ?? [])
                .map((variant) => variant.size?.trim())
                .filter((size): size is string => Boolean(size)),
            ),
          ),
        ),
        available_colors: Array.from(
          new Set(
            (product.variants ?? [])
              .map((variant) => variant.color?.trim())
              .filter((color): color is string => Boolean(color)),
          ),
        ).sort((a, b) => a.localeCompare(b)),
      },
      tabs: {
        product_details: this.normalizeRecord(product.extra?.product_details),
        specifications: this.normalizeRecord(product.extra?.specifications),
      },
      related_sections: {
        similar_products: relatedSimilar,
        customer_also_like: relatedAlsoLike,
      },
      reviews: {
        summary: {
          rating_avg: ratingAvg,
          rating_count: ratingCount,
        },
        items: reviews.map((review) => ({
          id: review.id,
          user_name: review.user?.full_name ?? '',
          rating: review.rating,
          content: review.content ?? '',
          is_verified_purchase: review.is_verified_purchase,
          created_at: review.created_at.toISOString(),
          images: (review.images ?? []).map((image) => image.image_url),
        })),
      },
    };
  }

  // Base SELECT card fields với join brand / primary-image / reviews, dùng chung cho mọi card query
  private buildCardBaseQuery(): SelectQueryBuilder<Product> {
    return this.productRepository
      .createQueryBuilder('p')
      .leftJoin('p.brand', 'b')
      .leftJoin('p.images', 'img', 'img.is_primary = :isPrimary', {
        isPrimary: true,
      })
      .leftJoin('p.reviews', 'r')
      .where('p.is_active = :active', { active: true })
      .select('p.id', 'id')
      .addSelect('p.slug', 'slug')
      .addSelect('p.name', 'name')
      .addSelect("COALESCE(b.name, '')", 'brand_name')
      .addSelect('img.image_url', 'thumbnail_url')
      .addSelect('p.base_price', 'base_price')
      .addSelect('p.discount_percent', 'discount_percent')
      .addSelect(`ROUND(${FINAL_PRICE_SQL}, 2)`, 'final_price')
      .addSelect('COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)', 'rating_avg')
      .addSelect('COUNT(DISTINCT r.id)::int', 'rating_count')
      .groupBy('p.id')
      .addGroupBy('b.name')
      .addGroupBy('img.image_url');
  }

  // Lấy card sản phẩm liên quan theo relation_type (SIMILAR hoặc CUSTOMER_ALSO_LIKE)
  private async getRelatedCardsByType(
    productId: number,
    relationType: ProductRelationType,
  ): Promise<ProductCardDto[]> {
    const rows = await this.productRepository
      .createQueryBuilder('p')
      .innerJoin(
        'product_relations',
        'pr',
        'pr.related_product_id = p.id AND pr.product_id = :productId AND pr.relation_type = :relationType',
        { productId, relationType },
      )
      .leftJoin('p.brand', 'b')
      .leftJoin('p.images', 'img', 'img.is_primary = :isPrimary', {
        isPrimary: true,
      })
      .leftJoin('p.reviews', 'r')
      .where('p.is_active = :active', { active: true })
      .select('p.id', 'id')
      .addSelect('p.slug', 'slug')
      .addSelect('p.name', 'name')
      .addSelect("COALESCE(b.name, '')", 'brand_name')
      .addSelect('img.image_url', 'thumbnail_url')
      .addSelect('p.base_price', 'base_price')
      .addSelect('p.discount_percent', 'discount_percent')
      .addSelect(`ROUND(${FINAL_PRICE_SQL}, 2)`, 'final_price')
      .addSelect('COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)', 'rating_avg')
      .addSelect('COUNT(DISTINCT r.id)::int', 'rating_count')
      .addSelect('COALESCE(pr.sort_order, 0)', 'sort_order')
      .groupBy('p.id')
      .addGroupBy('b.name')
      .addGroupBy('img.image_url')
      .addGroupBy('pr.sort_order')
      .orderBy('sort_order', 'ASC')
      .addOrderBy('p.created_at', 'DESC')
      .getRawMany<Record<string, string | number | null>>();

    return rows.map((row) => this.mapRawToProductCard(row));
  }

  // Query cơ sở đã áp filter, dùng chung cho findCardsByFilters và getFilterFacets
  private createFilteredProductsQuery(
    query: ProductFiltersQueryDto | ProductCardFilterQueryDto,
  ): SelectQueryBuilder<Product> {
    const qb = this.productRepository
      .createQueryBuilder('p')
      .where('p.is_active = :active', { active: true });
    this.applyCardFilters(qb, query);
    return qb;
  }

  // Thêm WHERE clauses (giá, brand, màu, discount) vào query builder
  private applyCardFilters(
    qb: SelectQueryBuilder<Product>,
    query: ProductFiltersQueryDto | ProductCardFilterQueryDto,
  ): void {
    if (query.minPrice !== undefined) {
      qb.andWhere(`${FINAL_PRICE_SQL} >= :minPrice`, {
        minPrice: query.minPrice,
      });
    }

    if (query.maxPrice !== undefined) {
      qb.andWhere(`${FINAL_PRICE_SQL} <= :maxPrice`, {
        maxPrice: query.maxPrice,
      });
    }

    if (query.minDiscount !== undefined) {
      qb.andWhere('p.discount_percent >= :minDiscount', {
        minDiscount: query.minDiscount,
      });
    }

    if (query.brandIds && query.brandIds.length > 0) {
      qb.andWhere('p.brand_id IN (:...brandIds)', { brandIds: query.brandIds });
    }

    const normalizedColors = (query.colors ?? [])
      .map((color) => color.trim().toLowerCase())
      .filter((color) => color.length > 0);

    if (normalizedColors.length > 0) {
      qb.andWhere(
        `EXISTS (
          SELECT 1
          FROM product_variants pv
          WHERE pv.product_id = p.id
            AND LOWER(pv.color) IN (:...colors)
        )`,
        { colors: normalizedColors },
      );
    }
  }

  // Thêm ORDER BY theo sortBy / sortOrder, kèm tiebreaker created_at DESC
  private applyCardSort(
    qb: SelectQueryBuilder<Product>,
    query: ProductCardFilterQueryDto,
  ): void {
    const sortOrder = query.sortOrder ?? SortOrder.DESC;

    if (query.sortBy === ProductCardSortBy.FINAL_PRICE) {
      qb.orderBy(FINAL_PRICE_SQL, sortOrder);
    } else if (query.sortBy === ProductCardSortBy.RATING_AVG) {
      qb.orderBy('rating_avg', sortOrder);
    } else {
      qb.orderBy('p.created_at', sortOrder);
    }

    if (query.sortBy !== ProductCardSortBy.CREATED_AT) {
      qb.addOrderBy('p.created_at', 'DESC');
    }
  }

  // Map raw DB row → ProductSuggestionDto
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

  // Map raw DB row → ProductCardDto (rating_count bỏ qua nếu = 0)
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

  // Ép kiểu an toàn: string | number | null | undefined → number (null/undefined → 0)
  private toNumber(v: string | number | null | undefined): number {
    return v === null || v === undefined
      ? 0
      : typeof v === 'number'
        ? v
        : Number(v);
  }

  // Tính final_price = base_price * (100 - discount%) / 100, làm tròn 2 chữ số
  private calculateFinalPrice(
    basePrice: number,
    discountPercent: number,
  ): number {
    return Number(((basePrice * (100 - discountPercent)) / 100).toFixed(2));
  }

  // Chuẩn hóa jsonb object → Record<string, string> (dùng cho extra.product_details / specifications)
  private normalizeRecord(value: unknown): Record<string, string> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }

    const entries = Object.entries(value as Record<string, unknown>).map(
      ([key, rawValue]) => {
        if (typeof rawValue === 'string') {
          return [key, rawValue] as const;
        }
        if (typeof rawValue === 'number' || typeof rawValue === 'boolean') {
          return [key, `${rawValue}`] as const;
        }
        if (rawValue instanceof Date) {
          return [key, rawValue.toISOString()] as const;
        }
        return [key, ''] as const;
      },
    );

    return Object.fromEntries(entries);
  }

  // Sort size theo thứ tự chuẩn: XXS → XS → S → M → L → XL → XXL → XXXL
  private sortSizes(sizes: string[]): string[] {
    const rank: Record<string, number> = {
      XXS: 0,
      XS: 1,
      S: 2,
      M: 3,
      L: 4,
      XL: 5,
      XXL: 6,
      XXXL: 7,
    };

    return [...sizes].sort((a, b) => {
      const normalizedA = a.toUpperCase();
      const normalizedB = b.toUpperCase();
      const rankA = rank[normalizedA] ?? Number.MAX_SAFE_INTEGER;
      const rankB = rank[normalizedB] ?? Number.MAX_SAFE_INTEGER;
      if (rankA !== rankB) {
        return rankA - rankB;
      }
      return normalizedA.localeCompare(normalizedB);
    });
  }

  // Lấy sản phẩm theo ID kèm full relations, throw 404 nếu không tìm thấy
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

  // Cập nhật sản phẩm theo ID
  async update(id: number, data: Partial<Product>): Promise<Product> {
    const product = await this.findOne(id);
    this.productRepository.merge(product, data);
    return await this.productRepository.save(product);
  }

  // Xóa sản phẩm theo ID
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
