export type AccountStatus = 'active' | 'suspended' | 'deleted';

export interface Parent {
    id: string;
    userId: string;
    phone?: string;
    phoneVerified: boolean;
    emergencyContact?: string;
    emergencyPhone?: string;
    preferredLanguage: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    accountStatus: AccountStatus;
    lastLoginAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateParentData {
    email: string;
    password: string;
    phone?: string;
    preferredLanguage?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
}

export interface UpdateParentData {
    phone?: string;
    preferredLanguage?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
}

export interface ParentProfile extends Parent {
    email: string;
    childrenCount?: number;
}
