import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Brand } from './brand.entity';
import { ProductImage } from './product-image.entity';
import { ProductRelation } from './product-relation.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductReview } from './product-review.entity';
import { Wishlist } from './wishlist.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    slug: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'int', nullable: true })
    category_id: number;

    @Column({ type: 'int', nullable: true })
    brand_id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    base_price: number;

    @Column({ type: 'int', default: 0 })
    discount_percent: number;

    @Column({ type: 'jsonb', nullable: true })
    extra: {
        specifications?: Record<string, any>;
        product_details?: Record<string, string>;
    };

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    // Relations
    @ManyToOne(() => Category, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToOne(() => Brand, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'brand_id' })
    brand: Brand;

    @OneToMany(() => ProductImage, (image) => image.product)
    images: ProductImage[];

    @OneToMany(() => ProductRelation, (relation) => relation.product)
    relations_from: ProductRelation[];

    @OneToMany(() => ProductVariant, (variant) => variant.product)
    variants: ProductVariant[];

    @OneToMany(() => ProductReview, (review) => review.product)
    reviews: ProductReview[];

    @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
    wishlists: Wishlist[];
}
