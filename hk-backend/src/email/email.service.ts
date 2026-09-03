import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { renderOrderConfirmationTemplate } from './templates/order-confirmation.template';
import { renderPaymentConfirmationTemplate } from './templates/payment-confirmation.template';
import { renderOrderStatusTemplate } from './templates/order-status.template';
import { renderLowStockAlertTemplate } from './templates/low-stock-alert.template';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private configService: ConfigService) {
    this.initTransporter();
  }

  private initTransporter() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT') || 587;
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log(`Nodemailer SMTP Transporter initialized (${host}:${port})`);
    } else {
      this.logger.warn(`SMTP credentials unconfigured. EmailService running in Development Preview mode.`);
    }
  }

  private getFromAddress(): string {
    return this.configService.get<string>('SMTP_FROM') || '"HK Fabric Orders" <orders@hkfabric.pk>';
  }

  async sendOrderConfirmation(data: {
    customerEmail: string;
    customerName: string;
    orderNumber: string;
    totalAmount: number;
    shippingAddress: string;
    city: string;
    items: any[];
  }) {
    const html = renderOrderConfirmationTemplate(data);
    return this.sendMail(data.customerEmail, `Order Confirmation — ${data.orderNumber}`, html);
  }

  async sendPaymentConfirmation(data: {
    customerEmail: string;
    customerName: string;
    orderNumber: string;
    transactionRef: string;
    provider: string;
    amount: number;
  }) {
    const html = renderPaymentConfirmationTemplate(data);
    return this.sendMail(data.customerEmail, `Payment Receipt — ${data.orderNumber}`, html);
  }

  async sendOrderStatusUpdate(data: {
    customerEmail: string;
    customerName: string;
    orderNumber: string;
    status: string;
    note?: string;
  }) {
    const html = renderOrderStatusTemplate(data);
    return this.sendMail(data.customerEmail, `Order Status Update (${data.status}) — ${data.orderNumber}`, html);
  }

  async sendLowStockAlert(data: {
    managerEmail?: string;
    productName: string;
    sku: string;
    currentStock: number;
    threshold: number;
  }) {
    const html = renderLowStockAlertTemplate(data);
    const targetEmail = data.managerEmail || this.configService.get<string>('MANAGER_EMAIL') || 'manager@hkfabric.pk';
    return this.sendMail(targetEmail, `⚠️ Low Stock Warning: ${data.productName} (Stock: ${data.currentStock})`, html);
  }

  private async sendMail(to: string, subject: string, html: string): Promise<{ success: boolean; messageId?: string }> {
    try {
      if (!this.transporter) {
        this.logger.log(`[Simulated Email Preview] To: ${to} | Subject: "${subject}"`);
        return { success: true, messageId: `SIMULATED-${Date.now()}` };
      }

      const info = await this.transporter.sendMail({
        from: this.getFromAddress(),
        to,
        subject,
        html,
      });

      this.logger.log(`Email dispatched successfully to ${to} (MessageID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
      throw err;
    }
  }
}
