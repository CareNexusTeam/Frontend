import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { NotificationItem } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private http = inject(HttpClient);

  private readonly API_URL =
    'http://localhost:8082/api/notifications';

  public getActiveUserId(): number {

    const userId =
      localStorage.getItem('user_id') ??
      localStorage.getItem('userId');

    // if (userId && !isNaN(Number(userId))) {
    //   return Number(userId);
    // }

    return 1;
  }

  getUserNotifications(userId: number): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>(
      `${this.API_URL}/user/${userId}`
    );
  }

  getUnreadCount(userId: number): Observable<{ unreadCount: number }> {
    return this.http.get<{ unreadCount: number }>(
      `${this.API_URL}/unread-count/${userId}`
    );
  }

  markAsRead(id: number): Observable<NotificationItem> {
    return this.http.patch<NotificationItem>(
      `${this.API_URL}/${id}/read`,
      {}
    );
  }

  dismissNotification(id: number): Observable<NotificationItem> {
    return this.http.patch<NotificationItem>(
      `${this.API_URL}/${id}/dismiss`,
      {}
    );
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/${id}`
    );
  }
}