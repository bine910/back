import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '../../entities/wishlist.entity';
import { Product } from '../../entities/product.entity';
import { WishlistDto } from './dto/add-to-wishlist.dto';
import { ProductCardDto } from '../product/dto/product-card.dto';

const FINAL_PRICE_SQL =
  '(p.base_price::numeric * (100 - p.discount_percent) / 100)';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async addToWishlist(userId: number, dto: WishlistDto): Promise<Wishlist> {
    const product = await this.productRepository.findOneBy({ id: dto.product_id });
    if (!product) {
      throw new NotFoundException(`Sản phẩm với ID ${dto.product_id} không tồn tại`);
    }

    const existing = await this.wishlistRepository.findOneBy({
      user_id: userId,
      product_id: dto.product_id,
    });
    if (existing) {
      throw new ConflictException('Sản phẩm đã có trong wishlist');
    }

    const item = this.wishlistRepository.create({
      user_id: userId,
      product_id: dto.product_id,
    });
    return this.wishlistRepository.save(item);
  }
async removeFromWishlist(userId: number, dto: WishlistDto): Promise<void> {  
    const existing = await this.wishlistRepository.findOneBy({
      user_id: userId,
      product_id: dto.product_id,
    });
    if (!existing) {
      throw new NotFoundException('Sản phẩm không tồn tại trong wishlist');
    }
    await this.wishlistRepository.remove(existing);
  }

  async getWishlist(userId: number): Promise<ProductCardDto[]> {
    const rows = await this.productRepository
      .createQueryBuilder('p')
      .innerJoin(
        'wishlists',
        'w',
        'w.product_id = p.id AND w.user_id = :userId',
        { userId },
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
      .addSelect('w.created_at', 'wished_at')
      .groupBy('p.id')
      .addGroupBy('b.name')
      .addGroupBy('img.image_url')
      .addGroupBy('w.created_at')
      .orderBy('w.created_at', 'DESC')
      .getRawMany<Record<string, string | number | null>>();

    return rows.map((row) => this.mapRawToProductCard(row));
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
    return v === null || v === undefined
      ? 0
      : typeof v === 'number'
        ? v
        : Number(v);
  }
}
