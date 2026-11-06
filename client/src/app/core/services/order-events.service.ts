import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OrderEvent {
  id: string;
  type: string;
  payload: any;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderEventsService {
  private readonly apiUrl = environment.apiUrl;
  private eventsSignal = signal<OrderEvent[]>([]);
  private eventSource: EventSource | null = null;

  constructor(private http: HttpClient) {}

  get orderEvents() {
    return this.eventsSignal.asReadonly();
  }

  connectToOrderEvents(): Observable<OrderEvent> {
    return new Observable<OrderEvent>(observer => {
      const eventSourceUrl = `${this.apiUrl}/orders/events`;

      this.eventSource = new EventSource(eventSourceUrl, {
        withCredentials: false
      });

      this.eventSource.onmessage = (event) => {
        try {
          const orderEvent: OrderEvent = JSON.parse(event.data);
          const currentEvents = this.eventsSignal();
          this.eventsSignal.set([...currentEvents, orderEvent]);
          observer.next(orderEvent);
        } catch (error) {
          observer.error('Error parsing event data');
        }
      };

      this.eventSource.onerror = (error) => {
        observer.error('EventSource failed: ' + error);
        this.disconnectFromOrderEvents();
      };

      return () => {
        this.disconnectFromOrderEvents();
      };
    });
  }

  disconnectFromOrderEvents(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  clearEvents(): void {
    this.eventsSignal.set([]);
  }
}