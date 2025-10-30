import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany  } from 'typeorm';
import { Order } from '../../orders/entities/order.entity'; // ✅ THÊM IMPORT

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone?: string;
  
  @Column({ length: 255, nullable: true })
  address?: string;

  // ✅ THÊM QUAN HỆ VỚI ORDER (ĐANG THIẾU)
  @OneToMany(() => Order, order => order.customer)
  orders: Order[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}