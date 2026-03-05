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
import { User } from './user.entity';
import { Product } from './product.entity';
import { ReviewImage } from './review-image.entity';

@Entity('product_reviews')
export class ProductReview {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    product_id: number;

    @Column({ type: 'int' })
    user_id: number;

    @Column({ type: 'int' })
    rating: number;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ type: 'boolean', default: false })
    is_verified_purchase: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    // Relations
    @ManyToOne(() => Product, (product) => product.reviews, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => ReviewImage, (image) => image.review)
    images: ReviewImage[];
}
