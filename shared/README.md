# @daira/shared

Shared TypeScript interfaces for the Daira clinical platform.

## Overview

This package provides a single source of truth for all data structures used across the Daira platform:
- Backend API
- Parent Frontend
- Clinician Frontend

## Installation

```bash
# From backend
npm install ../shared

# From frontend-parent
npm install ../shared

# From Frontend-clinician
npm install ../shared
```

## Usage

```typescript
import { 
  Child, 
  Patient, 
  PEP, 
  ConsentGrant,
  ParentScreening,
  ApiResponse 
} from '@daira/shared';

// Use in API responses
const response: ApiResponse<Child[]> = {
  success: true,
  data: children
};

// Use in component props
interface ChildCardProps {
  child: Child;
  onEdit: (data: UpdateChildData) => void;
}

// Use in API calls
const createChild = async (data: CreateChildData): Promise<ApiResponse<Child>> => {
  // ...
};
```

## Available Interfaces

### Authentication & Users
- `User`, `UserRole`, `UserStatus`
- `LoginCredentials`, `RegisterData`, `AuthResponse`
- `RefreshToken`

### Parent Portal
- `Parent`, `ParentProfile`, `AccountStatus`
- `CreateParentData`, `UpdateParentData`

### Child Management
- `Child`, `ChildWithStats`
- `CreateChildData`, `UpdateChildData`

### Patient Management
- `Patient`, `PatientStatus`
- `CreatePatientData`, `UpdatePatientData`
- `ParentChild`, `RelationshipType`

### Consent System
- `ConsentGrant`, `ConsentStatus`, `AccessLevel`
- `ConsentPermissions`, `AuditLogEntry`
- `GrantConsentData`, `ClaimConsentData`

### Screening
- `ParentScreening`, `ScreeningType`, `ScreeningStatus`
- `ScreeningResponse`, `MChatQuestion`, `ASQQuestion`
- `StartScreeningData`, `SubmitResponseData`

### PEP (Personalized Education Plan)
- `PEP`, `PEPGoal`, `PEPActivity`
- `ActivityCompletion`, `PEPGoalProgress`
- `CreatePEPData`, `CreatePEPActivityData`
- `RecordCompletionData`, `PEPProgress`

### IEP (Individualized Education Plan)
- `IEP`, `IEPGoal`, `IEPObjective`
- `GoalProgressUpdate`, `IEPAccommodation`
- `IEPService`, `IEPTeamMember`, `IEPProgressReport`

### Assessments
- `Assessment`, `AssessmentType`, `AssessmentStatus`
- `AssessmentEvidence`, `SeverityLevel`
- `CreateAssessmentData`, `CompleteAssessmentData`

### Journal
- `JournalEntry`, `JournalEntryType`, `JournalVisibility`
- `JournalAttachment`
- `CreateJournalEntryData`, `JournalFilters`

### Resources
- `Resource`, `ResourceType`, `ResourceCategory`
- `CreateResourceData`, `ResourceFilters`

### Notifications
- `Notification`, `NotificationType`, `NotificationPriority`
- `CreateNotificationData`, `NotificationStats`

### Messages
- `Conversation`, `Message`
- `CreateConversationData`, `SendMessageData`

### Common Types
- `ApiResponse<T>`, `ErrorResponse`, `PaginatedResponse<T>`
- `IdParam`, `DateRange`

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Watch mode for development
npm run watch
```

## Build Output

After running `npm run build`, the `dist/` folder will contain:
- `index.js` - Compiled JavaScript
- `index.d.ts` - TypeScript declarations
- `interfaces/*.js` - Individual interface files
- `interfaces/*.d.ts` - Individual declaration files

## Type Safety

This package ensures type safety across the entire platform:
- ✅ Consistent field names (camelCase)
- ✅ Proper nullable field handling
- ✅ String unions for enums
- ✅ JSON field typing
- ✅ Request/Response types
- ✅ Matches database schema exactly

## Version

Current version: 1.0.0

## License

MIT
