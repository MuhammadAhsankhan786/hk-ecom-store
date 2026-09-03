export interface PaymentInitiationInput {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  transactionRef: string;
  returnUrl: string;
  cancelUrl: string;
  webhookUrl: string;
}

export interface PaymentInitiationResult {
  provider: string;
  mode: 'SANDBOX' | 'LIVE';
  transactionRef: string;
  postUrl: string;
  httpMethod: 'POST' | 'GET';
  params: Record<string, any>;
  checkoutUrl?: string;
  message: string;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  orderId?: string;
  transactionRef?: string;
  status: 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'PENDING';
  amount?: number;
  currency?: string;
  rawResponse: Record<string, any>;
  errorMessage?: string;
}

export interface TransactionQueryResult {
  found: boolean;
  orderId?: string;
  transactionRef: string;
  status: 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'PENDING';
  amount?: number;
  currency?: string;
  gatewayResponse?: any;
}

export interface RefundInput {
  orderId: string;
  transactionRef: string;
  amount: number;
  reason?: string;
}

export interface RefundResult {
  success: boolean;
  refundTransactionRef?: string;
  message: string;
  rawResponse?: any;
}

export interface ProviderStatusInfo {
  provider: string;
  mode: 'SANDBOX' | 'LIVE';
  credentialsReady: boolean;
  onboardingStatus: string;
  missingCredentials: string[];
}

export interface PaymentProvider {
  readonly name: string;
  getStatusInfo(): ProviderStatusInfo;
  initiatePayment(input: PaymentInitiationInput): Promise<PaymentInitiationResult>;
  verifyWebhook(body: any, headers?: Record<string, any>, query?: any): Promise<WebhookVerificationResult>;
  queryTransactionStatus(transactionRef: string, orderId: string): Promise<TransactionQueryResult>;
  processRefund(input: RefundInput): Promise<RefundResult>;
}
