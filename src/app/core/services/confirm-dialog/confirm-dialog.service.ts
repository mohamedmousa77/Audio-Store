import { Injectable, inject, ApplicationRef, createComponent, EnvironmentInjector } from '@angular/core';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

/**
 * Confirmation Dialog Service
 * Manages confirmation dialogs for user actions
 */
@Injectable({
    providedIn: 'root'
})
export class ConfirmDialogService {
    private appRef = inject(ApplicationRef);
    private injector = inject(EnvironmentInjector);
    private currentDialog: any = null;

    /**
     * Show confirmation dialog
     * @param data Dialog configuration
     * @returns Promise<boolean> - true if confirmed, false if canceled
     */
    showConfirm(data: ConfirmDialogData): Promise<boolean> {
        return new Promise((resolve) => {
            // Close existing dialog if any
            this.closeDialog();

            // Create component
            const componentRef = createComponent(ConfirmDialogComponent, {
                environmentInjector: this.injector
            });

            // Set data
            componentRef.instance.data = data;

            // Handle confirm
            componentRef.instance.confirm.subscribe(() => {
                this.closeDialog();
                resolve(true);
            });

            // Handle cancel
            componentRef.instance.cancel.subscribe(() => {
                this.closeDialog();
                resolve(false);
            });

            // Attach to application
            this.appRef.attachView(componentRef.hostView);
            const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
            document.body.appendChild(domElem);

            this.currentDialog = componentRef;
        });
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

    /**
     * Show remove item confirmation
     */
    async confirmRemoveItem(): Promise<boolean> {
        return this.showConfirm({
            title: 'Rimuovi Prodotto',
            message: 'Vuoi rimuovere questo prodotto dal carrello?',
            confirmText: 'Rimuovi',
            cancelText: 'Annulla',
            isDangerous: true
        });
    }

    /**
     * Show clear cart confirmation
     */
    async confirmClearCart(): Promise<boolean> {
        return this.showConfirm({
            title: 'Svuota Carrello',
            message: 'Vuoi svuotare completamente il carrello? Questa azione non può essere annullata.',
            confirmText: 'Svuota',
            cancelText: 'Annulla',
            isDangerous: true
        });
    }
}
