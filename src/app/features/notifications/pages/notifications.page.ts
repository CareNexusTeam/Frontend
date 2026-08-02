import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { NotificationItem, NotificationSummary } from '../models/notification.model';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../../../core/auth/auth-service';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MainLayoutComponent
  ],
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.css']
})
export class NotificationsPageComponent implements OnInit {

  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  activeCategory: string = 'All';
  activeStatus: string = 'All';
  searchQuery: string = '';
  isLoading: boolean = false;

  categories = ['All', 'Appointment', 'Clinical', 'Billing', 'Pharmacy', 'Compliance'];
  notifications: NotificationItem[] = [];

  ngOnInit(): void {
    this.loadUserNotifications();
  }

  loadUserNotifications(): void {
    this.isLoading = true;
    const activeUserId = this.notificationService.getActiveUserId();

    this.notificationService.getUserNotifications(activeUserId).subscribe({
      next: (res) => {
        this.notifications = Array.isArray(res) ? res : [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching backend notifications:', err);
        this.notifications = [];
        this.isLoading = false;
      }
    });
  }

  get summary(): NotificationSummary {
    const total = this.notifications.filter(n => n.status !== 'Dismissed').length;
    const unread = this.notifications.filter(n => n.status === 'Unread').length;
    const read = this.notifications.filter(n => n.status === 'Read').length;
    const critical = this.notifications.filter(n => n.priority === 'High' && n.status !== 'Dismissed').length;
    return { total, unread, read, critical };
  }

  get filteredNotifications(): NotificationItem[] {
    return this.notifications.filter(n => {
      if (n.status === 'Dismissed') return false;
      const matchesCategory = this.activeCategory === 'All' || n.category === this.activeCategory;
      const matchesStatus = this.activeStatus === 'All' || n.status === this.activeStatus;
      const matchesSearch = !this.searchQuery || n.message.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }

  setCategory(category: string): void {
    this.activeCategory = category;
  }

  setStatusFilter(status: string): void {
    this.activeStatus = status;
  }

  markAsRead(id: number): void {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        const item = this.notifications.find(n => n.notificationId === id);
        if (item) item.status = 'Read';
      },
      error: () => {
        const item = this.notifications.find(n => n.notificationId === id);
        if (item) item.status = 'Read';
      }
    });
  }

  dismissNotification(id: number): void {
    this.notificationService.dismissNotification(id).subscribe({
      next: () => {
        const item = this.notifications.find(n => n.notificationId === id);
        if (item) item.status = 'Dismissed';
      },
      error: () => {
        const item = this.notifications.find(n => n.notificationId === id);
        if (item) item.status = 'Dismissed';
      }
    });
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => {
      if (n.status === 'Unread') {
        this.markAsRead(n.notificationId);
      }
    });
  }
}
