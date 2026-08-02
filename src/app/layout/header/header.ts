import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth-service';
import { NotificationService } from '../../features/notifications/services/notification.service';
import { NotificationItem } from '../../features/notifications/models/notification.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {

  isNotificationDropdownOpen: boolean = false;
  notifications: NotificationItem[] = [];
  unreadCount: number = 0;
  isLoading: boolean = false;

  constructor(
    public authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && this.authService.isLoggedIn()) {
      this.fetchNotifications();
      this.fetchUnreadCount();
    }
  }

  toggleNotificationDropdown(): void {
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
    if (this.isNotificationDropdownOpen) {
      this.fetchNotifications();
    }
  }

  fetchUnreadCount(): void {
    const activeUserId = this.notificationService.getActiveUserId();
    this.notificationService.getUnreadCount(activeUserId).subscribe({
      next: (res) => {
        if (res && typeof res.unreadCount === 'number') {
          this.unreadCount = res.unreadCount;
        } else {
          this.updateCounts();
        }
      },
      error: () => {
        this.updateCounts();
      }
    });
  }

  fetchNotifications(): void {
    this.isLoading = true;
    const activeUserId = this.notificationService.getActiveUserId();

    this.notificationService.getUserNotifications(activeUserId).subscribe({
      next: (res) => {
        this.notifications = Array.isArray(res) ? res : [];
        this.updateCounts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Backend notification fetch error:', err);
        this.notifications = [];
        this.updateCounts();
        this.isLoading = false;
      }
    });
  }

  markAsRead(id: number, event: Event): void {
    event.stopPropagation();
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        const item = this.notifications.find(n => n.notificationId === id);
        if (item) item.status = 'Read';
        this.updateCounts();
      },
      error: () => {
        const item = this.notifications.find(n => n.notificationId === id);
        if (item) item.status = 'Read';
        this.updateCounts();
      }
    });
  }

  dismissNotification(id: number, event: Event): void {
    event.stopPropagation();
    this.notificationService.dismissNotification(id).subscribe({
      next: () => {
        const item = this.notifications.find(n => n.notificationId === id);
        if (item) item.status = 'Dismissed';
        this.updateCounts();
      },
      error: () => {
        const item = this.notifications.find(n => n.notificationId === id);
        if (item) item.status = 'Dismissed';
        this.updateCounts();
      }
    });
  }

  deleteNotification(id: number, event: Event): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.notificationId !== id);
        this.updateCounts();
      },
      error: () => {
        this.notifications = this.notifications.filter(n => n.notificationId !== id);
        this.updateCounts();
      }
    });
  }

  private updateCounts(): void {
    this.unreadCount = this.notifications.filter(n => n.status === 'Unread').length;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}