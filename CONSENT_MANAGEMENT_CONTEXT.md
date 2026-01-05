# CONSENT_MANAGEMENT: Build Access Sharing - CONTEXT

## Overview

**Feature:** Consent Management & Access Sharing  
**Phase:** Parent Portal - Core Features  
**Time Estimate:** 3-4 hours  
**Complexity:** Medium  
**Priority:** 🔴 HIGH - Enables parent-clinician collaboration

---

## Objective

Build a complete consent management system allowing parents to share access to their child's information with clinicians, manage permissions, and track active access grants.

---

## What This Feature Does

### **Parent Perspective**

**Parents can:**
- Share their child's information with clinicians
- Generate secure access tokens
- Set granular permissions (view demographics, view screenings, etc.)
- View all active access grants
- Revoke access anytime
- Track when access was granted/activated

### **Token-Based Workflow**

```
Parent → Generate Access Token → Share with Clinician
                ↓
Clinician receives token → Claims access
                ↓
Parent gets notification → Access activated
                ↓
Clinician can now view child's information
```

---

## Current Database State

You already have **7+ seeded access grants** ready for testing:

```sql
access_grants table:
  - grantor_type: 'parent'
  - grantor_id: parent's ID
  - grantee_type: 'clinician'
  - grantee_id: clinician's ID (or null if pending)
  - person_id: child's ID
  - permissions: JSON object
  - access_level: 'view' | 'edit'
  - status: 'pending' | 'active' | 'revoked' | 'expired'
  - token: 8-character unique code
  - token_expires_at: expiry timestamp
  - granted_at, activated_at, revoked_at, expires_at
```

**Example Seeded Grants:**
```
Sunita Sharma → Dr. Anjali Patel (for Aarav) - Active
Rajesh Patel → Dr. Anjali Patel (for Arjun) - Active
Priya Desai → Dr. Rajesh Kumar (for Diya) - Pending
... 4 more grants
```

---

## User Interface Components

### **1. Consent Dashboard** (Main View)

**Location:** `/consent` or `/access-management`

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Access & Consent Management                │
├─────────────────────────────────────────────┤
│                                             │
│  [Share Access Button]                      │
│                                             │
│  Active Access Grants (3)                   │
│  ┌───────────────────────────────────────┐ │
│  │ 👨‍⚕️ Dr. Anjali Patel                    │ │
│  │ Child: Aarav Sharma                    │ │
│  │ Granted: Jan 2, 2026                   │ │
│  │ Permissions: Full Access               │ │
│  │ Status: Active ✓                       │ │
│  │ [View Details] [Revoke Access]         │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Pending Grants (1)                         │
│  ┌───────────────────────────────────────┐ │
│  │ 📧 dr.kumar@clinic.com                 │ │
│  │ Child: Diya Desai                      │ │
│  │ Token: ABC123XY                        │ │
│  │ Expires: Jan 10, 2026                  │ │
│  │ [Copy Token] [Resend] [Cancel]         │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Revoked Access (2)                         │
│  └─ Collapsed, expandable                  │
└─────────────────────────────────────────────┘
```

---

### **2. Share Access Modal/Page**

**Triggered by:** "Share Access" button

**Form Fields:**
```
┌─────────────────────────────────────────────┐
│  Share Child's Information                  │
├─────────────────────────────────────────────┤
│                                             │
│  Select Child: *                            │
│  [Dropdown: Aarav, Ananya]                 │
│                                             │
│  Clinician Email: *                         │
│  [Input: clinician@example.com]            │
│                                             │
│  Permissions:                               │
│  ☑ View Demographics                       │
│  ☑ View Medical History                    │
│  ☑ View Screenings                         │
│  ☑ View Assessments                        │
│  ☑ View Reports                            │
│  ☐ Edit Notes                              │
│                                             │
│  Access Level: *                            │
│  ⦿ View Only                               │
│  ○ View & Comment                          │
│                                             │
│  Valid Until: (Optional)                    │
│  [Date Picker: Default 90 days]            │
│                                             │
│  ─────────────────────────────────          │
│  [Cancel]  [Generate Access Token]         │
└─────────────────────────────────────────────┘
```

---

### **3. Token Generated Success**

**After submission:**
```
┌─────────────────────────────────────────────┐
│  ✓ Access Token Generated                   │
├─────────────────────────────────────────────┤
│                                             │
│  Share this token with:                     │
│  dr.anjali@clinic.com                       │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │         ABC123XY                       │ │
│  │  [Copy Token]  [Share via Email]       │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Valid until: January 10, 2026              │
│                                             │
│  The clinician will use this token to       │
│  claim access to Aarav's information.       │
│                                             │
│  ⚠️ This token will expire in 7 days if not │
│     claimed.                                │
│                                             │
│  [Done]  [Create Another]                   │
└─────────────────────────────────────────────┘
```

---

### **4. Access Grant Details Modal**

**When clicking "View Details":**
```
┌─────────────────────────────────────────────┐
│  Access Grant Details                       │
├─────────────────────────────────────────────┤
│                                             │
│  Clinician: Dr. Anjali Patel                │
│  Specialization: Developmental Pediatrics   │
│  Email: anjali.patel@daira.com             │
│                                             │
│  Child: Aarav Sharma                        │
│  Age: 4 years                               │
│                                             │
│  Status: Active ✓                           │
│  Granted: January 2, 2026                   │
│  Activated: January 2, 2026                 │
│  Expires: April 2, 2026 (in 88 days)       │
│                                             │
│  Permissions Granted:                       │
│  ✓ View Demographics                        │
│  ✓ View Medical History                     │
│  ✓ View Screenings                          │
│  ✓ View Assessments                         │
│  ✓ View Reports                             │
│  ✗ Edit Notes                               │
│                                             │
│  Access Level: View Only                    │
│                                             │
│  Last Accessed: January 3, 2026             │
│                                             │
│  ─────────────────────────────────          │
│  [Close]  [Revoke Access]                   │
└─────────────────────────────────────────────┘
```

---

### **5. Revoke Confirmation**

**When clicking "Revoke Access":**
```
┌─────────────────────────────────────────────┐
│  ⚠️ Revoke Access?                          │
├─────────────────────────────────────────────┤
│                                             │
│  Are you sure you want to revoke access     │
│  for Dr. Anjali Patel to view Aarav's      │
│  information?                               │
│                                             │
│  This action cannot be undone. The          │
│  clinician will immediately lose access     │
│  to all information.                        │
│                                             │
│  ─────────────────────────────────          │
│  [Cancel]  [Yes, Revoke Access]            │
└─────────────────────────────────────────────┘
```

---

## API Endpoints Needed

### **Backend Endpoints** (To be created/verified)

```typescript
// Get all access grants for parent's children
GET /api/v1/parent/access-grants
Response: {
  success: true,
  data: [
    {
      id: "grant-123",
      childId: "person-456",
      childName: "Aarav Sharma",
      clinicianId: "clinic-789",
      clinicianName: "Dr. Anjali Patel",
      clinicianEmail: "anjali.patel@daira.com",
      status: "active",
      permissions: { ... },
      grantedAt: "2026-01-02T10:00:00Z",
      activatedAt: "2026-01-02T11:30:00Z",
      expiresAt: "2026-04-02T10:00:00Z"
    }
  ]
}

