import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { OrderEventsController } from './infrastructure/http/order-events.controller';
import { SseService } from './infrastructure/http/sse.service';
import { KafkaConfigService } from './config/kafka.config';
import { KafkaOrderEventsAdapter } from './infrastructure/kafka/kafka-order-events.adapter';
import { OrderEventsPort } from './domain/order-events.port';
import { OrderStatus, OrderEventType } from './domain/order.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    KafkaModule,
  ],
  controllers: [OrderEventsController],
  providers: [
    SseService,
    KafkaConfigService,
    {
      provide: OrderEventsPort,
      useClass: KafkaOrderEventsAdapter,
    },
  ],
  exports: [OrderEventsPort, SseService],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor() {
    this.logger.log('AppModule inicializado');
    this.logger.debug(`OrderStatus disponible: ${Object.values(OrderStatus).join(', ')}`);
    this.logger.debug(`OrderEventType disponible: ${Object.values(OrderEventType).join(', ')}`);
  }
}