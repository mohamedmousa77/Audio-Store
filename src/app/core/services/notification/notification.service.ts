import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Notification, UnreadCountResponse } from '../../models/notification';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/notifications`;

  // ── Signals ──────────────────────────────────────────────────────────────
  private _notifications = signal<Notification[]>([]);
  private _unreadCount   = signal<number>(0);
  private _loading       = signal<boolean>(false);

  // ── Public computed ───────────────────────────────────────────────────────
  readonly notifications = this._notifications.asReadonly();
  readonly unreadCount   = this._unreadCount.asReadonly();
  readonly loading       = this._loading.asReadonly();
  readonly hasUnread     = computed(() => this._unreadCount() > 0);

  // ── API calls ─────────────────────────────────────────────────────────────

  async loadNotifications(): Promise<void> {
    this._loading.set(true);
    try {
      const data = await firstValueFrom(
        this.http.get<Notification[]>(this.baseUrl)
      );
      this._notifications.set(data ?? []);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      this._loading.set(false);
    }
  }

  async loadUnreadCount(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<UnreadCountResponse>(`${this.baseUrl}/unread-count`)
      );
      this._unreadCount.set(res?.count ?? 0);
    } catch (err) {
      console.error('Error loading unread count:', err);
    }
  }

  async markAsRead(notificationId: number): Promise<void> {
    try {
      await firstValueFrom(
        this.http.patch(`${this.baseUrl}/${notificationId}/read`, {})
      );
      // Update local state immediately — no need for full reload
      this._notifications.update(list =>
        list.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      this._unreadCount.update(c => Math.max(0, c - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.patch(`${this.baseUrl}/read-all`, {})
      );
      this._notifications.update(list =>
        list.map(n => ({ ...n, isRead: true }))
      );
      this._unreadCount.set(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  }
}