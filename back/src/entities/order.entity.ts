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
import { UserAddress } from './user-address.entity';
import { OrderStatus } from '../../common/enums';
import { PaymentStatus } from '../../common/enums';
import { PaymentMethod } from '../../common/enums';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: true })
    user_id: number;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_amount: number;

    @Column({ type: 'int', nullable: true })
    shipping_address_id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    shipping_fee: number;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        nullable: true,
    })
    payment_method: PaymentMethod;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    payment_status: PaymentStatus;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    // Relations
    @ManyToOne(() => User, (user) => user.orders, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => UserAddress, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'shipping_address_id' })
    shipping_address: UserAddress;

    @OneToMany(() => OrderItem, (item) => item.order)
    items: OrderItem[];
}
