import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    product_id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    sku: string;

    @Column({ type: 'varchar', length: 50 })
    color: string;

    @Column({ type: 'varchar', length: 20 })
    size: string;

    @Column({ type: 'int', default: 0 })
    stock_quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price_override: number;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    // Relations
    @ManyToOne(() => Product, (product) => product.variants, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'product_id' })
    product: Product;
}
