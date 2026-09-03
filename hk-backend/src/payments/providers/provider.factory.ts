import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentProvider, ProviderStatusInfo } from './payment-provider.interface';
import { PayFastProvider } from './payfast.provider';
import { EasypaisaProvider } from './easypaisa.provider';
import { GenericGatewayProvider } from './generic-gateway.provider';

@Injectable()
export class PaymentProviderFactory {
  private readonly logger = new Logger(PaymentProviderFactory.name);

  constructor(
    private configService: ConfigService,
    private payfastProvider: PayFastProvider,
    private easypaisaProvider: EasypaisaProvider,
    private genericGatewayProvider: GenericGatewayProvider,
  ) {}

  getProvider(providerName?: string): PaymentProvider {
    const activeName = (
      providerName ||
      this.configService.get<string>('PAYMENT_PROVIDER') ||
      'PAYFAST'
    ).toUpperCase();

    switch (activeName) {
      case 'EASYPAISA':
        return this.easypaisaProvider;
      case 'GENERIC_GATEWAY':
      case 'GENERIC':
        return this.genericGatewayProvider;
      case 'PAYFAST':
      default:
        return this.payfastProvider;
    }
  }

  getActiveProviderStatus(): ProviderStatusInfo {
    const activeProvider = this.getProvider();
    return activeProvider.getStatusInfo();
  }
}
