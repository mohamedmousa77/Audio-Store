import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorDialogData } from '../../../core/services/error/error-dialog.service';

/**
 * Error Dialog Component (Custom - No Material)
 * Displays error messages with optional retry and reload actions
 * 
 * Usage: Injected via ErrorDialogService
 */
@Component({
    selector: 'app-error-dialog',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="error-dialog-overlay" (click)="onOverlayClick()">
      <div class="error-dialog-container" (click)="$event.stopPropagation()">
        <div class="error-header" [class.critical]="data.isCritical">
          <div class="error-icon">
            {{ data.isCritical ? '⚠️' : '⚠' }}
          </div>
          <h2>{{ data.title }}</h2>
        </div>
        
        <div class="error-content">
          <p class="error-message">{{ data.message }}</p>
          
          @if (data.details) {
            <div class="error-details">
              <span class="details-icon">ℹ️</span>
              <p>{{ data.details }}</p>
            </div>
          }
        </div>
        
        <div class="error-actions">
          @if (data.canRetry) {
            <button class="btn btn-primary" (click)="retry()">
              🔄 Riprova
            </button>
          }
          
          @if (!data.isCritical) {
            <button class="btn btn-secondary" (click)="close()">Chiudi</button>
          } @else {
            <button class="btn btn-danger" (click)="reload()">
              🔄 Ricarica Applicazione
            </button>
          }
        </div>
      </div>
    </div>
  `,
    styles: [`
    .error-dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
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

    .error-dialog-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      min-width: 350px;
      max-width: 500px;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateY(-50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .error-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 24px 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .error-header.critical {
      background-color: #ffebee;
      border-bottom-color: #ef5350;
    }

    .error-icon {
      font-size: 32px;
      line-height: 1;
    }

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }

    .error-content {
      padding: 20px 24px;
    }

    .error-message {
      margin: 0 0 16px 0;
      font-size: 15px;
      color: #555;
      line-height: 1.5;
    }

    .error-details {
      display: flex;
      gap: 10px;
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 4px;
      border-left: 3px solid #2196f3;
    }

    .details-icon {
      font-size: 16px;
      flex-shrink: 0;
    }

    .error-details p {
      margin: 0;
      font-size: 13px;
      color: #666;
      line-height: 1.4;
    }

    .error-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .btn-primary {
      background-color: #2196f3;
      color: white;
    }

    .btn-primary:hover {
      background-color: #1976d2;
    }

    .btn-secondary {
      background-color: #f5f5f5;
      color: #333;
    }

    .btn-secondary:hover {
      background-color: #e0e0e0;
    }

    .btn-danger {
      background-color: #f44336;
      color: white;
    }

    .btn-danger:hover {
      background-color: #d32f2f;
    }
  `]
})
export class ErrorDialogComponent implements OnInit {
    data!: ErrorDialogData;
    onClose?: (result?: string) => void;

    ngOnInit() {
        // Data will be set by ErrorDialogService
    }

    /**
     * Handle overlay click - close if not critical
     */
    onOverlayClick(): void {
        if (!this.data.isCritical) {
            this.close();
        }
    }

    /**
     * Retry action
     */
    retry(): void {
        this.onClose?.('retry');
    }

    /**
     * Close dialog
     */
    close(): void {
        this.onClose?.();
    }

    /**
     * Reload application
     */
    reload(): void {
        window.location.reload();
    }
}
