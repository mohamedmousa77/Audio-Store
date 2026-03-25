import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Notification } from '../../models/notification';
import { NotificationApiService } from './notification-api.service';

/**
 * Notification Service
 * State management Signal-based — segue il pattern di order-services.ts
 *
 * ARCHITETTURA:
 * - Delega tutte le chiamate HTTP a NotificationApiService
 * - Usa Angular Signals per stato reattivo
 * - Usa firstValueFrom() per convertire Observable → Promise
 * - Non usa HttpClient direttamente (MAI)
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationApi = inject(NotificationApiService);

  // ============================================
  // STATE MANAGEMENT (Signals) — come OrderServices
  // ============================================
  private _notifications = signal<Notification[]>([]);
  private _unreadCount   = signal<number>(0);
  private _loading       = signal<boolean>(false);
  private _error         = signal<string | null>(null);

  // ── Public computed (readonly) ─────────────────────────────────────────
  readonly notifications = computed(() => this._notifications());
  readonly unreadCount   = computed(() => this._unreadCount());
  readonly loading       = computed(() => this._loading());
  readonly hasUnread     = computed(() => this._unreadCount() > 0);
  readonly unreadBadge   = computed(() => {
    const c = this._unreadCount();
    return c > 99 ? '99+' : c > 0 ? c.toString() : '';
  });

  // ============================================
  // USER OPERATIONS
  // ============================================

  /**
   * Carica tutte le notifiche utente
   * Chiamata a: GET api/notifications
   */
  async loadNotifications(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const data = await firstValueFrom(
        this.notificationApi.getMyNotifications()
      );
      this._notifications.set(data ?? []);
      // Aggiorna anche il contatore unread dal result
      const unread = (data ?? []).filter(n => !n.isRead).length;
      this._unreadCount.set(unread);
      console.log(`✅ Loaded ${data?.length ?? 0} notifications`);
    } catch (err) {
      console.error('Error loading notifications:', err);
      this._error.set('Failed to load notifications');
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Aggiorna solo il contatore unread (leggero, usato per il polling)
   * Chiamata a: GET api/notifications/unread-count
   */
  async loadUnreadCount(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.notificationApi.getUnreadCount()
      );
      this._unreadCount.set(res?.count ?? 0);
    } catch (err) {
      console.error('Error loading unread count:', err);
    }
  }

  /**
   * Segna una notifica come letta (con aggiornamento ottimistico)
   * Chiamata a: PATCH api/notifications/{id}/read
   */
  async markAsRead(notificationId: number): Promise<void> {
    try {
      await firstValueFrom(
        this.notificationApi.markAsRead(notificationId)
      );
      // Aggiornamento ottimistico locale — nessun reload necessario
      this._notifications.update(list =>
        list.map(n =>
          n.id === notificationId
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
        )
      );
      this._unreadCount.update(c => Math.max(0, c - 1));
      console.log(`✅ Notification ${notificationId} marked as read`);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }

  /**
   * Segna tutte le notifiche come lette
   * Chiamata a: PATCH api/notifications/read-all
   */
  async markAllAsRead(): Promise<void> {
    try {
      await firstValueFrom(
        this.notificationApi.markAllAsRead()
      );
      // Aggiornamento ottimistico — tutte isRead: true
      this._notifications.update(list =>
        list.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
      this._unreadCount.set(0);
      console.log('✅ All notifications marked as read');
    } catch (err) {
      console.error('Error marking all as read:', err);
      this._error.set('Failed to mark all as read');
    }
  }

  // ============================================
  // HELPERS
  // ============================================

  /** Pulisce lo stato al logout */
  clearNotifications(): void {
    this._notifications.set([]);
    this._unreadCount.set(0);
    this._error.set(null);
  }
}