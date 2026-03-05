import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ProductReview } from './product-review.entity';

@Entity('review_images')
export class ReviewImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    review_id: number;

    @Column({ type: 'text' })
    image_url: string;

    // Relations
    @ManyToOne(() => ProductReview, (review) => review.images, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'review_id' })
    review: ProductReview;
}
