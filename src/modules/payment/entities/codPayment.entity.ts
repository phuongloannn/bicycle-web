import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('cod_payments')
export class CODPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paymentId: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  actualReceivedAmount?: number;
}