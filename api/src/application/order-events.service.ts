import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Observable, Subject, filter, map } from 'rxjs';
import { OrderEventsPort } from '../../domain/order-events.port';
import { OrderEvent, Order, OrderStatus, OrderEventType } from '../../domain/order.model';

@Injectable()
export class OrderEventsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderEventsService.name);
  private eventsSubject = new Subject<OrderEvent>();
  private subscription: { unsubscribe: () => void } | null = null;
  private isConsuming = false;
  private readonly ordersCache = new Map<string, Order>();
  private readonly eventsBuffer: OrderEvent[] = [];
  private readonly maxBufferSize = 1000;

  constructor(private readonly orderEventsPort: OrderEventsPort) {}

  public onModuleInit(): void {
    this.logger.log('Inicializando OrderEventsService');
    this.startConsuming();
  }

  public onModuleDestroy(): void {
    this.logger.log('Deteniendo OrderEventsService');
    this.stopConsuming();
  }

  public startConsuming(): void {
    if (this.isConsuming) {
      this.logger.warn('El consumidor ya está activo');
      return;
    }

    this.logger.log('Iniciando consumo de eventos de órdenes');
    const events$ = this.orderEventsPort.subscribeToOrderEvents();
    
    this.subscription = events$.subscribe({
      next: (event) => this.handleEvent(event),
      error: (error) => {
        this.logger.error(`Error en el flujo de eventos: ${error.message}`, error.stack);
        this.isConsuming = false;
      },
      complete: () => {
        this.logger.warn('El flujo de eventos se ha completado');
        this.isConsuming = false;
      },
    });

    this.isConsuming = true;
  }

  public stopConsuming(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.isConsuming = false;
    this.logger.log('Consumo de eventos detenido');
  }

  private handleEvent(event: OrderEvent): void {
    this.logger.debug(`Evento recibido: ${event.eventType} para orden ${event.orderId}`);
    
    if (event.order) {
      this.ordersCache.set(event.order.id, event.order);
      
      if (this.eventsBuffer.length >= this.maxBufferSize) {
        this.eventsBuffer.shift();
      }
      this.eventsBuffer.push(event);
    }
    
    this.eventsSubject.next(event);
  }

  public getEventsStream(): Observable<OrderEvent> {
    return this.eventsSubject.asObservable();
  }

  public getOrderById(orderId: string): Order | null {
    return this.ordersCache.get(orderId) || null;
  }

  public filterEventsByStatus(status: string): Observable<OrderEvent> {
    return this.eventsSubject.asObservable().pipe(
      filter((event) => event.newStatus === status)
    );
  }

  public filterEventsByOrderId(orderId: string): Observable<OrderEvent> {
    return this.eventsSubject.asObservable().pipe(
      filter((event) => event.orderId === orderId)
    );
  }

  public isConsumerRunning(): boolean {
    return this.isConsuming;
  }

  public restartConsumer(): void {
    this.logger.log('Reiniciando consumidor de eventos');
    this.stopConsuming();
    this.startConsuming();
  }

  public getRecentEvents(limit: number = 50): OrderEvent[] {
    return this.eventsBuffer.slice(-limit);
  }

  public getEventsCount(): number {
    return this.eventsBuffer.length;
  }

  public getCachedOrdersCount(): number {
    return this.ordersCache.size;
  }

  public clearCache(): void {
    this.ordersCache.clear();
    this.eventsBuffer.length = 0;
    this.logger.log('Caché de eventos limpiado');
  }
}