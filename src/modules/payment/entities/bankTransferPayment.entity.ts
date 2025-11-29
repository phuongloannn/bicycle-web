import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('bank_transfers')
export class BankTransferPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'payment_id' })
  paymentId: number;

  @Column({ name: 'bank_name' })
  bankName: string;

  @Column({ name: 'account_number' })
  accountNumber: string;

  @Column({ name: 'account_name', nullable: true })
  accountName?: string;

  @Column({ name: 'transfer_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  transferAmount?: string;

  @Column({ name: 'transfer_date', type: 'timestamp', nullable: true })
  transferDate?: Date;

  @Column({ name: 'transfer_proof_url', nullable: true })
  transferProofUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}