import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="not-found-container">
      <mat-card class="not-found-card">
        <mat-card-content>
          <mat-icon class="error-icon">error_outline</mat-icon>
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for does not exist.</p>
          <button mat-raised-button color="primary" routerLink="/">
            <mat-icon>home</mat-icon>
            Go to Home
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 24px;
    }
    .not-found-card {
      max-width: 400px;
      text-align: center;
      padding: 32px;
    }
    .error-icon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      color: #f44336;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 72px;
      font-weight: bold;
      margin: 0;
      color: #3f51b5;
    }
    h2 {
      font-size: 24px;
      margin: 8px 0;
    }
    p {
      color: #666;
      margin-bottom: 24px;
    }
    button mat-icon {
      margin-right: 8px;
    }
  `]
})
export class NotFoundComponent {}