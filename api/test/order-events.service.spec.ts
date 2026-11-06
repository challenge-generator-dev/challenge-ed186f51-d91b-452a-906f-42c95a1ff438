import { Test, TestingModule } from '@nestjs/testing';
import { OrderEventsService } from '../src/application/order-events.service';
import { OrderEventsPort, OrderEvent, OrderEventType } from '../domain/order-events.port';
import { Observable, Subject, take } from 'rxjs';

describe('OrderEventsService', () => {
  let service: OrderEventsService;
  let mockPort: jest.Mocked<OrderEventsPort>;
  let eventsSubject: Subject<OrderEvent>;

  const mockOrderEvent: OrderEvent = new OrderEvent({
    id: 'evt-001',
    orderId: 'order-123',
    eventType: OrderEventType.ORDER_CREATED,
    timestamp: new Date('2024-01-15T10:30:00Z'),
    data: { amount: 100, currency: 'USD' },
  });

  beforeEach(async () => {
    eventsSubject = new Subject<OrderEvent>();
    
    mockPort = {
      subscribeToOrderEvents: jest.fn().mockReturnValue(eventsSubject.asObservable()),
      pauseConsuming: jest.fn().mockResolvedValue(undefined),
      resumeConsuming: jest.fn().mockResolvedValue(undefined),
      isConsumerRunning: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderEventsService,
        {
          provide: OrderEventsPort,
          useValue: mockPort,
        },
      ],
    }).compile();

    service = module.get<OrderEventsService>(OrderEventsService);
  });

  afterEach(() => {
    eventsSubject.complete();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('suscribirse a eventos de Kafka', () => {
    it('debería llamar a subscribeToOrderEvents del puerto al inicializar', () => {
      expect(mockPort.subscribeToOrderEvents).toHaveBeenCalled();
    });

    it('debería emitir eventos recibidos del adaptador de Kafka', async () => {
      const events: OrderEvent[] = [];
      
      service.getOrderEvents()
        .pipe(take(2))
        .subscribe(event => events.push(event));

      eventsSubject.next(mockOrderEvent);
      eventsSubject.next({
        ...mockOrderEvent,
        id: 'evt-002',
        eventType: OrderEventType.ORDER_UPDATED,
      });

      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(events).toHaveLength(2);
      expect(events[0].orderId).toBe('order-123');
    });

    it('debería filtrar eventos válidos', async () => {
      const events: OrderEvent[] = [];
      
      service.getOrderEvents()
        .pipe(take(1))
        .subscribe(event => events.push(event));

      const invalidEvent = new OrderEvent({
        id: 'evt-invalid',
        orderId: '',
        eventType: OrderEventType.ORDER_CREATED,
        timestamp: new Date(),
        data: {},
      });

      eventsSubject.next(invalidEvent);
      eventsSubject.next(mockOrderEvent);

      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(events).toHaveLength(1);
      expect(events[0].id).toBe('evt-001');
    });
  });

  describe('filtrado por tipo de evento', () => {
    it('debería filtrar eventos por tipo ORDER_CREATED', async () => {
      const events: OrderEvent[] = [];
      
      service.getOrderEventsByType(OrderEventType.ORDER_CREATED)
        .pipe(take(1))
        .subscribe(event => events.push(event));

      eventsSubject.next(new OrderEvent({
        id: 'evt-001',
        orderId: 'order-1',
        eventType: OrderEventType.ORDER_CREATED,
        timestamp: new Date(),
        data: {},
      }));

      eventsSubject.next(new OrderEvent({
        id: 'evt-002',
        orderId: 'order-2',
        eventType: OrderEventType.ORDER_CANCELLED,
        timestamp: new Date(),
        data: {},
      }));

      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe(OrderEventType.ORDER_CREATED);
    });
  });

  describe('filtrado por ID de orden', () => {
    it('debería filtrar eventos por orderId', async () => {
      const events: OrderEvent[] = [];
      
      service.getOrderEventsByOrderId('order-123')
        .pipe(take(2))
        .subscribe(event => events.push(event));

      eventsSubject.next(new OrderEvent({
        id: 'evt-001',
        orderId: 'order-123',
        eventType: OrderEventType.ORDER_CREATED,
        timestamp: new Date(),
        data: {},
      }));

      eventsSubject.next(new OrderEvent({
        id: 'evt-002',
        orderId: 'order-456',
        eventType: OrderEventType.ORDER_UPDATED,
        timestamp: new Date(),
        data: {},
      }));

      eventsSubject.next(new OrderEvent({
        id: 'evt-003',
        orderId: 'order-123',
        eventType: OrderEventType.ORDER_COMPLETED,
        timestamp: new Date(),
        data: {},
      }));

      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(events).toHaveLength(2);
      expect(events.every(e => e.orderId === 'order-123')).toBe(true);
    });
  });

  describe('control de consumo', () => {
    it('debería pausar el consumo de eventos', async () => {
      await service.pauseEventConsumption();
      
      expect(mockPort.pauseConsuming).toHaveBeenCalled();
    });

    it('debería reanudar el consumo de eventos', async () => {
      await service.resumeEventConsumption();
      
      expect(mockPort.resumeConsuming).toHaveBeenCalled();
    });

    it('debería retornar el estado del consumidor', () => {
      const isRunning = service.isConsumerRunning();
      
      expect(isRunning).toBe(true);
      expect(mockPort.isConsumerRunning).toHaveBeenCalled();
    });
  });

  describe('enriquecimiento de eventos', () => {
    it('debería enriquecer eventos con metadata de procesamiento', async () => {
      const events: OrderEvent[] = [];
      
      service.getOrderEvents()
        .pipe(take(1))
        .subscribe(event => events.push(event));

      eventsSubject.next(mockOrderEvent);

      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(events).toHaveLength(1);
      expect(events[0].data).toHaveProperty('processedAt');
      expect(events[0].data).toHaveProperty('serviceName', 'order-events-service');
    });
  });

  describe('manejo de errores', () => {
    it('debería manejar errores en la suscripción de eventos', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      mockPort.subscribeToOrderEvents = jest.fn().mockReturnValue(
        new Observable(subscriber => {
          subscriber.error(new Error('Error de conexión con Kafka'));
        })
      );
      
      const testModule: TestingModule = await Test.createTestingModule({
        providers: [
          OrderEventsService,
          {
            provide: OrderEventsPort,
            useValue: mockPort,
          },
        ],
      }).compile();

      const testService = testModule.get<OrderEventsService>(OrderEventsService);
      
      expect(() => testService.onModuleInit()).not.toThrow();
      
      consoleSpy.mockRestore();
    });
  });
});