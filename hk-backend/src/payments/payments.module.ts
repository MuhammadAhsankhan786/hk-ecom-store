import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PayFastProvider } from './providers/payfast.provider';
import { EasypaisaProvider } from './providers/easypaisa.provider';
import { GenericGatewayProvider } from './providers/generic-gateway.provider';
import { PaymentProviderFactory } from './providers/provider.factory';
import { QueuesModule } from '../queues/queues.module';

@Module({
  imports: [QueuesModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PayFastProvider,
    EasypaisaProvider,
    GenericGatewayProvider,
    PaymentProviderFactory,
  ],
  exports: [PaymentsService, PaymentProviderFactory],
})
export class PaymentsModule {}
