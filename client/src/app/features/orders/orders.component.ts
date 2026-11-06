import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderEventsService, OrderEvent } from '../../core/services/order-events.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, OnDestroy {
  private readonly orderEventsService = inject(OrderEventsService);
  
  readonly isConnected = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  
  readonly orderEvents = this.orderEventsService.orderEvents;
  
  readonly eventsCount = computed(() => this.orderEvents().length);
  
  readonly recentEvents = computed(() => {
    const events = this.orderEvents();
    return events.length > 10 ? events.slice(-10) : events;
  });

  ngOnInit(): void {
    this.connectToEvents();
  }

  ngOnDestroy(): void {
    this.disconnectFromEvents();
  }

  connectToEvents(): void {
    if (this.isConnected()) {
      return;
    }
    
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    this.orderEventsService.connectToOrderEvents().subscribe({
      next: () => {
        this.isConnected.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isConnected.set(false);
        this.isLoading.set(false);
        this.errorMessage.set('Error al conectar con el servidor de eventos');
        console.error('Error en la conexión SSE:', err);
      }
    });
  }

  disconnectFromEvents(): void {
    this.orderEventsService.disconnectFromOrderEvents();
    this.isConnected.set(false);
  }

  clearEvents(): void {
    this.orderEventsService.clearEvents();
  }

  reconnect(): void {
    this.disconnectFromEvents();
    setTimeout(() => this.connectToEvents(), 500);
  }

  getEventTypeIcon(eventType: string): string {
    const iconMap: Record<string, string> = {
      'ORDER_CREATED': 'add_shopping_cart',
      'ORDER_UPDATED': 'update',
      'ORDER_CANCELLED': 'cancel',
      'ORDER_COMPLETED': 'check_circle',
      'ORDER_PENDING': 'hourglass_empty'
    };
    return iconMap[eventType] || 'info';
  }

  getEventTypeClass(eventType: string): string {
    const classMap: Record<string, string> = {
      'ORDER_CREATED': 'event-created',
      'ORDER_UPDATED': 'event-updated',
      'ORDER_CANCELLED': 'event-cancelled',
      'ORDER_COMPLETED': 'event-completed',
      'ORDER_PENDING': 'event-pending'
    };
    return classMap[eventType] || 'event-default';
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}