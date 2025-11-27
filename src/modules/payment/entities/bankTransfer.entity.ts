import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bank_transfers')
export class BankTransferPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paymentId: number;

  @Column()
  bankName: string;

  @Column()
  accountNumber: string;

  @Column({ nullable: true })
  transferProofUrl?: string;
}