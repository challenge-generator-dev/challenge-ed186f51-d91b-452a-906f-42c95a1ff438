import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OrderEventsService } from '../../core/services/order-events.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="analytics-container">
      <h1>Analytics</h1>
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Total Events</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ totalEvents() }}</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Orders Created</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ ordersCreated() }}</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Orders Updated</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ ordersUpdated() }}</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Orders Cancelled</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ ordersCancelled() }}</div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .analytics-container {
      padding: 24px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }
    .stat-card {
      padding: 16px;
    }
    .stat-value {
      font-size: 36px;
      font-weight: bold;
      text-align: center;
      margin-top: 16px;
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  private readonly orderEventsService = inject(OrderEventsService);
  
  readonly totalEvents = computed(() => this.orderEventsService.orderEvents().length);
  readonly ordersCreated = computed(() => 
    this.orderEventsService.orderEvents().filter(e => e.eventType === 'ORDER_CREATED').length
  );
  readonly ordersUpdated = computed(() => 
    this.orderEventsService.orderEvents().filter(e => e.eventType === 'ORDER_UPDATED').length
  );
  readonly ordersCancelled = computed(() => 
    this.orderEventsService.orderEvents().filter(e => e.eventType === 'ORDER_CANCELLED').length
  );

  ngOnInit(): void {
    if (!this.orderEventsService.orderEvents().length) {
      this.orderEventsService.connectToOrderEvents().subscribe();
    }
  }
}