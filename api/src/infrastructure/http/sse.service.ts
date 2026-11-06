import { Injectable, OnModuleInit, OnModuleDestroy, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Observable, Subject, filter, map, takeUntil } from 'rxjs';
import { OrderEventsPort } from '../../domain/order-events.port';
import { OrderEvent } from '../../domain/order-events.port';

@Injectable()
export class SseService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(SseService.name);
    private readonly clients: Map<string, Response> = new Map();
    private readonly destroy$ = new Subject<void>();
    private orderEvents$: Observable<OrderEvent> | null = null;

    constructor(private readonly orderEventsPort: OrderEventsPort) {}

    onModuleInit(): void {
        this.logger.log('Inicializando SseService');
        this.initializeEventStream();
    }

    onModuleDestroy(): void {
        this.logger.log('Destruyendo SseService, cerrando todas las conexiones SSE');
        this.destroy$.next();
        this.destroy$.complete();
        this.clients.forEach((response, clientId) => {
            this.closeConnection(clientId);
        });
        this.clients.clear();
    }

    private initializeEventStream(): void {
        try {
            this.orderEvents$ = this.orderEventsPort.subscribeToOrderEvents().pipe(
                takeUntil(this.destroy$),
                filter((event): event is OrderEvent => event !== null && event !== undefined),
                map(event => {
                    this.logger.debug(`Evento recibido: ${event.eventType} - ID: ${event.orderId}`);
                    return event;
                })
            );
            this.logger.log('Stream de eventos de órdenes inicializado correctamente');
        } catch (error) {
            this.logger.error('Error al inicializar el stream de eventos', error);
        }
    }

    subscribeToOrderEvents(response: Response): string {
        const clientId = this.generateClientId();
        this.clients.set(clientId, response);
        this.logger.log(`Nuevo cliente SSE conectado: ${clientId}`);

        response.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no'
        });

        this.sendEvent(response, {
            event: 'connected',
            data: JSON.stringify({
                clientId,
                message: 'Conectado al stream de eventos de órdenes',
                timestamp: new Date().toISOString()
            })
        });

        if (this.orderEvents$) {
            const subscription = this.orderEvents$.subscribe({
                next: (event) => {
                    this.sendEvent(response, {
                        event: event.eventType,
                        data: event.toJSON()
                    });
                },
                error: (error) => {
                    this.logger.error(`Error en stream para cliente ${clientId}`, error);
                    this.sendEvent(response, {
                        event: 'error',
                        data: JSON.stringify({
                            message: 'Error en la conexión del stream',
                            error: error.message
                        })
                    });
                },
                complete: () => {
                    this.logger.warn(`Stream completado para cliente ${clientId}`);
                    this.closeConnection(clientId);
                }
            });

            response.on('close', () => {
                this.logger.log(`Cliente SSE desconectado: ${clientId}`);
                subscription.unsubscribe();
                this.clients.delete(clientId);
            });
        } else {
            this.logger.warn(`Stream de eventos no disponible para cliente ${clientId}`);
            this.sendEvent(response, {
                event: 'error',
                data: JSON.stringify({
                    message: 'Stream de eventos no disponible'
                })
            });
        }

        return clientId;
    }

    private sendEvent(response: Response, event: { event: string; data: string }): void {
        if (!response.writableEnded) {
            try {
                response.write(`event: ${event.event}\n`);
                response.write(`data: ${event.data}\n\n`);
            } catch (error) {
                this.logger.error('Error al enviar evento SSE', error);
            }
        }
    }

    private closeConnection(clientId: string): void {
        const response = this.clients.get(clientId);
        if (response && !response.writableEnded) {
            try {
                response.end();
            } catch (error) {
                this.logger.error(`Error al cerrar conexión para cliente ${clientId}`, error);
            }
        }
        this.clients.delete(clientId);
    }

    private generateClientId(): string {
        return `sse_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }

    getConnectedClientsCount(): number {
        return this.clients.size;
    }

    broadcastToAll(eventType: string, data: unknown): void {
        this.clients.forEach((response, clientId) => {
            this.sendEvent(response, {
                event: eventType,
                data: JSON.stringify(data)
            });
            this.logger.debug(`Evento broadcast enviado a cliente ${clientId}`);
        });
    }
}