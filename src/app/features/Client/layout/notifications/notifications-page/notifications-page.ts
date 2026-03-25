import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../../../../core/services/notification/notification-service';
import { ClientHeader } from '../../client-header/client-header';
import { ClientFooter } from '../../client-footer/client-footer';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ClientHeader, ClientFooter],
  templateUrl: './notifications-page.html',
  styleUrl: './notifications-page.css'
})
export class NotificationsPage implements OnInit {
  private notificationService = inject(NotificationService);

  notifications = this.notificationService.notifications;
  loading       = this.notificationService.loading;
  unreadCount   = this.notificationService.unreadCount;
  hasUnread     = this.notificationService.hasUnread;

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.notificationService.loadNotifications();
  }

  async markAsRead(id: number): Promise<void> {
    await this.notificationService.markAsRead(id);
  }

  async markAllAsRead(): Promise<void> {
    await this.notificationService.markAllAsRead();
  }

  getNotifIcon(type: string): string {
    const icons: Record<string, string> = {
      AbandonedCart:  '🛒',
      OrderConfirmed: '✅',
      OrderShipped:   '🚚',
      OrderDelivered: '📦',
      PromoCode:      '🎁',
      StockAlert:     '⚠️'
    };
    return icons[type] ?? '🔔';
  }
}