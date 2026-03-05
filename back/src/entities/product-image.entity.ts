import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    product_id: number;

    @Column({ type: 'text' })
    image_url: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    color_code: string;

    @Column({ type: 'boolean', default: false })
    is_primary: boolean;

    @Column({ type: 'int', default: 0 })
    display_order: number;

    // Relations
    @ManyToOne(() => Product, (product) => product.images, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'product_id' })
    product: Product;
}
