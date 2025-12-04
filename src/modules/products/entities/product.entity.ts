import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @Column()
  category: string; // Giữ lại để backward compatibility

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  categoryRelation: Category | null;

  @Column({ name: 'image_url' })  // ✅ Đúng: database có image_url
  imageUrl: string;

  @CreateDateColumn({ name: 'createdAt' })  // ✅ Đúng: database có createdAt
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })  // ✅ Đúng: database có updatedAt
  updatedAt: Date;
  orderItems: any;
}