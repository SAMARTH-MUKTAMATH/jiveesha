# BACKEND_02: Transformation Layer - UPDATED FOR UNIFIED SCHEMA

## Overview

**Prompt:** BACKEND_02  
**Phase:** 1 - Backend Integration  
**Step:** 2 of 3  
**Time Estimate:** 3-4 hours  
**Complexity:** Medium  
**Priority:** 🟡 HIGH - Enables frontend integration

---

## Objective

Add a transformation layer that automatically converts between:
- **Database/Prisma:** snake_case (SQL convention)
- **Frontend/API:** camelCase (JavaScript convention)

This enables the frontend to work with clean TypeScript interfaces while the database follows SQL naming conventions.

---

## Why Transformation Layer?

### The Problem

**Database Schema (Prisma):**
```prisma
model Person {
  first_name    String @map("first_name")
  last_name     String @map("last_name")
  date_of_birth DateTime @map("date_of_birth")
}
```

**Frontend Expects (TypeScript):**
```typescript
interface Person {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}
```

**Without Transformation:**
```typescript
// ❌ Frontend receives snake_case
{
  "first_name": "Emma",      // Frontend expects firstName
  "last_name": "Smith",       // Frontend expects lastName
  "date_of_birth": "2020-03-15"  // Frontend expects dateOfBirth
}
```

**With Transformation:**
```typescript
// ✅ Frontend receives camelCase
{
  "firstName": "Emma",
  "lastName": "Smith",
  "dateOfBirth": "2020-03-15"
}
```

---

## Solution: Middleware Transformation

### Request Flow

```
Frontend (camelCase)
    ↓
{ firstName: "Emma", dateOfBirth: "2020-03-15" }
    ↓
[REQUEST TRANSFORMER] → toSnakeCase()
    ↓
{ first_name: "Emma", date_of_birth: "2020-03-15" }
    ↓
Controller → Prisma → Database (snake_case)
```

### Response Flow

```
Database → Prisma → Controller (snake_case)
    ↓
{ first_name: "Emma", date_of_birth: "2020-03-15" }
    ↓
[RESPONSE TRANSFORMER] → toCamelCase()
    ↓
{ firstName: "Emma", dateOfBirth: "2020-03-15" }
    ↓
Frontend (camelCase) ✅
```

---

## Implementation Strategy

### Approach: Middleware Layer

**Location:** Between routes and controllers

```typescript
router.post('/children', 
  authenticateParent,          // 1. Auth
  transformRequestBody,        // 2. Transform request (camelCase → snake_case)
  createChild,                 // 3. Controller uses snake_case
  transformResponseBody        // 4. Transform response (snake_case → camelCase)
);
```

### Works with Unified Schema

The transformation layer is **schema-agnostic** and works with:
- ✅ Old schema (children, patients)
- ✅ New schema (Person, ParentChildView, ClinicianPatientView)
- ✅ Any future schema changes

**Why?** Because it's just case conversion at the API boundary!

---

## Key Design Decisions

### Decision 1: Where to Transform?

**Option A:** In controllers (manual)
```typescript
// ❌ Repetitive, error-prone
const child = {
  firstName: data.first_name,
  lastName: data.last_name,
  dateOfBirth: data.date_of_birth
  // ... 50 more fields
};
```

**Option B:** In middleware (automatic) ✅
```typescript
// ✅ Automatic, DRY
// Middleware handles all fields automatically
```

**Decision:** Option B - Middleware

### Decision 2: Preserve Prisma Mapping

**Keep @map directives in schema:**
```prisma
model Person {
  firstName String @map("first_name")
}
```

**Why?**
- Database uses snake_case (SQL convention)
- Prisma client uses camelCase (we transform)
- Best of both worlds!

### Decision 3: Handle Nested Objects

```typescript
// Transform nested structures
{
  person: {
    firstName: "Emma"  // ✅ Transformed
  },
  view: {
    medicalHistory: "None"  // ✅ Transformed
  }
}
```

### Decision 4: Preserve Special Fields

**Don't transform:**
- `id` (already camelCase)
- `createdAt`, `updatedAt` (already camelCase)
- URLs, emails, tokens (not naming-related)

---

## Transformation Rules

### Rule 1: Request Body (camelCase → snake_case)

