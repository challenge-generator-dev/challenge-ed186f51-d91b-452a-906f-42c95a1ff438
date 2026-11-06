import { Controller, Get, Res, Sse, HttpCode, HttpStatus, Logger, Param, Query, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { Observable, interval, map, takeUntil, Subject } from 'rxjs';
import { OrderEventsService } from '../../application/order-events.service';
import { OrderEvent } from '../../domain/order-events.port';

interface SseEvent {
  event: string;
  data: string;
  id?: string;
}

@Controller('orders')
export class OrderEventsController {
  private readonly logger = new Logger(OrderEventsController.name);
  private readonly activeConnections = new Map<string, Subject<void>>();

  constructor(private readonly orderEventsService: OrderEventsService) {}

  @Get('events')
  @HttpCode(HttpStatus.OK)
  async streamOrderEvents(
    @Res() res: Response,
    @Query('customerId') customerId?: string,
  ): Promise<void> {
    const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.logger.log(`Nueva conexión SSE para eventos de órdenes: ${connectionId}, customerId: ${customerId || 'todos'}`);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const disconnect$ = new Subject<void>();
    this.activeConnections.set(connectionId, disconnect$);

    let eventCount = 0;
    const sendEvent = (event: OrderEvent): void => {
      const sseEvent: SseEvent = {
        event: 'order-update',
        data: JSON.stringify(event.toJSON()),
        id: String(++eventCount),
      };
      
      const message = this.formatSseMessage(sseEvent);
      res.write(message);
      this.logger.debug(`Evento enviado a ${connectionId}: ${event.eventType} para orden ${event.orderId}`);
    };

    const sendError = (error: string): void => {
      const sseEvent: SseEvent = {
        event: 'error',
        data: JSON.stringify({ message: error }),
      };
      res.write(this.formatSseMessage(sseEvent));
    };

    const sendHeartbeat = (): void => {
      const sseEvent: SseEvent = {
        event: 'heartbeat',
        data: JSON.stringify({ timestamp: new Date().toISOString() }),
      };
      res.write(this.formatSseMessage(sseEvent));
    };

    try {
      const subscription = this.orderEventsService.subscribeToOrderEvents().pipe(
        takeUntil(disconnect$),
      ).subscribe({
        next: (event: OrderEvent) => {
          if (customerId && event.customerId !== customerId) {
            return;
          }
          sendEvent(event);
        },
        error: (error: Error) => {
          this.logger.error(`Error en stream de eventos: ${error.message}`, error.stack);
          sendError(error.message);
          disconnect$.next();
        },
        complete: () => {
          this.logger.log(`Stream completado para ${connectionId}`);
          sendError('Stream de eventos cerrado por el servidor');
        },
      });

      const heartbeatInterval = interval(15000).pipe(
        takeUntil(disconnect$),
      ).subscribe(() => {
        sendHeartbeat();
      });

      res.on('close', () => {
        this.logger.log(`Conexión cerrada: ${connectionId}`);
        disconnect$.next();
        disconnect$.complete();
        subscription.unsubscribe();
        heartbeatInterval.unsubscribe();
        this.activeConnections.delete(connectionId);
        this.logger.debug(`Conexiones activas: ${this.activeConnections.size}`);
      });

    } catch (error) {
      this.logger.error(`Error al iniciar stream: ${error.message}`, error.stack);
      sendError('Error al conectar con el servicio de eventos');
      res.end();
    }
  }

  @Get('events/:orderId')
  @HttpCode(HttpStatus.OK)
  async getOrderEventById(
    @Param('orderId') orderId: string,
  ): Promise<OrderEvent> {
    this.logger.debug(`Buscando evento para orden: ${orderId}`);
    const event = await this.orderEventsService.getLatestEventForOrder(orderId);
    
    if (!event) {
      throw new NotFoundException(`No se encontró evento para la orden: ${orderId}`);
    }
    
    return event;
  }

  private formatSseMessage(event: SseEvent): string {
    let message = '';
    if (event.id) {
      message += `id: ${event.id}\n`;
    }
    message += `event: ${event.event}\n`;
    message += `data: ${event.data}\n`;
    message += '\n';
    return message;
  }

  getActiveConnectionsCount(): number {
    return this.activeConnections.size;
  }
}