import { Injectable, inject, ApplicationRef, createComponent, EnvironmentInjector } from '@angular/core';
import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';

/**
 * Error Dialog Data
 */
export interface ErrorDialogData {
    title: string;
    message: string;
    details?: string;
    canRetry?: boolean;
    isCritical?: boolean; // If true, app should stop/reload
}

/**
 * Error Dialog Service (Custom - No Material)
 * Manages error dialogs for critical and non-critical errors
 * 
 * Usage:
 * - Server unavailable: showServerUnavailable()
 * - Network errors: showNetworkError()
 * - Auth errors: showAuthError()
 * - Custom errors: showError(data)
 */
@Injectable({
    providedIn: 'root'
})
export class ErrorDialogService {
    private appRef = inject(ApplicationRef);
    private injector = inject(EnvironmentInjector);
    private currentDialog: any = null;

    /**
     * Show error dialog
     * @param data Error dialog configuration
     */
    showError(data: ErrorDialogData): void {
        // Close existing dialog if any
        this.closeDialog();

        // Create component
        const componentRef = createComponent(ErrorDialogComponent, {
            environmentInjector: this.injector
        });

        // Set data
        componentRef.instance.data = data;
        componentRef.instance.onClose = (result?: string) => {
            this.closeDialog();
            if (result === 'retry') {
                // Handle retry if needed
                console.log('User clicked retry');
            }
        };

        // Attach to application
        this.appRef.attachView(componentRef.hostView);
        const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);

        this.currentDialog = componentRef;
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
     * Show server unavailable error (critical)
     * Displayed when backend is not reachable (HTTP status 0)
     */
    showServerUnavailable(): void {
        this.showError({
            title: 'Server Non Disponibile',
            message: 'Impossibile connettersi al server. Verifica che il backend sia attivo.',
            details: 'Il server potrebbe essere offline o non raggiungibile. Controlla che il backend sia in esecuzione su http://localhost:5000',
            canRetry: true,
            isCritical: true
        });
    }

    /**
     * Show network error (non-critical)
     * Displayed when there are network connectivity issues
     */
    showNetworkError(): void {
        this.showError({
            title: 'Errore di Rete',
            message: 'Verifica la tua connessione internet e riprova.',
            details: 'La richiesta non è stata completata a causa di problemi di rete.',
            canRetry: true,
            isCritical: false
        });
    }

    /**
     * Show authentication error (non-critical)
     * Displayed when JWT token is expired or invalid
     */
    showAuthError(): void {
        this.showError({
            title: 'Sessione Scaduta',
            message: 'La tua sessione è scaduta. Effettua nuovamente il login.',
            details: 'Per motivi di sicurezza, la sessione ha una durata limitata.',
            canRetry: false,
            isCritical: false
        });
    }

    /**
     * Show internal server error (non-critical)
     * Displayed when backend returns 500+ errors
     */
    showInternalServerError(errorMessage?: string): void {
        this.showError({
            title: 'Errore del Server',
            message: 'Si è verificato un errore interno del server.',
            details: errorMessage || 'Il server ha riscontrato un problema durante l\'elaborazione della richiesta.',
            canRetry: true,
            isCritical: false
        });
    }

    /**
     * Show forbidden error (non-critical)
     * Displayed when user doesn't have permission
     */
    showForbiddenError(): void {
        this.showError({
            title: 'Accesso Negato',
            message: 'Non hai i permessi necessari per accedere a questa risorsa.',
            details: 'Contatta l\'amministratore se ritieni di dover avere accesso.',
            canRetry: false,
            isCritical: false
        });
    }

    /**
     * Show not found error (non-critical)
     * Displayed when resource is not found (404)
     */
    showNotFoundError(resource?: string): void {
        this.showError({
            title: 'Risorsa Non Trovata',
            message: `${resource || 'La risorsa richiesta'} non è stata trovata.`,
            details: 'La risorsa potrebbe essere stata eliminata o spostata.',
            canRetry: false,
            isCritical: false
        });
    }
}
