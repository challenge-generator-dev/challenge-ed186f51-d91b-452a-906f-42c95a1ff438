import { Injectable, OnModuleInit, OnModuleDestroy, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { Observable, Subject, catchError, finalize, takeUntil } from 'rxjs';
import { OrderEventsPort } from '../../domain/order-events.port';
import { OrderEvent } from '../../domain/order-events.port';

@Injectable()
export class KafkaOrderEventsAdapter implements OrderEventsPort, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaOrderEventsAdapter.name);
  private readonly eventsSubject = new Subject<OrderEvent>();
  private readonly destroy$ = new Subject<void>();
  private consumer: Consumer;
  private isConsuming = false;

  constructor(
    @Inject('KAFKA_CONSUMER') private readonly kafkaConsumer: Consumer,
    @Inject('KAFKA_TOPIC_NAME') private readonly topicName: string,
    private readonly configService: ConfigService,
  ) {
    this.consumer = this.kafkaConsumer;
  }

  async onModuleInit(): Promise<void> {
    this.logger.log(`Inicializando adaptador de eventos de órdenes para topic: ${this.topicName}`);
    await this.startConsuming();
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Deteniendo adaptador de eventos de órdenes');
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.isConsuming) {
      await this.consumer.disconnect();
      this.logger.log('Consumer de Kafka desconectado');
    }
  }

  async startConsuming(): Promise<void> {
    if (this.isConsuming) {
      this.logger.warn('El consumidor ya está activo');
      return;
    }

    try {
      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload);
        },
      });
      this.isConsuming = true;
      this.logger.log('Consumo de eventos de Kafka iniciado');
    } catch (error) {
      this.logger.error('Error al iniciar el consumo de Kafka', error);
      throw error;
    }
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    
    if (!message.value) {
      this.logger.warn(`Mensaje sin valor recibido en ${topic}[${partition}]`);
      return;
    }

    try {
      const eventData = JSON.parse(message.value.toString());
      const orderEvent = this.mapToOrderEvent(eventData, message.offset);
      
      this.logger.debug(`Evento procesado: ${orderEvent.eventType} para orden ${orderEvent.orderId}`);
      this.eventsSubject.next(orderEvent);
    } catch (error) {
      this.logger.error(`Error al procesar mensaje: ${error.message}`, error.stack);
    }
  }

  private mapToOrderEvent(data: Record<string, unknown>, offset: string): OrderEvent {
    return new OrderEvent(
      data.orderId as string,
      data.eventType as string,
      data.status as string,
      data.timestamp as string,
      data.customerId as string,
      data.items as Array<{ productId: string; quantity: number; price: number }>,
      data.totalAmount as number,
      offset,
    );
  }

  subscribeToOrderEvents(): Observable<OrderEvent> {
    this.logger.debug('Nueva suscripción a eventos de órdenes');
    return this.eventsSubject.asObservable().pipe(
      takeUntil(this.destroy$),
      catchError((error) => {
        this.logger.error('Error en el stream de eventos', error);
        throw error;
      }),
      finalize(() => {
        this.logger.debug('Stream de eventos cerrado');
      }),
    );
  }

  async pauseConsuming(): Promise<void> {
    if (this.isConsuming) {
      await this.consumer.pause([{ topic: this.topicName }]);
      this.logger.log('Consumo de eventos pausado');
    }
  }

  async resumeConsuming(): Promise<void> {
    if (this.isConsuming) {
      await this.consumer.resume([{ topic: this.topicName }]);
      this.logger.log('Consumo de eventos reanudado');
    }
  }

  isConsumerRunning(): boolean {
    return this.isConsuming;
  }
}