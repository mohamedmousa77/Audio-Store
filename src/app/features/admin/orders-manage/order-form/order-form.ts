import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-form.html',
  styleUrl: './order-form.css',
})
export class OrderForm {
// Riceve l'ordine selezionato dalla riga della tabella
  @Input() order: any;
  
  // Notifica al padre il cambio di stato per aggiornare la lista principale
  @Output() statusUpdate = new EventEmitter<string>();

  @Output() cancel = new EventEmitter<void>();

  showSuccess = false;

  onUpdateStatus(newStatus: string): void {
    this.statusUpdate.emit(newStatus);
    
    // Feedback visivo come nel modello
    this.showSuccess = true;
    setTimeout(() => this.showSuccess = false, 3000);
  }
  onCancel(): void {
    this.cancel.emit();
  }
}
