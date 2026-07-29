import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { NotificationItem, NotificationSummary } from '../models/notification.model';

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

  activeCategory: string = 'All';
  activeStatus: string = 'All';
  searchQuery: string = '';

  categories = ['All', 'Appointment', 'Clinical', 'Billing', 'Pharmacy', 'Compliance'];

  notifications: NotificationItem[] = [
    {
      notificationId: 101,
      userId: 1,
      message: 'Appointment #101 scheduled with Dr. Sarah Jenkins on 2026-07-28 10:00 AM.',
      category: 'Appointment',
      status: 'Unread',
      createdDate: '2026-07-26 09:30 AM',
      priority: 'High'
    },
    {
      notificationId: 102,
      userId: 1,
      message: 'Pharmacy Alert: Amoxicillin 500mg low stock (12 units remaining). Reorder level reached.',
      category: 'Pharmacy',
      status: 'Unread',
      createdDate: '2026-07-26 11:15 AM',
      priority: 'High'
    },
    {
      notificationId: 103,
      userId: 1,
      message: 'Billing Notice: Invoice #402 has an outstanding balance of $250.00 due on 2026-08-05.',
      category: 'Billing',
      status: 'Unread',
      createdDate: '2026-07-25 04:45 PM',
      priority: 'Medium'
    },
    {
      notificationId: 104,
      userId: 1,
      message: 'Clinical Update: Consultation #305 for Patient John Doe completed with Diagnosis: Routine Checkup.',
      category: 'Clinical',
      status: 'Read',
      createdDate: '2026-07-25 02:20 PM',
      priority: 'Low'
    },
    {
      notificationId: 105,
      userId: 1,
      message: 'Compliance Audit: User consent form updated for HIPAA Regulatory Alignment Policy 2026.',
      category: 'Compliance',
      status: 'Read',
      createdDate: '2026-07-24 10:00 AM',
      priority: 'Medium'
    },
    {
      notificationId: 106,
      userId: 1,
      message: 'Appointment Reminder: Telemedicine follow-up scheduled with Dr. Robert Vance on 2026-07-29 02:00 PM.',
      category: 'Appointment',
      status: 'Unread',
      createdDate: '2026-07-26 08:00 AM',
      priority: 'High'
    }
  ];

  ngOnInit(): void {}

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
    const item = this.notifications.find(n => n.notificationId === id);
    if (item) {
      item.status = 'Read';
    }
  }

  dismissNotification(id: number): void {
    const item = this.notifications.find(n => n.notificationId === id);
    if (item) {
      item.status = 'Dismissed';
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => {
      if (n.status === 'Unread') {
        n.status = 'Read';
      }
    });
  }
}
