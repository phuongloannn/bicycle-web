import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('product_specifications')
export class ProductSpecification {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  product_id: number;

  @Column({ name: 'frame_size' })
  frame_size: string;

  @Column({ name: 'wheel_size' })
  wheel_size: string;

  @Column({ name: 'gear_system' })
  gear_system: string;

  @Column({ name: 'brake_type' })
  brake_type: string;

  @Column({ name: 'weight' })
  weight: string;

  @Column({ name: 'material' })
  material: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
