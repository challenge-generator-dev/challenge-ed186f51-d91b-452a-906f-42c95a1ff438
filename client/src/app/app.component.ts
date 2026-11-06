import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { OrderEventsService } from './core/services/order-events.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly orderEventsService = inject(OrderEventsService);
  
  readonly orderCount = this.orderEventsService.orderEvents;
  
  isMobileMenuOpen = false;
  isDesktopSidebarExpanded = true;

  ngOnInit(): void {
    this.orderEventsService.connectToOrderEvents();
  }

  ngOnDestroy(): void {
    this.orderEventsService.disconnectFromOrderEvents();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleDesktopSidebar(): void {
    this.isDesktopSidebarExpanded = !this.isDesktopSidebarExpanded;
  }

  getUnreadCount(): number {
    return this.orderCount().length;
  }
}