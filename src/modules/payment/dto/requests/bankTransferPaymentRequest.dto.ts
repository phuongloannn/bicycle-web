export class BankTransferPaymentRequestDto {
  bankName: string;
  accountNumber: string;
  transferAmount: number;
  transferProofUrl?: string;
}
