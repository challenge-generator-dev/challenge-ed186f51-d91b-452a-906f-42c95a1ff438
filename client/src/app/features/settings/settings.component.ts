import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  template: `
    <div class="settings-container">
      <h1>Settings</h1>
      <mat-card class="settings-card">
        <mat-card-header>
          <mat-card-title>Display Preferences</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="settings-form">
            <mat-form-field appearance="outline">
              <mat-label>Theme</mat-label>
              <mat-select [value]="theme()" (selectionChange)="theme.set($event.value)">
                <mat-option value="light">Light</mat-option>
                <mat-option value="dark">Dark</mat-option>
                <mat-option value="auto">Auto</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Events per page</mat-label>
              <input matInput type="number" [value]="eventsPerPage()" (input)="eventsPerPage.set($any($event.target).value)">
            </mat-form-field>
            <mat-slide-toggle 
              [checked]="autoReconnect()" 
              (change)="autoReconnect.set($event.checked)">
              Auto-reconnect on disconnect
            </mat-slide-toggle>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="saveSettings()">Save</button>
          <button mat-button (click)="resetSettings()">Reset</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 24px;
      max-width: 600px;
      margin: 0 auto;
    }
    .settings-card {
      margin-top: 16px;
    }
    .settings-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class SettingsComponent {
  readonly theme = signal<string>('light');
  readonly eventsPerPage = signal<number>(50);
  readonly autoReconnect = signal<boolean>(true);

  saveSettings(): void {
    const settings = {
      theme: this.theme(),
      eventsPerPage: this.eventsPerPage(),
      autoReconnect: this.autoReconnect()
    };
    localStorage.setItem('app-settings', JSON.stringify(settings));
    console.log('Settings saved:', settings);
  }

  resetSettings(): void {
    this.theme.set('light');
    this.eventsPerPage.set(50);
    this.autoReconnect.set(true);
    localStorage.removeItem('app-settings');
  }
}