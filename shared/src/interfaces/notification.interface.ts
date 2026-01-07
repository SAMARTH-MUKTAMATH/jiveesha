export type NotificationType = 'appointment_reminder' | 'assessment_complete' | 'message_received' | 'consent_granted' | 'screening_complete' | 'pep_update' | 'iep_update' | 'system';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';
export type NotificationCategory = 'appointments' | 'messages' | 'assessments' | 'system' | 'consent' | 'screening' | 'pep' | 'iep';
export type UserType = 'clinician' | 'parent' | 'admin';

export interface Notification {
    id: string;
    userId: string;
    userType: UserType;
    notificationType: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
    actionData?: Record<string, any>;
    priority: NotificationPriority;
    category?: NotificationCategory;
    isRead: boolean;
    readAt?: string;
    sentVia: string[];
    createdAt: string;
    expiresAt?: string;
}

export interface CreateNotificationData {
    userId: string;
    userType: UserType;
    notificationType: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
    actionData?: Record<string, any>;
    priority?: NotificationPriority;
    category?: NotificationCategory;
    sentVia?: string[];
    expiresAt?: string;
}

export interface MarkAsReadData {
    notificationIds: string[];
}

export interface NotificationFilters {
    notificationType?: NotificationType;
    category?: NotificationCategory;
    priority?: NotificationPriority;
    isRead?: boolean;
    startDate?: string;
    endDate?: string;
}

export interface NotificationStats {
    total: number;
    unread: number;
    byCategory: Record<NotificationCategory, number>;
    byPriority: Record<NotificationPriority, number>;
}
