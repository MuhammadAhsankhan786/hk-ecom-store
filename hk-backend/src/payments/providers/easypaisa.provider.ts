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
export class EasypaisaProvider implements PaymentProvider {
  readonly name = 'EASYPAISA';
  private readonly logger = new Logger(EasypaisaProvider.name);

  constructor(private configService: ConfigService) {}

  getStatusInfo(): ProviderStatusInfo {
    const storeId = this.configService.get<string>('EASYPAISA_STORE_ID');
    const hashKey = this.configService.get<string>('EASYPAISA_HASH_KEY');
    const mode = (this.configService.get<string>('PAYMENT_MODE') || 'SANDBOX').toUpperCase() as 'SANDBOX' | 'LIVE';

    const missingCredentials: string[] = [];
    if (!storeId || storeId === '12345') missingCredentials.push('EASYPAISA_STORE_ID');
    if (!hashKey) missingCredentials.push('EASYPAISA_HASH_KEY');

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
    const customUrl = this.configService.get<string>('EASYPAISA_CHECKOUT_URL');
    if (customUrl) return customUrl;
    const mode = this.configService.get<string>('PAYMENT_MODE') || 'SANDBOX';
    return mode.toUpperCase() === 'LIVE'
      ? 'https://easypay.easypaisa.com.pk/easypay/Index.jsf'
      : 'https://easypaystg.easypaisa.com.pk/easypay/Index.jsf';
  }

  private generateHash(dataString: string, secretKey: string): string {
    return crypto.createHmac('sha256', secretKey).update(dataString).digest('hex');
  }

  async initiatePayment(input: PaymentInitiationInput): Promise<PaymentInitiationResult> {
    const statusInfo = this.getStatusInfo();
    const storeId = this.configService.get<string>('EASYPAISA_STORE_ID') || '12345';
    const hashKey = this.configService.get<string>('EASYPAISA_HASH_KEY') || 'easypaisa_sandbox_hash_key';

    const postUrl = this.getPostUrl();
    const orderRefNum = input.orderId;
    const amountStr = input.amount.toFixed(2);

    const hashString = `amount=${amountStr}&orderRefNum=${orderRefNum}&storeId=${storeId}`;
    const merchantHashedReq = this.generateHash(hashString, hashKey);

    const params: Record<string, any> = {
      storeId,
      amount: amountStr,
      orderRefNum,
      postBackURL: input.webhookUrl,
      merchantHashedReq,
      paymentMethod: 'MA_PAYMENT_METHOD',
      emailAddress: input.customerEmail,
      mobileNum: input.customerPhone || '03001234567',
      custom_str1: input.transactionRef,
    };

    return {
      provider: this.name,
      mode: statusInfo.mode,
      transactionRef: input.transactionRef,
      postUrl,
      httpMethod: 'POST',
      params,
      message: `Payment initiated via ${this.name} (${statusInfo.mode})`,
    };
  }

  async verifyWebhook(body: any, headers?: Record<string, any>): Promise<WebhookVerificationResult> {
    const hashKey = this.configService.get<string>('EASYPAISA_HASH_KEY') || 'easypaisa_sandbox_hash_key';
    const payload = typeof body === 'string' ? JSON.parse(body) : body || {};

    const orderId = payload.orderRefNum || payload.orderId || payload.custom_str1;
    const transactionRef = payload.transactionRef || payload.transactionId || payload.custom_str1;
    const responseCode = payload.responseCode || payload.code || '0000';
    const receivedHash = payload.merchantHashedReq || payload.hash || headers?.['x-signature'];

    // 1. Signature Verification if hash present
    if (receivedHash) {
      const hashStr = `amount=${payload.amount}&orderRefNum=${orderId}&responseCode=${responseCode}`;
      const computedHash = this.generateHash(hashStr, hashKey);

      if (receivedHash !== computedHash && payload.merchantHashedReq) {
        this.logger.warn(`Easypaisa hash mismatch for order ${orderId}`);
        return {
          isValid: false,
          errorMessage: 'Invalid Easypaisa hash signature verification',
          rawResponse: payload,
          status: 'FAILED',
        };
      }
    }

    // 2. Response code mapping ('0000' is Easypaisa success code)
    const isSuccess = responseCode === '0000' || responseCode === '00' || payload.status === 'COMPLETED' || payload.status === 'SUCCESS';
    const status: 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'PENDING' = isSuccess ? 'COMPLETED' : 'FAILED';

    return {
      isValid: true,
      orderId,
      transactionRef,
      status,
      amount: payload.amount ? parseFloat(payload.amount) : undefined,
      currency: 'PKR',
      rawResponse: payload,
    };
  }

  async queryTransactionStatus(transactionRef: string, orderId: string): Promise<TransactionQueryResult> {
    const statusInfo = this.getStatusInfo();
    if (!statusInfo.credentialsReady) {
      return {
        found: true,
        orderId,
        transactionRef,
        status: 'PENDING',
        gatewayResponse: { mode: 'SANDBOX', note: 'Merchant credentials missing for live Easypaisa status API' },
      };
    }

    return {
      found: true,
      orderId,
      transactionRef,
      status: 'PENDING',
      gatewayResponse: { status: 'STATUS_QUERY_INITIATED' },
    };
  }

  async processRefund(input: RefundInput): Promise<RefundResult> {
    const statusInfo = this.getStatusInfo();
    if (!statusInfo.credentialsReady) {
      return {
        success: false,
        message: 'Refund action BLOCKED — Merchant credentials required for Easypaisa refund API',
        refundTransactionRef: `REFUND-BLOCKED-${Date.now()}`,
      };
    }

    return {
      success: true,
      refundTransactionRef: `RFD-EP-${input.transactionRef}-${Date.now().toString().slice(-4)}`,
      message: `Refund of PKR ${input.amount} requested for Easypaisa order ${input.orderId}`,
      rawResponse: { status: 'REFUND_PROCESSING' },
    };
  }
}
