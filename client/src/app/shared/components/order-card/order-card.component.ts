import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrderEvent } from '../../../core/services/order-events.service';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule, MatTooltipModule],
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderCardComponent {
  @Input({ required: true }) event!: OrderEvent;
  @Input() showTimestamp = true;
  @Input() compact = false;

  private readonly matTooltip = inject(MatTooltipModule);

  get eventTypeLabel(): string {
    const labels: Record<string, string> = {
      'ORDER_CREATED': 'Orden Creada',
      'ORDER_UPDATED': 'Orden Actualizada',
      'ORDER_CANCELLED': 'Orden Cancelada',
      'ORDER_COMPLETED': 'Orden Completada',
      'ORDER_PAYMENT_PENDING': 'Pago Pendiente',
      'ORDER_PAYMENT_RECEIVED': 'Pago Recibido'
    };
    return labels[this.event?.eventType] || this.event?.eventType || 'Desconocido';
  }

  get eventTypeClass(): string {
    const type = this.event?.eventType?.toLowerCase() || '';
    if (type.includes('created')) return 'event-created';
    if (type.includes('updated')) return 'event-updated';
    if (type.includes('cancelled')) return 'event-cancelled';
    if (type.includes('completed')) return 'event-completed';
    if (type.includes('payment')) return 'event-payment';
    return 'event-default';
  }

  get formattedTimestamp(): string {
    if (!this.event?.timestamp) return '';
    const date = new Date(this.event.timestamp);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  get customerName(): string {
    return this.event?.payload?.customer?.name || this.event?.payload?.customerName || 'Cliente no disponible';
  }

  get orderId(): string {
    return this.event?.payload?.orderId || this.event?.orderId || this.event?.id || 'N/A';
  }

  get orderStatus(): string {
    return this.event?.payload?.status || this.event?.status || 'Desconocido';
  }

  get totalAmount(): string {
    const amount = this.event?.payload?.totalAmount || this.event?.payload?.total || this.event?.amount;
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(amount);
  }

  get itemsCount(): number {
    const items = this.event?.payload?.items;
    if (!items || !Array.isArray(items)) return 0;
    return items.length;
  }

  trackByEventId(index: number, event: OrderEvent): string {
    return event?.id || `${index}`;
  }
}