// Create new access grant
POST /api/v1/parent/access-grants
Body: {
  childId: "person-456",
  clinicianEmail: "doctor@example.com",
  permissions: {
    viewDemographics: true,
    viewMedical: true,
    viewScreenings: true,
    viewAssessments: true,
    viewReports: true,
    editNotes: false
  },
  accessLevel: "view",
  expiresAt: "2026-04-02" // optional
}
Response: {
  success: true,
  data: {
    id: "grant-123",
    token: "ABC123XY",
    tokenExpiresAt: "2026-01-09T10:00:00Z"
  }
}

// Revoke access grant
DELETE /api/v1/parent/access-grants/:grantId
Response: {
  success: true,
  message: "Access revoked successfully"
}

// Get single access grant details
GET /api/v1/parent/access-grants/:grantId
Response: {
  success: true,
  data: { /* full grant details */ }
}
```

---

## Frontend Components Structure

```
src/
├── pages/
│   └── ConsentManagement.tsx         // Main page
│
├── components/
│   └── consent/
│       ├── AccessGrantList.tsx       // List of grants
│       ├── AccessGrantCard.tsx       // Single grant card
│       ├── ShareAccessModal.tsx      // Share access form
│       ├── TokenDisplay.tsx          // Show generated token
│       ├── GrantDetailsModal.tsx     // Grant details view
│       └── RevokeConfirmModal.tsx    // Revoke confirmation
│
└── services/
    └── consent.service.ts            // API calls
```

---

## State Management

```typescript
// Consent Management State
interface ConsentState {
  grants: AccessGrant[];
  loading: boolean;
  error: string | null;
  selectedGrant: AccessGrant | null;
  generatedToken: string | null;
  filter: 'all' | 'active' | 'pending' | 'revoked';
}

interface AccessGrant {
  id: string;
  childId: string;
  childName: string;
  clinicianId?: string;
  clinicianName?: string;
  clinicianEmail: string;
  status: 'pending' | 'active' | 'revoked' | 'expired';
  permissions: {
    viewDemographics: boolean;
    viewMedical: boolean;
    viewScreenings: boolean;
    viewAssessments: boolean;
    viewReports: boolean;
    editNotes: boolean;
  };
  accessLevel: 'view' | 'edit';
  token?: string;
  tokenExpiresAt?: string;
  grantedAt: string;
  activatedAt?: string;
  revokedAt?: string;
  expiresAt?: string;
  lastAccessedAt?: string;
}
```

---

## User Flows

### **Flow 1: Parent Shares Access (Happy Path)**

```
1. Parent clicks "Share Access"
2. Modal opens with form
3. Parent selects:
   - Child: Aarav
   - Email: anjali.patel@daira.com
   - Permissions: All view permissions
   - Access level: View Only