```typescript
// Input from frontend
{
  firstName: "Emma",
  dateOfBirth: "2020-03-15",
  medicalHistory: "None"
}

// Output to controller
{
  first_name: "Emma",
  date_of_birth: "2020-03-15",
  medical_history: "None"
}
```

### Rule 2: Response Body (snake_case → camelCase)

```typescript
// Input from database
{
  first_name: "Emma",
  date_of_birth: "2020-03-15",
  medical_history: "None"
}

// Output to frontend
{
  firstName: "Emma",
  dateOfBirth: "2020-03-15",
  medicalHistory: "None"
}
```

### Rule 3: Nested Objects (recursive)

```typescript
// Input
{
  person: {
    first_name: "Emma",
    date_of_birth: "2020-03-15"
  },
  contacts: [
    {
      first_name: "John",
      phone_number: "123"
    }
  ]
}

// Output
{
  person: {
    firstName: "Emma",
    dateOfBirth: "2020-03-15"
  },
  contacts: [
    {
      firstName: "John",
      phoneNumber: "123"
    }
  ]
}
```

### Rule 4: Arrays (map through)

```typescript
// Transform each item in array
children.map(child => toCamelCase(child))
```

---

## Implementation Details

### Core Functions

**1. toSnakeCase()**
```typescript
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// Examples:
toSnakeCase('firstName')      // → 'first_name'
toSnakeCase('dateOfBirth')    // → 'date_of_birth'
toSnakeCase('medicalHistory') // → 'medical_history'
```

**2. toCamelCase()**
```typescript
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Examples:
toCamelCase('first_name')      // → 'firstName'
toCamelCase('date_of_birth')   // → 'dateOfBirth'
toCamelCase('medical_history') // → 'medicalHistory'
```

**3. transformKeys() - Recursive**
```typescript
function transformKeys(
  obj: any,
  transform: (key: string) => string
): any {
  if (Array.isArray(obj)) {
    return obj.map(item => transformKeys(item, transform));
  }
  
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const transformedKey = transform(key);
      acc[transformedKey] = transformKeys(obj[key], transform);
      return acc;
    }, {} as any);
  }
  
  return obj;
}
```

---

## Middleware Implementation

### Request Transformer

```typescript
export function transformRequestBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.body) {
    req.body = transformKeys(req.body, toSnakeCase);
  }
  next();
}
```

### Response Transformer

```typescript
export function transformResponseBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const originalJson = res.json.bind(res);
  
  res.json = function(data: any) {
    const transformed = transformKeys(data, toCamelCase);
    return originalJson(transformed);
  };
  
  next();
}
```

---

## Integration with Controllers

### Before Transformation Layer

```typescript
// Controller receives camelCase from frontend
export const createChild = async (req: Request, res: Response) => {
  const { firstName, lastName, dateOfBirth } = req.body;
  
  // ❌ Manual conversion needed
  const child = await prisma.person.create({
    data: {
      first_name: firstName,
      last_name: lastName,
      date_of_birth: new Date(dateOfBirth)
    }
  });
  
  // ❌ Manual conversion for response
  res.json({
    firstName: child.first_name,
    lastName: child.last_name,
    dateOfBirth: child.date_of_birth
  });
};
```

### After Transformation Layer

```typescript
// Controller works with snake_case (Prisma native)
export const createChild = async (req: Request, res: Response) => {
  // ✅ Already snake_case from middleware
  const { first_name, last_name, date_of_birth } = req.body;
  
  const child = await prisma.person.create({
    data: {
      first_name,
      last_name,
      date_of_birth: new Date(date_of_birth)
    }
  });
  
  // ✅ Middleware will convert to camelCase
  res.json({ success: true, data: child });
};
```

**Much cleaner!** Controller works directly with Prisma conventions.

---

## Route Setup

### Apply Middleware Globally

```typescript
// app.ts
import { transformRequestBody, transformResponseBody } from './middleware/case-transformer';

app.use(express.json());
app.use(transformRequestBody);   // Transform all requests
app.use(transformResponseBody);  // Transform all responses

// Routes
app.use('/api/v1/parent', parentRoutes);
app.use('/api/v1/clinician', clinicianRoutes);
```

### Or Per-Route

