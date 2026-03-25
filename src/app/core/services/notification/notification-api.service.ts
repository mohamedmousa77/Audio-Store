import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { Notification, UnreadCountResponse } from '../../models/notification';
import { API_ENDPOINTS } from '../constants/api-endpoints';

/**
 * Notification API Service
 * Layer HTTP puro — segue il pattern di order-api.service.ts
 * Tutte le chiamate vanno attraverso HttpService (non HttpClient diretto)
 */
@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  private http = inject(HttpService);

  // ── USER ENDPOINTS ────────────────────────────────────────────────────

  /**
   * GET api/notifications
   * Ritorna tutte le notifiche dell'utente autenticato
   */
  getMyNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(API_ENDPOINTS.notifications.base);
  }

  /**
   * GET api/notifications/unread-count
   */
  getUnreadCount(): Observable<UnreadCountResponse> {
    return this.http.get<UnreadCountResponse>(API_ENDPOINTS.notifications.unreadCount);
  }

  /**
   * PATCH api/notifications/{id}/read
   */
  markAsRead(id: number): Observable<void> {
    return this.http.patch<void>(API_ENDPOINTS.notifications.markAsRead(id), {});
  }

  /**
   * PATCH api/notifications/read-all
   */
  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(API_ENDPOINTS.notifications.markAllAsRead, {});
  }
}