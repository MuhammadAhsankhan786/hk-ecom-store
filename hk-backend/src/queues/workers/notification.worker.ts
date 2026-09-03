import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import {
  QUEUE_NOTIFICATIONS,
  JOB_ORDER_CONFIRMATION,
  JOB_PAYMENT_CONFIRMATION,
  JOB_ORDER_STATUS_UPDATE,
} from '../queues.constants';
import { EmailService } from '../../email/email.service';

@Processor(QUEUE_NOTIFICATIONS)
@Injectable()
export class NotificationWorker extends WorkerHost {
  private readonly logger = new Logger(NotificationWorker.name);

  constructor(private emailService: EmailService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`[NotificationWorker] Processing job ID=${job.id} (Type: ${job.name}, Attempt: ${job.attemptsMade + 1})`);
    try {
      switch (job.name) {
        case JOB_ORDER_CONFIRMATION:
          return await this.emailService.sendOrderConfirmation(job.data);
        case JOB_PAYMENT_CONFIRMATION:
          return await this.emailService.sendPaymentConfirmation(job.data);
        case JOB_ORDER_STATUS_UPDATE:
          return await this.emailService.sendOrderStatusUpdate(job.data);
        default:
          this.logger.warn(`[NotificationWorker] Unknown job type: ${job.name}`);
          return { skipped: true };
      }
    } catch (err: any) {
      this.logger.error(`[NotificationWorker Error] Job ID=${job.id} failed: ${err.message}`);
      throw err;
    }
  }
}
