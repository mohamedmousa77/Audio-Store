import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Confirmation Dialog Data
 */
export interface ConfirmDialogData {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean; // Red confirm button for destructive actions
}

/**
 * Confirmation Dialog Component
 * Custom dialog for user confirmations (replace browser confirm())
 */
@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dialog-overlay" (click)="onCancel()">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <span class="material-symbols-outlined dialog-icon" [class.danger]="data.isDangerous">
            {{ data.isDangerous ? 'warning' : 'help' }}
          </span>
          <h2>{{ data.title }}</h2>
        </div>

        <div class="dialog-body">
          <p>{{ data.message }}</p>
        </div>

        <div class="dialog-actions">
          <button class="btn-cancel" (click)="onCancel()">
            {{ data.cancelText || 'Annulla' }}
          </button>
          <button 
            class="btn-confirm" 
            [class.danger]="data.isDangerous"
            (click)="onConfirm()">
            {{ data.confirmText || 'Conferma' }}
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .dialog-container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 450px;
      width: 90%;
      padding: 32px;
      animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes slideUp {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }

    .dialog-icon {
      font-size: 40px;
      color: #FF6B35;
    }

    .dialog-icon.danger {
      color: #dc3545;
    }

    .dialog-header h2 {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0;
    }

    .dialog-body {
      margin-bottom: 28px;
    }

    .dialog-body p {
      font-size: 16px;
      line-height: 1.6;
      color: #4a4a4a;
      margin: 0;
    }

    .dialog-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .btn-cancel,
    .btn-confirm {
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      outline: none;
    }

    .btn-cancel {
      background: #f0f0f0;
      color: #4a4a4a;
    }

    .btn-cancel:hover {
      background: #e0e0e0;
    }

    .btn-confirm {
      background: #FF6B35;
      color: white;
    }

    .btn-confirm:hover {
      background: #e55a28;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    }

    .btn-confirm.danger {
      background: #dc3545;
    }

    .btn-confirm.danger:hover {
      background: #c82333;
      box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
    }
  `]
})
export class ConfirmDialogComponent {
    @Input() data!: ConfirmDialogData;
    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    onConfirm(): void {
        this.confirm.emit();
    }

    onCancel(): void {
        this.cancel.emit();
    }
}
