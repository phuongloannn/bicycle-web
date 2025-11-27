import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('bike_accessories')
export class Accessory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  category: string;

  @Column('text', { nullable: true })
  compatible_with: string;

  @Column('tinyint', { default: 1 }) // 🔥 SỬA THÀNH 'tinyint'
  in_stock: number;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  image_filename: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}