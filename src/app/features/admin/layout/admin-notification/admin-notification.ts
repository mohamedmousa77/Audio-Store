import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Notification data interface - dynamic for any admin operation
 */
export interface AdminNotificationData {
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
    details?: string;
    /** Auto-close after ms (0 = no auto-close). Default: 0 for errors, 5000 for success */
    autoCloseMs?: number;
}

/**
 * Admin Notification Dialog Component
 * Reusable modal for success/error/warning notifications.
 * Used across admin pages: product creation, category management, etc.
 *
 * Usage: Injected via AdminNotificationService
 */
@Component({
    selector: 'app-admin-notification',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="notification-overlay" (click)="onOverlayClick()">
      <div class="notification-container" [class]="'type-' + data.type" (click)="$event.stopPropagation()">

        <div class="notification-header" [class]="'header-' + data.type">
          <div class="notification-icon">
            @switch (data.type) {
              @case ('success') { <span class="material-icons icon-success">check_circle</span> }
              @case ('error') { <span class="material-icons icon-error">error</span> }
              @case ('warning') { <span class="material-icons icon-warning">warning</span> }
            }
          </div>
          <h2>{{ data.title }}</h2>
          <button class="close-btn" (click)="close()">
            <span class="material-icons">close</span>
          </button>
        </div>

        <div class="notification-content">
          <p class="notification-message">{{ data.message }}</p>

          @if (data.details) {
            <div class="notification-details" [class]="'details-' + data.type">
              <span class="material-icons details-icon">info</span>
              <p>{{ data.details }}</p>
            </div>
          }
        </div>

        <div class="notification-actions">
          <button class="btn" [class]="'btn-' + data.type" (click)="close()">
            {{ data.type === 'error' ? 'Chiudi' : 'OK' }}
          </button>
        </div>

      </div>
    </div>
  `,
    styles: [`
    .notification-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .notification-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
      min-width: 380px;
      max-width: 480px;
      animation: slideIn 0.3s ease-out;
      overflow: hidden;
    }

    @keyframes slideIn {
      from {
        transform: translateY(-40px) scale(0.95);
        opacity: 0;
      }
      to {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }

    /* Header */
    .notification-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 24px 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .header-success {
      background: linear-gradient(135deg, #e8f5e9, #f1f8e9);
      border-bottom-color: #a5d6a7;
    }

    .header-error {
      background: linear-gradient(135deg, #ffebee, #fce4ec);
      border-bottom-color: #ef9a9a;
    }

    .header-warning {
      background: linear-gradient(135deg, #fff8e1, #fff3e0);
      border-bottom-color: #ffcc80;
    }

    .notification-icon .material-icons {
      font-size: 32px;
    }

    .icon-success { color: #2e7d32; }
    .icon-error { color: #c62828; }
    .icon-warning { color: #e65100; }

    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #1c160d;
      flex: 1;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: rgba(0, 0, 0, 0.08);
      color: #333;
    }

    .close-btn .material-icons {
      font-size: 20px;
    }

    /* Content */
    .notification-content {
      padding: 20px 24px;
    }

    .notification-message {
      margin: 0 0 12px 0;
      font-size: 15px;
      color: #555;
      line-height: 1.6;
    }

    .notification-details {
      display: flex;
      gap: 10px;
      padding: 12px;
      border-radius: 8px;
      align-items: flex-start;
    }

    .details-success {
      background: #f1f8e9;
      border-left: 3px solid #66bb6a;
    }

    .details-error {
      background: #fff3e0;
      border-left: 3px solid #ff7043;
    }

    .details-warning {
      background: #fff8e1;
      border-left: 3px solid #ffa726;
    }

    .details-icon {
      font-size: 18px;
      color: #888;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .notification-details p {
      margin: 0;
      font-size: 13px;
      color: #666;
      line-height: 1.5;
    }

    /* Actions */
    .notification-actions {
      display: flex;
      justify-content: flex-end;
      padding: 14px 24px;
      border-top: 1px solid #f0ebe3;
    }

    .btn {
      padding: 10px 28px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .btn-success {
      background: linear-gradient(135deg, #43a047, #2e7d32);
      color: white;
    }

    .btn-success:hover {
      background: linear-gradient(135deg, #388e3c, #1b5e20);
    }

    .btn-error {
      background: linear-gradient(135deg, #e53935, #c62828);
      color: white;
    }

    .btn-error:hover {
      background: linear-gradient(135deg, #d32f2f, #b71c1c);
    }

    .btn-warning {
      background: linear-gradient(135deg, #fb8c00, #e65100);
      color: white;
    }

    .btn-warning:hover {
      background: linear-gradient(135deg, #ef6c00, #bf360c);
    }
  `]
})
export class AdminNotificationComponent {
    data!: AdminNotificationData;
    onClose?: () => void;

    onOverlayClick(): void {
        this.close();
    }

    close(): void {
        this.onClose?.();
    }
}
