import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Customer } from '../../customers/entities/customer.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed' // ✅ THÊM COMPLETED
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orderNumber: string;

  @Column()
  customerId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

  @Column({ type: 'text' })
  shippingAddress: string;

  @Column({ type: 'text' })
  billingAddress: string;

  @Column()
  paymentMethod: string;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  customerNotes: string; // ✅ THÊM FIELD NÀY

  @Column({ type: 'text', nullable: true })
  cancellationReason: string; // ✅ THÊM FIELD NÀY

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date; // ✅ THÊM FIELD NÀY

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date; // ✅ THÊM FIELD NÀY

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Customer, customer => customer.orders)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items: OrderItem[];
}