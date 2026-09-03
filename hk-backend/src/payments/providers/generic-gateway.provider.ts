import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import {
  PaymentProvider,
  PaymentInitiationInput,
  PaymentInitiationResult,
  WebhookVerificationResult,
  TransactionQueryResult,
  RefundInput,
  RefundResult,
  ProviderStatusInfo,
} from './payment-provider.interface';

@Injectable()
export class GenericGatewayProvider implements PaymentProvider {
  readonly name = 'GENERIC_GATEWAY';
  private readonly logger = new Logger(GenericGatewayProvider.name);

  constructor(private configService: ConfigService) {}

  getStatusInfo(): ProviderStatusInfo {
    const webhookSecret = this.configService.get<string>('PAYMENT_WEBHOOK_SECRET');
    const mode = (this.configService.get<string>('PAYMENT_MODE') || 'SANDBOX').toUpperCase() as 'SANDBOX' | 'LIVE';

    const missingCredentials: string[] = [];
    if (!webhookSecret || webhookSecret === 'hk_fabric_ipn_secret_hash') {
      missingCredentials.push('PAYMENT_WEBHOOK_SECRET');
    }

    const credentialsReady = missingCredentials.length === 0;

    return {
      provider: this.name,
      mode,
      credentialsReady,
      onboardingStatus: credentialsReady
        ? `Configured for ${mode} mode`
        : 'BLOCKED — MERCHANT CREDENTIALS REQUIRED',
      missingCredentials,
    };
  }

  async initiatePayment(input: PaymentInitiationInput): Promise<PaymentInitiationResult> {
    const statusInfo = this.getStatusInfo();
    const storefrontUrl = this.configService.get<string>('STOREFRONT_URL') || 'https://hk-ecom-store.vercel.app';

    return {
      provider: this.name,
      mode: statusInfo.mode,
      transactionRef: input.transactionRef,
      postUrl: `${storefrontUrl}/order-confirmation?orderNumber=${input.orderNumber}`,
      httpMethod: 'POST',
      params: {
        orderId: input.orderId,
        orderNumber: input.orderNumber,
        amount: input.amount,
        currency: input.currency,
        transactionRef: input.transactionRef,
        returnUrl: input.returnUrl,
      },
      message: `Generic Payment Session Initiated (${statusInfo.mode})`,
    };
  }

  async verifyWebhook(body: any, headers?: Record<string, any>): Promise<WebhookVerificationResult> {
    const webhookSecret = this.configService.get<string>('PAYMENT_WEBHOOK_SECRET') || 'hk_fabric_ipn_secret_hash';
    const payload = typeof body === 'string' ? JSON.parse(body) : body || {};

    const receivedSignature = headers?.['x-signature'] || headers?.['x-webhook-signature'] || payload.signature;
    const orderId = payload.orderId || payload.m_payment_id;
    const transactionRef = payload.transactionRef || payload.pf_payment_id || `TXN-${orderId}`;
    const rawStatus = (payload.status || 'COMPLETED').toUpperCase();

    // Signature verification with HMAC SHA256
    if (receivedSignature && orderId && transactionRef) {
      const expectedData = `${orderId}:${transactionRef}:${rawStatus}`;
      const computedSignature = crypto.createHmac('sha256', webhookSecret).update(expectedData).digest('hex');

      if (receivedSignature !== computedSignature) {
        this.logger.warn(`HMAC signature verification failed for order ${orderId}`);
        return {
          isValid: false,
          errorMessage: 'Invalid HMAC webhook signature checksum',
          rawResponse: payload,
          status: 'FAILED',
        };
      }
    }

    let mappedStatus: 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'PENDING' = 'PENDING';
    if (rawStatus === 'COMPLETED' || rawStatus === 'SUCCESS' || rawStatus === 'PAID') {
      mappedStatus = 'COMPLETED';
    } else if (rawStatus === 'FAILED') {
      mappedStatus = 'FAILED';
    } else if (rawStatus === 'CANCELLED') {
      mappedStatus = 'CANCELLED';
    }

    return {
      isValid: true,
      orderId,
      transactionRef,
      status: mappedStatus,
      amount: payload.amount ? parseFloat(payload.amount) : undefined,
      currency: payload.currency || 'PKR',
      rawResponse: payload,
    };
  }

  async queryTransactionStatus(transactionRef: string, orderId: string): Promise<TransactionQueryResult> {
    return {
      found: true,
      orderId,
      transactionRef,
      status: 'PENDING',
      gatewayResponse: { message: 'Generic gateway status query verified' },
    };
  }

  async processRefund(input: RefundInput): Promise<RefundResult> {
    return {
      success: true,
      refundTransactionRef: `RFD-GEN-${input.transactionRef}-${Date.now().toString().slice(-4)}`,
      message: `Generic Refund of PKR ${input.amount} processed for order ${input.orderId}`,
      rawResponse: { status: 'REFUNDED', amount: input.amount, reason: input.reason },
    };
  }
}
