import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Customer } from '../../customers/entities/customer.entity';

export enum OrderStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Shipped = 'Shipped',
  Canceled = 'Canceled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // DB: orderNumber
  @Column({ name: 'orderNumber', unique: true })
  orderNumber: string;

  // DB: customer_id
  @Column({ name: 'customer_id' })
  customerId: number;

  // DB: totalAmount
  @Column({
    name: 'totalAmount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalAmount: string;

  // DB: status
  @Column({
    name: 'status',
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: OrderStatus;

  @Column({ name: 'shipping_address', type: 'text', nullable: true })
  shippingAddress: string;

  @Column({ name: 'billing_address', type: 'text', nullable: true })
  billingAddress: string;

  @Column({ name: 'payment_method', nullable: true })
  paymentMethod: string;

  @Column({ name: 'is_paid', default: false })
  isPaid: boolean;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ name: 'phone', nullable: true })
  phone: string;

  @Column({ name: 'email', nullable: true })
  email: string;

  @Column({ name: 'customer_notes', type: 'text', nullable: true })
  customerNotes: string;

  @Column({ name: 'cancellation_reason', type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  cancelledAt: Date;

  // DB: order_date
  @Column({
    name: 'order_date',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  orderDate: Date;

  // DB: created_by
  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  // DB: created_at
  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  // DB: updated_at
  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];
}
