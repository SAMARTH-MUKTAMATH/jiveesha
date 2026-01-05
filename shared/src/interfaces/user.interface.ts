export type UserRole = 'clinician' | 'parent';
export type UserStatus = 'active' | 'inactive' | 'pending_verification';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    emailVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationExpires?: string;
    passwordResetToken?: string;
    passwordResetExpires?: string;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
    deletedAt?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: 'Bearer';
    expires_in: number;
    user: User;
}

export interface RefreshToken {
    id: string;
    userId: string;
    token: string;
    expiresAt: string;
    createdAt: string;
    revokedAt?: string;
    ipAddress?: string;
    userAgent?: string;
}

export interface VerifyEmailData {
    token: string;
}

export interface ResetPasswordData {
    token: string;
    newPassword: string;
}

export interface ForgotPasswordData {
    email: string;
}
