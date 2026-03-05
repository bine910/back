import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { UserRole } from '../../common/enums';
import { UserAddress } from './user-address.entity';
import { Wishlist } from './wishlist.entity';
import { CartItem } from './cart-item.entity';
import { ProductReview } from './product-review.entity';
import { Order } from './order.entity';
import { Payment } from './payment.entity';
import { Blog } from './blog.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password_hash: string;

    @Column({ type: 'varchar', length: 255 })
    full_name: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone_number: string;

    @Column({ type: 'text', nullable: true })
    avatar_url: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
    role: UserRole;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    // Relations
    @OneToMany(() => UserAddress, (address) => address.user)
    addresses: UserAddress[];

    @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
    wishlists: Wishlist[];

    @OneToMany(() => CartItem, (cartItem) => cartItem.user)
    cart_items: CartItem[];

    @OneToMany(() => ProductReview, (review) => review.user)
    reviews: ProductReview[];

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @OneToMany(() => Payment, (payment) => payment.user)
    payments: Payment[];

    @OneToMany(() => Blog, (blog) => blog.author)
    blogs: Blog[];
}
