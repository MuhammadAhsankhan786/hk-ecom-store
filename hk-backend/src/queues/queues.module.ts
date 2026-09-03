import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QUEUE_NOTIFICATIONS, QUEUE_INVENTORY_ALERTS } from './queues.constants';
import { QueuesService } from './queues.service';
import { NotificationWorker } from './workers/notification.worker';
import { InventoryAlertWorker } from './workers/inventory-alert.worker';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    ConfigModule,
    EmailModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isVercel = !!process.env.VERCEL || process.env.NODE_ENV === 'production';
        const redisHost = configService.get<string>('REDIS_HOST');
        const host = redisHost || (isVercel ? '127.0.0.1' : 'localhost');
        return {
          connection: {
            host,
            port: configService.get<number>('REDIS_PORT') || 6379,
            password: configService.get<string>('REDIS_PASSWORD') || undefined,
            enableOfflineQueue: false,
            maxRetriesPerRequest: null,
            lazyConnect: true,
            retryStrategy: (times: number) => {
              if (times > 1 || (isVercel && !redisHost)) return null;
              return Math.min(times * 300, 1000);
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: QUEUE_NOTIFICATIONS },
      { name: QUEUE_INVENTORY_ALERTS },
    ),
  ],
  providers: [QueuesService, NotificationWorker, InventoryAlertWorker],
  exports: [QueuesService, BullModule],
})
export class QueuesModule {}
