import { Injectable, inject, ApplicationRef, createComponent, EnvironmentInjector } from '@angular/core';
import { AdminNotificationComponent, AdminNotificationData } from './admin-notification';

/**
 * Admin Notification Service
 * Dynamically creates and manages notification dialogs for admin operations.
 * Follows the same pattern as ErrorDialogService.
 *
 * Usage:
 *   - Product created: showSuccess('Prodotto Creato', 'Il prodotto è stato creato con successo.')
 *   - Category error:  showError('Errore', 'Impossibile creare la categoria.')
 *   - Generic:         show({ type: 'warning', title: '...', message: '...' })
 */
@Injectable({
    providedIn: 'root'
})
export class AdminNotificationService {
    private appRef = inject(ApplicationRef);
    private injector = inject(EnvironmentInjector);
    private currentDialog: any = null;

    /**
     * Show notification dialog with full configuration
     */
    show(data: AdminNotificationData): void {
        // Close existing dialog if any
        this.closeDialog();

        // Create component dynamically
        const componentRef = createComponent(AdminNotificationComponent, {
            environmentInjector: this.injector
        });

        // Set data and close handler
        componentRef.instance.data = data;
        componentRef.instance.onClose = () => {
            this.closeDialog();
        };

        // Attach to application DOM
        this.appRef.attachView(componentRef.hostView);
        const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);
        this.currentDialog = componentRef;

        // Auto-close if specified
        const autoClose = data.autoCloseMs ?? (data.type === 'success' ? 5000 : 0);
        if (autoClose > 0) {
            setTimeout(() => this.closeDialog(), autoClose);
        }
    }

    /**
     * Shortcut: Show success notification
     */
    showSuccess(title: string, message: string, details?: string): void {
        this.show({ type: 'success', title, message, details });
    }

    /**
     * Shortcut: Show error notification
     */
    showError(title: string, message: string, details?: string): void {
        this.show({ type: 'error', title, message, details, autoCloseMs: 0 });
    }

    /**
     * Shortcut: Show warning notification
     */
    showWarning(title: string, message: string, details?: string): void {
        this.show({ type: 'warning', title, message, details, autoCloseMs: 0 });
    }

    // ============================================
    // PRESET NOTIFICATIONS (Admin Operations)
    // ============================================

    /** Product created successfully */
    showProductCreated(productName?: string): void {
        this.showSuccess(
            'Prodotto Creato',
            productName
                ? `Il prodotto "${productName}" è stato creato con successo.`
                : 'Il prodotto è stato creato con successo.',
            'Il prodotto è ora visibile nel catalogo.'
        );
    }

    /** Product updated successfully */
    showProductUpdated(productName?: string): void {
        this.showSuccess(
            'Prodotto Aggiornato',
            productName
                ? `Il prodotto "${productName}" è stato aggiornato con successo.`
                : 'Il prodotto è stato aggiornato con successo.'
        );
    }

    /** Product deleted successfully */
    showProductDeleted(): void {
        this.showSuccess(
            'Prodotto Eliminato',
            'Il prodotto è stato eliminato con successo.'
        );
    }

    /** Category created successfully */
    showCategoryCreated(categoryName?: string): void {
        this.showSuccess(
            'Categoria Creata',
            categoryName
                ? `La categoria "${categoryName}" è stata creata con successo.`
                : 'La categoria è stata creata con successo.'
        );
    }

    /** Generic operation failed */
    showOperationFailed(operation: string, errorDetails?: string): void {
        this.showError(
            'Operazione Fallita',
            `Impossibile completare l'operazione: ${operation}.`,
            errorDetails || 'Si prega di riprovare. Se il problema persiste, contattare il supporto.'
        );
    }

    /**
     * Close current dialog
     */
    private closeDialog(): void {
        if (this.currentDialog) {
            this.appRef.detachView(this.currentDialog.hostView);
            this.currentDialog.destroy();
            this.currentDialog = null;
        }
    }
}
