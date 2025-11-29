import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'orderId' })
  orderId: number;

  // Đổi tên thành productId để khớp database, nhưng dùng cho cả product và accessory
  @Column({ name: 'productId' })
  itemId: number;

  @Column({ type: 'enum', enum: ['product', 'accessory'], default: 'product' })
  type: 'product' | 'accessory';

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalPrice: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'orderId' })
  order: Order;
}