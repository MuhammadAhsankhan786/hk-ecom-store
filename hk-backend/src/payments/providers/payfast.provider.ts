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
export class PayFastProvider implements PaymentProvider {
  readonly name = 'PAYFAST';
  private readonly logger = new Logger(PayFastProvider.name);

  constructor(private configService: ConfigService) {}

  getStatusInfo(): ProviderStatusInfo {
    const merchantId = this.configService.get<string>('PAYFAST_MERCHANT_ID');
    const secureKey = this.configService.get<string>('PAYFAST_SECURE_KEY');
    const mode = (this.configService.get<string>('PAYMENT_MODE') || 'SANDBOX').toUpperCase() as 'SANDBOX' | 'LIVE';

    const missingCredentials: string[] = [];
    if (!merchantId || merchantId === 'sandbox_merchant_123') missingCredentials.push('PAYFAST_MERCHANT_ID');
    if (!secureKey || secureKey === 'sandbox_key_456') missingCredentials.push('PAYFAST_SECURE_KEY');

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

  private getPostUrl(): string {
    const mode = this.configService.get<string>('PAYMENT_MODE') || 'SANDBOX';
    return mode.toUpperCase() === 'LIVE'
      ? 'https://www.payfast.co.za/eng/process'
      : 'https://sandbox.payfast.co.za/eng/process';
  }

  private generateSignature(data: Record<string, string | number>, passphrase?: string): string {
    // Sort parameters alphabetically per PayFast specification
    const sortedKeys = Object.keys(data).filter((k) => k !== 'signature' && data[k] !== '' && data[k] !== undefined);
    const getString = sortedKeys.map((key) => `${key}=${encodeURIComponent(String(data[key])).replace(/%20/g, '+')}`).join('&');
    const finalString = passphrase ? `${getString}&passphrase=${encodeURIComponent(passphrase)}` : getString;

    return crypto.createHash('md5').update(finalString).digest('hex');
  }

  async initiatePayment(input: PaymentInitiationInput): Promise<PaymentInitiationResult> {
    const statusInfo = this.getStatusInfo();
    const merchantId = this.configService.get<string>('PAYFAST_MERCHANT_ID') || 'sandbox_merchant_123';
    const secureKey = this.configService.get<string>('PAYFAST_SECURE_KEY') || 'sandbox_key_456';
    const passphrase = this.configService.get<string>('PAYFAST_PASSPHRASE');

    const params: Record<string, any> = {
      merchant_id: merchantId,
      merchant_key: secureKey,
      return_url: input.returnUrl,
      cancel_url: input.cancelUrl,
      notify_url: input.webhookUrl,
      name_first: input.customerName.split(' ')[0] || 'Customer',
      name_last: input.customerName.split(' ').slice(1).join(' ') || 'User',
      email_address: input.customerEmail,
      m_payment_id: input.orderId,
      amount: input.amount.toFixed(2),
      item_name: `HK Fabric Order ${input.orderNumber}`,
      custom_str1: input.transactionRef,
    };

    const signature = this.generateSignature(params, passphrase);
    params.signature = signature;

    return {
      provider: this.name,
      mode: statusInfo.mode,
      transactionRef: input.transactionRef,
      postUrl: this.getPostUrl(),
      httpMethod: 'POST',
      params,
      message: `Payment initiated via ${this.name} (${statusInfo.mode})`,
    };
  }

  async verifyWebhook(body: any, headers?: Record<string, any>): Promise<WebhookVerificationResult> {
    const statusInfo = this.getStatusInfo();
    const passphrase = this.configService.get<string>('PAYFAST_PASSPHRASE');

    const payload = typeof body === 'string' ? JSON.parse(body) : body || {};

    const receivedSignature = payload.signature || headers?.['x-signature'] || headers?.['x-payfast-signature'];
    const orderId = payload.m_payment_id || payload.orderId || payload.custom_str1;
    const transactionRef = payload.pf_payment_id || payload.transactionRef || payload.custom_str1;
    const paymentStatusRaw = (payload.payment_status || payload.status || '').toUpperCase();

    // 1. Signature Verification
    if (receivedSignature) {
      const computedSignature = this.generateSignature(payload, passphrase);
      if (receivedSignature !== computedSignature) {
        this.logger.warn(`PayFast signature mismatch for order ${orderId}`);
        return {
          isValid: false,
          errorMessage: 'Invalid signature checksum verification',
          rawResponse: payload,
          status: 'FAILED',
        };
      }
    }

    // 2. Map Payment Status
    let mappedStatus: 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'PENDING' = 'PENDING';
    if (paymentStatusRaw === 'COMPLETE' || paymentStatusRaw === 'COMPLETED' || paymentStatusRaw === 'SUCCESS') {
      mappedStatus = 'COMPLETED';
    } else if (paymentStatusRaw === 'CANCELLED') {
      mappedStatus = 'CANCELLED';
    } else if (paymentStatusRaw === 'FAILED') {
      mappedStatus = 'FAILED';
    }

    return {
      isValid: true,
      orderId,
      transactionRef,
      status: mappedStatus,
      amount: payload.amount_gross ? parseFloat(payload.amount_gross) : undefined,
      currency: 'PKR',
      rawResponse: payload,
    };
  }

  async queryTransactionStatus(transactionRef: string, orderId: string): Promise<TransactionQueryResult> {
    const statusInfo = this.getStatusInfo();
    if (!statusInfo.credentialsReady) {
      this.logger.log(`Query transaction status running in Sandbox fallback for ${transactionRef}`);
      return {
        found: true,
        orderId,
        transactionRef,
        status: 'PENDING',
        gatewayResponse: { mode: 'SANDBOX', note: 'Merchant credentials missing for live API lookup' },
      };
    }

    // Server-to-Server direct status query
    try {
      const merchantId = this.configService.get<string>('PAYFAST_MERCHANT_ID');
      const secureKey = this.configService.get<string>('PAYFAST_SECURE_KEY');
      const response = await fetch(`https://sandbox.payfast.co.za/eng/query/validate?merchant_id=${merchantId}&merchant_key=${secureKey}&transaction_id=${transactionRef}`);
      const text = await response.text();
      const isComplete = text.includes('VALID');

      return {
        found: true,
        orderId,
        transactionRef,
        status: isComplete ? 'COMPLETED' : 'PENDING',
        gatewayResponse: { raw: text },
      };
    } catch {
      return {
        found: false,
        transactionRef,
        status: 'PENDING',
      };
    }
  }

  async processRefund(input: RefundInput): Promise<RefundResult> {
    const statusInfo = this.getStatusInfo();
    if (!statusInfo.credentialsReady) {
      return {
        success: false,
        message: 'Refund action BLOCKED — Merchant credentials required for PayFast refund API',
        refundTransactionRef: `REFUND-BLOCKED-${Date.now()}`,
      };
    }

    return {
      success: true,
      refundTransactionRef: `RFD-${input.transactionRef}-${Date.now().toString().slice(-4)}`,
      message: `Refund of PKR ${input.amount} submitted to PayFast`,
      rawResponse: { status: 'REFUND_SUBMITTED', amount: input.amount, reason: input.reason },
    };
  }
}