4. Parent clicks "Generate Access Token"
5. System creates grant with status='pending'
6. Token generated: "ABC123XY"
7. Success modal shows token
8. Parent copies token or sends email
9. Grant appears in "Pending" section
10. Parent closes modal
```

---

### **Flow 2: Clinician Claims Token (Backend)**

```
1. Clinician receives token
2. Clinician logs into system
3. Clinician enters token in their portal
4. System validates token:
   - Token exists
   - Token not expired
   - Token not already claimed
5. System updates grant:
   - status: 'pending' → 'active'
   - grantee_id: clinician's ID
   - activated_at: current timestamp
6. Parent's dashboard updates automatically
7. Grant moves from "Pending" to "Active"
```

---

### **Flow 3: Parent Views Grant Details**

```
1. Parent clicks "View Details" on grant
2. Modal opens showing:
   - Clinician info
   - Child info
   - Status & dates
   - Permissions granted
   - Last access time
3. Parent can revoke from here
```

---

### **Flow 4: Parent Revokes Access**

```
1. Parent clicks "Revoke Access"
2. Confirmation modal appears
3. Parent confirms revocation
4. System updates grant:
   - status: 'active' → 'revoked'
   - revoked_at: current timestamp
5. Grant moves to "Revoked" section
6. Clinician immediately loses access
7. Success notification shown
```

---

## Design Specifications

### **Colors & Icons**

```typescript
// Status colors
const statusColors = {
  active: '#10B981',    // Green
  pending: '#F59E0B',   // Amber
  revoked: '#EF4444',   // Red
  expired: '#6B7280'    // Gray
};

// Icons
import { 
  Shield,           // Main consent icon
  Share2,           // Share access
  UserCheck,        // Active grant
  Clock,            // Pending
  XCircle,          // Revoked
  Eye,              // View permission
  Edit3,            // Edit permission
  Copy,             // Copy token
  Mail,             // Send email
  AlertTriangle     // Warning
} from 'lucide-react';
```

---

### **Responsive Behavior**

**Desktop (≥1024px):**
- Side-by-side cards (2 columns)
- Modal width: 600px

**Tablet (768px - 1023px):**
- Single column cards
- Modal width: 500px

**Mobile (<768px):**
- Full-width cards
- Full-screen modals
- Stack all elements vertically

---

## Validation Rules

### **Share Access Form**

```typescript
const validationRules = {
  childId: {
    required: true,
    message: "Please select a child"
  },
  clinicianEmail: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address"
  },
  permissions: {
    validate: (perms) => Object.values(perms).some(v => v === true),
    message: "Please grant at least one permission"
  },
  expiresAt: {
    validate: (date) => !date || new Date(date) > new Date(),
    message: "Expiry date must be in the future"
  }
};
```

---

## Error Handling

### **Common Errors**

```typescript
// Email already has access
{
  error: "DUPLICATE_GRANT",
  message: "This clinician already has access to this child"
}

// Token expired
{
  error: "TOKEN_EXPIRED",
  message: "This access token has expired"
}

// Token already claimed
{
  error: "TOKEN_CLAIMED",
  message: "This token has already been claimed"
}

// Grant not found
{
  error: "GRANT_NOT_FOUND",
  message: "Access grant not found"
}

// Cannot revoke (already revoked)
{
  error: "ALREADY_REVOKED",
  message: "This access has already been revoked"
}
```

---

## Testing Scenarios

### **With Seeded Data**

**Test 1: View Existing Grants**
```
Login: sunita.sharma@test.com
Expected: See active grant for Dr. Anjali (Aarav)
```

**Test 2: Create New Grant**
```
Login: rajesh.patel@test.com
Child: Arjun
Email: meera.desai@daira.com
Expected: Token generated successfully
```

**Test 3: Revoke Access**
```
Login: priya.desai@test.com
Grant: Dr. Rajesh Kumar (Diya)
Expected: Access revoked, status updated
```

**Test 4: View Details**
```
Login: sunita.sharma@test.com
Grant: Dr. Anjali (Aarav)
Expected: Full details displayed
```

---

## Success Metrics

**Feature Complete When:**
- ✅ Parents can view all access grants
- ✅ Parents can share access with email
- ✅ Token generated and displayed
- ✅ Parents can copy/share token
- ✅ Parents can view grant details
- ✅ Parents can revoke access
- ✅ Status filtering works (active/pending/revoked)
- ✅ Responsive on all devices
- ✅ Error handling for all cases
- ✅ Loading states displayed

---

## Expected Outcomes

After completion:
- ✅ Complete consent management UI
- ✅ Token-based access sharing
- ✅ Permission management
- ✅ Grant lifecycle (pending → active → revoked)
- ✅ Parent-clinician collaboration enabled
- ✅ ~3-4 hours development time

---

**Status:** Ready for Activation  
**Next:** CONSENT_MANAGEMENT_ACTIVATION.md - Step-by-step implementation
