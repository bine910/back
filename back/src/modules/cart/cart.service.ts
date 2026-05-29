import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '../../entities/cart-item.entity';
import { ProductVariant } from '../../entities/product-variant.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartItemDto, CartResponseDto } from './dto/cart-response.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
  ) {}

  async addToCart(userId: number, dto: AddToCartDto): Promise<CartItem> {
    const variant = await this.productVariantRepository.findOneBy({
      id: dto.product_variant_id,
    });
    if (!variant) {
      throw new NotFoundException(
        `Variant sản phẩm với ID ${dto.product_variant_id} không tồn tại`,
      );
    }

    const quantity = dto.quantity ?? 1;

    const existing = await this.cartItemRepository.findOneBy({
      user_id: userId,
      product_variant_id: dto.product_variant_id,
    });

    if (existing) {
      existing.quantity += quantity;
      return this.cartItemRepository.save(existing);
    }

    const item = this.cartItemRepository.create({
      user_id: userId,
      product_variant_id: dto.product_variant_id,
      quantity,
    });
    return this.cartItemRepository.save(item);
  }

  async getCart(userId: number): Promise<CartResponseDto> {
    const rows = await this.cartItemRepository
      .createQueryBuilder('ci')
      .innerJoin('ci.product_variant', 'pv')
      .innerJoin('pv.product', 'p')
      .where('ci.user_id = :userId', { userId })
      .select('ci.id', 'cart_item_id')
      .addSelect('ci.quantity', 'quantity')
      .addSelect('ci.product_variant_id', 'product_variant_id')
      .addSelect('pv.sku', 'sku')
      .addSelect('pv.color', 'color')
      .addSelect('pv.size', 'size')
      .addSelect('pv.stock_quantity', 'stock_quantity')
      .addSelect('pv.price_override', 'price_override')
      .addSelect('p.id', 'product_id')
      .addSelect('p.name', 'product_name')
      .addSelect('p.slug', 'slug')
      .addSelect('p.base_price', 'base_price')
      .addSelect('p.discount_percent', 'discount_percent')
      .addSelect(
        `(SELECT img.image_url FROM product_images img
          WHERE img.product_id = p.id
          ORDER BY
            CASE WHEN img.color_code = pv.color AND img.is_primary = true THEN 0
                 WHEN img.is_primary = true THEN 1
                 ELSE 2
            END
          LIMIT 1)`,
        'thumbnail',
      )
      .orderBy('ci.created_at', 'ASC')
      .getRawMany<Record<string, any>>();

    const items = rows.map((row) => this.mapToCartItemDto(row));
    const total_amount = items.reduce((sum, item) => sum + item.subtotal, 0);

    return { items, total_amount };
  }

  private mapToCartItemDto(row: Record<string, any>): CartItemDto {
    const basePrice = Number(row.base_price ?? 0);
    const discountPercent = Number(row.discount_percent ?? 0);
    const priceOverride =
      row.price_override != null ? Number(row.price_override) : null;
    const quantity = Number(row.quantity ?? 1);

    const unit_price =
      priceOverride !== null
        ? priceOverride
        : basePrice * (1 - discountPercent / 100);

    return {
      cart_item_id: Number(row.cart_item_id),
      product_id: Number(row.product_id),
      product_name: String(row.product_name ?? ''),
      slug: String(row.slug ?? ''),
      product_variant_id: Number(row.product_variant_id),
      sku: String(row.sku ?? ''),
      color: String(row.color ?? ''),
      size: String(row.size ?? ''),
      quantity,
      unit_price: Math.round(unit_price * 100) / 100,
      subtotal: Math.round(unit_price * quantity * 100) / 100,
      thumbnail: (row.thumbnail as string) ?? null,
      stock_quantity: Number(row.stock_quantity ?? 0),
    };
  }
}
