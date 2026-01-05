export type ConsentStatus = 'pending' | 'active' | 'revoked' | 'expired';
export type AccessLevel = 'view' | 'edit' | 'full_access';

export interface ConsentPermissions {
    view: boolean;
    edit: boolean;
    assessments: boolean;
    reports: boolean;
    iep: boolean;
}

export interface AuditLogEntry {
    action: string;
    timestamp: string;
    userId: string;
    details?: string;
}

export interface ConsentGrant {
    id: string;
    token: string;
    parentId: string;
    patientId: string;
    clinicianId?: string;
    permissions: ConsentPermissions;
    accessLevel: AccessLevel;
    status: ConsentStatus;
    grantedAt: string;
    activatedAt?: string;
    expiresAt?: string;
    revokedAt?: string;
    grantedByName: string;
    grantedByEmail: string;
    clinicianEmail?: string;
    notes?: string;
    auditLog: AuditLogEntry[];
    createdAt: string;
    updatedAt: string;
}

export interface GrantConsentData {
    patientId: string;
    clinicianEmail: string;
    permissions: ConsentPermissions;
    accessLevel: AccessLevel;
    expiresAt?: string;
    notes?: string;
}

export interface ClaimConsentData {
    token: string;
}

export interface UpdateConsentPermissionsData {
    permissions?: ConsentPermissions;
    accessLevel?: AccessLevel;
}

export interface RevokeConsentData {
    reason?: string;
}

export interface ConsentGrantWithDetails extends ConsentGrant {
    patientName?: string;
    clinicianName?: string;
    parentName?: string;
}
