import { Controller, Post, Body, Param, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { PaymentStatus } from '@prisma/client';

@ApiTags('Payment Processing')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate/:orderId')
  @ApiOperation({ summary: 'Initiate online payment session for PayFast / Easypaisa' })
  initiatePayment(
    @Param('orderId') orderId: string,
    @Body('gateway') gateway: string,
  ) {
    return this.paymentsService.initiatePayment(orderId, gateway || 'PayFast');
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Payment Gateway Webhook IPN Callback with HMAC Verification & Idempotency' })
  verifyWebhook(
    @Body('orderId') orderId: string,
    @Body('transactionRef') transactionRef: string,
    @Body('status') status: PaymentStatus,
    @Headers('x-signature') signature?: string,
  ) {
    return this.paymentsService.verifyWebhook(orderId, transactionRef, status || PaymentStatus.COMPLETED, signature);
  }
}
