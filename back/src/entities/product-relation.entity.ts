import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductRelationType } from '../common/enums';

@Entity('product_relations')
@Unique(['product_id', 'related_product_id', 'relation_type'])
export class ProductRelation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    product_id: number;

    @Column({ type: 'int' })
    related_product_id: number;

    @Column({
        type: 'enum',
        enum: ProductRelationType,
    })
    relation_type: ProductRelationType;

    @Column({ type: 'int', default: 0 })
    sort_order: number;

    // Relations
    @ManyToOne(() => Product, (product) => product.relations_from, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'related_product_id' })
    related_product: Product;
}
