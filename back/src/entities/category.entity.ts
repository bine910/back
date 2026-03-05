import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    slug: string;

    @Column({ type: 'int', nullable: true })
    parent_id: number;

    @Column({ type: 'text', nullable: true })
    image_url: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    // Self-referencing relations
    @ManyToOne(() => Category, (category) => category.children, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn({ name: 'parent_id' })
    parent: Category;

    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];
}
