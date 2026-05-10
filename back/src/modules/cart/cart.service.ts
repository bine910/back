import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '../../entities/cart-item.entity';
import { ProductVariant } from '../../entities/product-variant.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';

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
}
