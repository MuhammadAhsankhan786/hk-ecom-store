import { Module, DynamicModule } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QUEUE_NOTIFICATIONS, QUEUE_INVENTORY_ALERTS } from './queues.constants';
import { QueuesService } from './queues.service';
import { NotificationWorker } from './workers/notification.worker';
import { InventoryAlertWorker } from './workers/inventory-alert.worker';
import { EmailModule } from '../email/email.module';

const isVercel = !!process.env.VERCEL;
const hasRedis = !!process.env.REDIS_HOST;

const createMockQueueProvider = (name: string) => ({
  provide: `BullQueue_${name}`,
  useValue: {
    add: async () => ({ id: `mock-job-${Date.now()}` }),
    on: () => {},
    close: async () => {},
  },
});

@Module({
  imports: [
    ConfigModule,
    EmailModule,
    ...(hasRedis
      ? [
          BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              connection: {
                host: configService.get<string>('REDIS_HOST') || 'localhost',
                port: configService.get<number>('REDIS_PORT') || 6379,
                password: configService.get<string>('REDIS_PASSWORD') || undefined,
                enableOfflineQueue: false,
                maxRetriesPerRequest: null,
                lazyConnect: true,
                retryStrategy: () => null,
              },
            }),
            inject: [ConfigService],
          }),
          BullModule.registerQueue(
            { name: QUEUE_NOTIFICATIONS },
            { name: QUEUE_INVENTORY_ALERTS },
          ),
        ]
      : []),
  ],
  providers: [
    QueuesService,
    ...(hasRedis ? [NotificationWorker, InventoryAlertWorker] : [
      createMockQueueProvider(QUEUE_NOTIFICATIONS),
      createMockQueueProvider(QUEUE_INVENTORY_ALERTS),
    ]),
  ],
  exports: [QueuesService],
})
export class QueuesModule {}
