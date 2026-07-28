export type NotificationCategory = 'Appointment' | 'Clinical' | 'Billing' | 'Pharmacy' | 'Compliance';
export type NotificationStatus = 'Unread' | 'Read' | 'Dismissed';

export interface NotificationItem {
  notificationId: number;
  userId: number;
  message: string;
  category: NotificationCategory;
  status: NotificationStatus;
  createdDate: string;
  priority?: 'High' | 'Medium' | 'Low';
  actionUrl?: string;
}

export interface NotificationSummary {
  total: number;
  unread: number;
  read: number;
  critical: number;
}
