import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { QUEUE_INVENTORY_ALERTS, JOB_LOW_STOCK_ALERT } from '../queues.constants';
import { EmailService } from '../../email/email.service';

@Processor(QUEUE_INVENTORY_ALERTS)
@Injectable()
export class InventoryAlertWorker extends WorkerHost {
  private readonly logger = new Logger(InventoryAlertWorker.name);

  constructor(private emailService: EmailService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`[InventoryAlertWorker] Processing job ID=${job.id} (Type: ${job.name})`);
    try {
      if (job.name === JOB_LOW_STOCK_ALERT) {
        return await this.emailService.sendLowStockAlert(job.data);
      }
      this.logger.warn(`[InventoryAlertWorker] Unknown job type: ${job.name}`);
      return { skipped: true };
    } catch (err: any) {
      this.logger.error(`[InventoryAlertWorker Error] Job ID=${job.id} failed: ${err.message}`);
      throw err;
    }
  }
}
