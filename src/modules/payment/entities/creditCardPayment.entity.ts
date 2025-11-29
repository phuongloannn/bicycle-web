import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('credit_card_payments')
export class CreditCardPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paymentId: number;

  @Column({ nullable: true })
  transactionId?: string;
}