```typescript
// routes/parent-children.routes.ts
import { transformRequestBody, transformResponseBody } from '../middleware/case-transformer';

router.post('/',
  authenticateParent,
  transformRequestBody,    // Request: camelCase → snake_case
  createChild,             // Controller uses snake_case
  transformResponseBody    // Response: snake_case → camelCase
);
```

---

## Testing Strategy

### Unit Tests for Transformers

```typescript
describe('Case Transformers', () => {
  describe('toSnakeCase', () => {
    it('converts camelCase to snake_case', () => {
      expect(toSnakeCase('firstName')).toBe('first_name');
      expect(toSnakeCase('dateOfBirth')).toBe('date_of_birth');
      expect(toSnakeCase('medicalHistory')).toBe('medical_history');
    });
  });
  
  describe('toCamelCase', () => {
    it('converts snake_case to camelCase', () => {
      expect(toCamelCase('first_name')).toBe('firstName');
      expect(toCamelCase('date_of_birth')).toBe('dateOfBirth');
      expect(toCamelCase('medical_history')).toBe('medicalHistory');
    });
  });
  
  describe('transformKeys', () => {
    it('transforms nested objects', () => {
      const input = {
        first_name: 'Emma',
        person_details: {
          date_of_birth: '2020-03-15',
          medical_history: 'None'
        }
      };
      
      const output = transformKeys(input, toCamelCase);
      
      expect(output).toEqual({
        firstName: 'Emma',
        personDetails: {
          dateOfBirth: '2020-03-15',
          medicalHistory: 'None'
        }
      });
    });
  });
});
```

### Integration Tests

```typescript
describe('Parent Children API with Transformation', () => {
  it('accepts camelCase and returns camelCase', async () => {
    const response = await request(app)
      .post('/api/v1/parent/children')
      .set('Authorization', 'Bearer test-token')
      .send({
        firstName: 'Emma',        // camelCase input
        lastName: 'Smith',
        dateOfBirth: '2020-03-15',
        medicalHistory: 'None'
      });
    
    expect(response.body.data).toHaveProperty('firstName', 'Emma');  // camelCase output
    expect(response.body.data).toHaveProperty('lastName', 'Smith');
    expect(response.body.data).not.toHaveProperty('first_name');     // No snake_case
  });
});
```

---

## Edge Cases

### Edge Case 1: Already Camel/Snake

```typescript
// If already in target case, leave alone
toSnakeCase('id')          // → 'id' (not 'i_d')
toCamelCase('email')       // → 'email' (not changed)
```

### Edge Case 2: Null/Undefined

```typescript
transformKeys(null, toCamelCase)      // → null
transformKeys(undefined, toCamelCase) // → undefined
```

### Edge Case 3: Dates

```typescript
// Preserve Date objects
const obj = { created_at: new Date() };
const transformed = transformKeys(obj, toCamelCase);
// transformed.createdAt is still a Date object
```

### Edge Case 4: Special Fields

```typescript
// Don't transform certain fields
const PRESERVE_FIELDS = ['id', 'url', 'email', 'token'];

function shouldTransform(key: string): boolean {
  return !PRESERVE_FIELDS.includes(key);
}
```

---

## Performance Considerations

### Minimal Overhead

```typescript
// Transformation is O(n) where n = number of keys
// For typical API response: ~100 keys
// Time: <1ms (negligible)
```

### Caching (if needed)

```typescript
const caseCache = new Map<string, string>();

function toCamelCaseCached(str: string): string {
  if (caseCache.has(str)) return caseCache.get(str)!;
  const result = toCamelCase(str);
  caseCache.set(str, result);
  return result;
}
```

---

## Expected Outcomes

After BACKEND_02:

✅ All API requests accept camelCase  
✅ All API responses return camelCase  
✅ Controllers work with snake_case (Prisma native)  
✅ Frontend never sees snake_case  
✅ Database uses snake_case (SQL convention)  
✅ Type safety maintained  
✅ Zero manual conversion  

---

## Dependencies

**Requires:**
- ✅ REDESIGN_01, 02, 03 complete (new schema working)
- ✅ Controllers updated

**Enables:**
- 🔄 Frontend integration (Parent portal)
- 🔄 Frontend integration (Clinician portal)
- 🔄 API documentation
- 🔄 Production deployment

---

**Status:** Ready for Activation Prompt  
**Next:** BACKEND_02 Activation - Implementation Code
