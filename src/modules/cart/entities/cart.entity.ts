import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true }) // ✅ Sửa: rõ ràng type
  userId: number;

  @Column({ type: 'varchar', length: 255, nullable: true }) // ✅ Sửa: rõ ràng type
  sessionId: string;

  @Column({ type: 'int' })
  productId: number;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Product, { eager: true }) // ✅ THÊM eager loading
  @JoinColumn({ name: 'productId' })
  product: Product;
}