import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { BankTransferPayment } from './entities/bankTransferPayment.entity';
import { CreditCardPayment } from './entities/creditCardPayment.entity';
import { CODPayment } from './entities/codPayment.entity';

import { BankTransferController } from './controllers/bankTransfer.controller';
import { CreditCardController } from './controllers/creditCard.controller';
import { CodPaymentController } from './controllers/codPayment.controller';

import { BankTransferService } from './services/bankTransfer.service';
import { CreditCardPaymentService } from './services/creditCard.service';
import { CodPaymentService } from './services/codPayment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      BankTransferPayment,
      CreditCardPayment,
      CODPayment,
    ]),
  ],
  controllers: [
    BankTransferController,
    CreditCardController,
    CodPaymentController,
  ],
  providers: [
    BankTransferService,
    CreditCardPaymentService,
    CodPaymentService,
  ],
})
export class PaymentModule {}
