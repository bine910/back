import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('banners')
export class Banner {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    image_url: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    link_url: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    display_position: string;

    @Column({ type: 'int', default: 0 })
    sort_order: number;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;
}
