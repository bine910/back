import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';
import { PaymentMethod, PaymentStatus } from '../../common/enums';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    order_id: number;

    @Column({ type: 'int', nullable: true })
    user_id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'enum', enum: PaymentMethod })
    payment_method: PaymentMethod;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    status: PaymentStatus;

    @Column({ type: 'varchar', length: 255, nullable: true })
    provider_transaction_id: string;

    @Column({ type: 'jsonb', nullable: true })
    gateway_response: Record<string, any>;

    @Column({ type: 'timestamptz', nullable: true })
    paid_at: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    // Relations
    @ManyToOne(() => Order, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => User, (user) => user.payments, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
