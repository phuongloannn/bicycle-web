import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('product_specifications')
export class ProductSpecification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'frame_size' })
  frameSize: string;

  @Column({ name: 'wheel_size' })
  wheelSize: string;

  @Column({ name: 'gear_system' })
  gearSystem: string;

  @Column({ name: 'brake_type' })
  brakeType: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number;

  @Column()
  material: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}