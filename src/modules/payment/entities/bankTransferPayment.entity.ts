import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bank_transfer_payments')
export class BankTransferPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'payment_id' })
  paymentId: number;

  @Column({ name: 'bank_name', nullable: true })
  bankName: string;

  @Column({ name: 'account_number', nullable: true })
  accountNumber: string;

  @Column({ name: 'transfer_proof_url', nullable: true })
  transferProofUrl: string;
}
