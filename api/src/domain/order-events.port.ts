import { Observable } from 'rxjs';
import { Order } from './order.model';

/**
 * Puerto de salida que define cómo el dominio interactúa con eventos de órdenes.
 * La implementación concreta será proporcionada por la infraestructura.
 */
export interface OrderEventsPort {
    /**
     * Suscribe al flujo de eventos de órdenes desde Kafka.
     * @returns Observable que emite eventos de órdenes según se reciben.
     */
    subscribeToOrderEvents(): Observable<OrderEvent>;
}

/**
 * Representa un evento de cambio de estado en una orden.
 */
export class OrderEvent {
    constructor(
        public readonly orderId: string,
        public readonly status: string,
        public readonly timestamp: Date,
        public readonly metadata?: Record<string, unknown>
    ) {}

    /**
     * Convierte el evento a un formato seguro para serialización.
     */
    public toJSON(): Record<string, unknown> {
        return {
            orderId: this.orderId,
            status: this.status,
            timestamp: this.timestamp.toISOString(),
            metadata: this.metadata
        };
    }
}