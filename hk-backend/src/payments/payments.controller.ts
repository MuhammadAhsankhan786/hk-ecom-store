import { Controller, Post, Get, Body, Param, Headers, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('Payment Processing Engine')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('provider-status')
  @ApiOperation({ summary: 'Get active payment provider status, mode, and credential readiness' })
  getProviderStatus() {
    return this.paymentsService.getProviderStatus();
  }

  @Post('initiate/:orderId')
  @ApiOperation({ summary: 'Initiate online payment session for an order' })
  initiatePayment(
    @Param('orderId') orderId: string,
    @Body('gateway') gateway?: string,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    return this.paymentsService.initiatePayment(orderId, gateway, idempotencyKey);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Payment Gateway Webhook / IPN Callback with cryptographic signature verification' })
  verifyWebhook(
    @Body() body: any,
    @Headers() headers: Record<string, any>,
    @Query() query: any,
    @Query('gateway') gateway?: string,
  ) {
    return this.paymentsService.verifyWebhook(body, headers, query, gateway);
  }

  @Post('callback')
  @ApiOperation({ summary: 'Payment Gateway POST Callback handling' })
  verifyCallbackPost(
    @Body() body: any,
    @Headers() headers: Record<string, any>,
    @Query() query: any,
    @Query('gateway') gateway?: string,
  ) {
    return this.paymentsService.verifyWebhook(body, headers, query, gateway);
  }

  @Get('callback')
  @ApiOperation({ summary: 'Payment Gateway GET Callback handling' })
  verifyCallbackGet(
    @Query() query: any,
    @Headers() headers: Record<string, any>,
    @Query('gateway') gateway?: string,
  ) {
    return this.paymentsService.verifyWebhook(query, headers, query, gateway);
  }

  @Get('verify/:orderId')
  @ApiOperation({ summary: 'Server-side transaction & order payment status verification' })
  verifyOrderPayment(@Param('orderId') orderId: string) {
    return this.paymentsService.verifyOrderPayment(orderId);
  }

  @Post('retry/:orderId')
  @ApiOperation({ summary: 'Retry payment for an existing unpaid/failed order' })
  retryPayment(
    @Param('orderId') orderId: string,
    @Body('gateway') gateway?: string,
  ) {
    return this.paymentsService.retryPayment(orderId, gateway);
  }

  @Post('refund/:orderId')
  @ApiOperation({ summary: 'Process refund for a completed payment' })
  refundOrder(
    @Param('orderId') orderId: string,
    @Body('amount') amount?: number,
    @Body('reason') reason?: string,
    @Body('restoreInventory') restoreInventory?: boolean,
  ) {
    return this.paymentsService.refundOrder(orderId, amount, reason, restoreInventory ?? false);
  }
}
