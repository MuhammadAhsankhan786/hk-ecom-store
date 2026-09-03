import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  QUEUE_NOTIFICATIONS,
  QUEUE_INVENTORY_ALERTS,
  JOB_ORDER_CONFIRMATION,
  JOB_PAYMENT_CONFIRMATION,
  JOB_ORDER_STATUS_UPDATE,
  JOB_LOW_STOCK_ALERT,
} from './queues.constants';

@Injectable()
export class QueuesService {
  private readonly logger = new Logger(QueuesService.name);

  constructor(
    @InjectQueue(QUEUE_NOTIFICATIONS) private notificationQueue: Queue,
    @InjectQueue(QUEUE_INVENTORY_ALERTS) private inventoryAlertQueue: Queue,
  ) {}

  async enqueueOrderConfirmation(data: {
    orderId: string;
    orderNumber: string;
    customerEmail: string;
    customerName: string;
    totalAmount: number;
    shippingAddress: string;
    city: string;
    items: any[];
  }) {
    const jobId = `order-confirmation-${data.orderId}`;
    return this.addJobSafely(
      this.notificationQueue,
      JOB_ORDER_CONFIRMATION,
      data,
      jobId,
    );
  }

  async enqueuePaymentConfirmation(data: {
    orderId: string;
    orderNumber: string;
    transactionRef: string;
    provider: string;
    customerEmail: string;
    customerName: string;
    amount: number;
  }) {
    const jobId = `payment-confirmation-${data.orderId}-${data.transactionRef}`;
    return this.addJobSafely(
      this.notificationQueue,
      JOB_PAYMENT_CONFIRMATION,
      data,
      jobId,
    );
  }

  async enqueueOrderStatusUpdate(data: {
    orderId: string;
    orderNumber: string;
    customerEmail: string;
    customerName: string;
    status: string;
    note?: string;
  }) {
    const jobId = `order-status-${data.orderId}-${data.status}`;
    return this.addJobSafely(
      this.notificationQueue,
      JOB_ORDER_STATUS_UPDATE,
      data,
      jobId,
    );
  }

  async enqueueLowStockAlert(data: {
    productId: string;
    productName: string;
    sku: string;
    currentStock: number;
    threshold: number;
    managerEmail?: string;
  }) {
    const jobId = `low-stock-${data.productId}-${data.currentStock}`;
    return this.addJobSafely(
      this.inventoryAlertQueue,
      JOB_LOW_STOCK_ALERT,
      data,
      jobId,
    );
  }

  private async addJobSafely(
    queue: Queue,
    jobName: string,
    data: any,
    jobId: string,
  ) {
    try {
      const job = await queue.add(jobName, data, {
        jobId,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: 100,
        removeOnFail: 500,
      });

      this.logger.log(
        `[QueuesService] Enqueued job "${jobName}" (JobID: ${jobId})`,
      );
      return { success: true, jobId: job.id };
    } catch (err: any) {
      this.logger.warn(
        `[QueuesService Warning] Redis queue unconfigured or unavailable. Job "${jobName}" bypassed gracefully: ${err.message}`,
      );
      return { success: false, warning: 'Redis queue connection unavailable' };
    }
  }
}
