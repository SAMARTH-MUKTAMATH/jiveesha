# SCREENING SYSTEM MODULARITY GUIDE
## How to Swap, Replace, or Add Screening Types

**Created:** Phase 2-H  
**Purpose:** Make screening system easy to modify based on real-world feedback

---

## 🎯 DESIGN PHILOSOPHY

The screening system is built with **zero-coupling** architecture:
- Question banks are data (database tables)
- Scoring engines are functions (isolated utilities)
- API is generic (doesn't care about screening type)
- Database schema is flexible (JSON responses)

**Result:** You can completely swap out screening tools without breaking anything.

---

## 📋 CURRENT ARCHITECTURE

```
┌─────────────────────────────────────────────────┐
│  PARENT SCREENING SYSTEM (Generic)              │
├─────────────────────────────────────────────────┤
│                                                 │
│  API Layer (Screening-Agnostic)                │
│  ├─ POST /screening (start any type)           │
│  ├─ GET /screening/:id/questions               │
│  ├─ POST /screening/:id/complete               │
│  └─ GET /screening/:id/results                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Data Layer (Pluggable Question Banks)         │
│  ├─ mchat_questions table                      │
│  ├─ asq_questions table                        │
│  └─ [add more tables as needed]                │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Scoring Layer (Isolated Functions)            │
│  ├─ scoreMChatR()                              │
│  ├─ scoreASQ3()                                │
│  └─ [add more functions as needed]             │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## ✅ SCENARIO 1: Add New Screening Type

**Use Case:** You want to pilot a new autism screening tool (e.g., "STAT-Rapid")

### Steps:

**1. Create Question Bank (5 minutes)**
```sql
-- Option A: New table (if structure is different)
CREATE TABLE stat_rapid_questions (
  id UUID PRIMARY KEY,
  question_number INT,
  question_text TEXT,
  scoring_key TEXT
);

-- Option B: Use existing pattern
INSERT INTO mchat_questions (...)
```

**2. Add Scoring Function (15 minutes)**
```typescript
// File: src/utils/screening-scorer.ts

export function scoreSTATRapid(responses: Record<string, string>) {
  let totalScore = 0;
  
  // Your scoring logic here
  Object.entries(responses).forEach(([q, answer]) => {
    if (answer === 'yes') totalScore += 1;
  });
  
  return {
    totalScore,
    riskLevel: totalScore >= 5 ? 'high' : 'low',
    screenerResult: totalScore >= 5 ? 'refer' : 'pass',
    followUpRequired: totalScore >= 5,
    professionalReferral: totalScore >= 7,
    recommendations: generateRecommendations('STAT-Rapid', ...)
  };
}
```

**3. Register in Complete Handler (2 minutes)**
```typescript
// File: src/controllers/parent-screening.controller.ts
// In completeScreening() function:

else if (screening.screeningType === 'STAT-Rapid') {
  scoreResult = scoreSTATRapid(finalResponses);
  // ... same update logic
}
```

**4. Register in Question Loader (2 minutes)**
```typescript
// File: src/controllers/parent-screening.controller.ts
// In getQuestions() function:

else if (screening.screeningType === 'STAT-Rapid') {
  questions = await prisma.statRapidQuestion.findMany({
    orderBy: { questionNumber: 'asc' }
  });
}
```

**Done!** No API changes, no migrations, frontend just needs to pass `screeningType: 'STAT-Rapid'`

---

## 🔄 SCENARIO 2: Replace Existing Screening

**Use Case:** M-CHAT has a new version and you want to replace M-CHAT-R with M-CHAT-3.0

### Migration Path:

**Phase 1: Parallel Testing (Month 1-2)**
```typescript
// Both versions available
'M-CHAT-R'   // Old version (still works)
'M-CHAT-3.0' // New version (testing)

// Parents can choose or you A/B test
```

**Phase 2: Collect Feedback (Month 2-3)**
```typescript
// Track completion rates, user satisfaction
SELECT 
  screening_type,
  COUNT(*) as completions,
  AVG(CASE WHEN status='completed' THEN 1 ELSE 0 END) as completion_rate
FROM parent_screenings
WHERE screening_type IN ('M-CHAT-R', 'M-CHAT-3.0')
GROUP BY screening_type;
```

**Phase 3: Gradual Migration (Month 3-4)**
```typescript
// Frontend: Default to new version
if (user.created_at > '2024-03-01') {
  defaultScreeningType = 'M-CHAT-3.0';
} else {
  defaultScreeningType = 'M-CHAT-R'; // Familiarity for existing users
}
```

**Phase 4: Deprecation (Month 4+)**
```typescript
// Frontend: Hide old version from UI
// Backend: Keep old scoring logic (historical data still works)
// Database: All old screenings remain scorable forever
```

---

## 🗑️ SCENARIO 3: Remove Screening Type

**Use Case:** You decide ASQ-SE-2 isn't working for your use case

### Safe Removal Process:

**Step 1: UI Removal**
```typescript
// Frontend: Remove from dropdown
const availableScreenings = [
  'M-CHAT-R',
  'ASQ-3',
  // 'ASQ-SE-2' <- Comment out or remove
];
```

**Step 2: Backend Preservation**
```typescript
// Keep scoring function (for historical data)
// Keep question table (for data integrity)
// API still works if someone has old link
```

**Step 3: Data Analysis**
```sql
-- Check if anyone is using it
SELECT COUNT(*) FROM parent_screenings 
WHERE screening_type = 'ASQ-SE-2' 
AND started_at > NOW() - INTERVAL '30 days';

-- If 0, safe to archive
```

**Step 4: Optional Archival**
```typescript
// If you want to clean up code:
// 1. Comment out scoring function
// 2. Add note in code: "Deprecated 2024-03-15"
// 3. Keep question table for data integrity
```

---

## 🧪 SCENARIO 4: Modify Scoring Algorithm

**Use Case:** Research shows M-CHAT cutoff should be 5 instead of 3

### Hot-Fix Process:

**Step 1: Update Scoring Function**
```typescript
// File: src/utils/screening-scorer.ts

export function scoreMChatR(responses: Record<string, string>) {
  // ... existing logic ...
  
  // OLD:
  // if (totalScore >= 3 || criticalScore >= 2) {
  
  // NEW:
  if (totalScore >= 5 || criticalScore >= 2) {
    riskLevel = 'medium';
    // ...
  }
}
```

**Step 2: Deploy**
```bash
git commit -m "Update M-CHAT cutoff to 5 per latest research"
git push
# Deploy to production
```

**Step 3: Re-Score Historical Data (Optional)**
```typescript
// If you want to update old screenings:
const oldScreenings = await prisma.parentScreening.findMany({
  where: { 
    screeningType: 'M-CHAT-R',
    completedAt: { gte: new Date('2024-01-01') }
  }
});

for (const screening of oldScreenings) {
  const newScore = scoreMChatR(screening.responses);
  await prisma.parentScreening.update({
    where: { id: screening.id },
    data: { 
      riskLevel: newScore.riskLevel,
      screenerResult: newScore.screenerResult 
    }
  });
}
```

---

## 📊 SCENARIO 5: A/B Test Screening Tools

**Use Case:** Test M-CHAT vs. STAT to see which parents complete more

### Setup:

```typescript
// Randomly assign screening type
const assignedScreening = Math.random() < 0.5 ? 'M-CHAT-R' : 'STAT-Rapid';

await prisma.parentScreening.create({
  data: {
    screeningType: assignedScreening,
    // ... other fields
    metadata: { 
      experiment: 'mchat-vs-stat-2024',
      variant: assignedScreening 
    }
  }
});
```

### Analysis:

```sql
-- Completion rates by variant
SELECT 
  screening_type,
  COUNT(*) as started,
  SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) as completed,
  AVG(CASE WHEN status='completed' THEN 1 ELSE 0 END) * 100 as completion_rate,
  AVG(EXTRACT(EPOCH FROM (completed_at - started_at))/60) as avg_duration_minutes
FROM parent_screenings
WHERE created_at > '2024-03-01'
GROUP BY screening_type;
```

---

## 🎓 BEST PRACTICES

### DO ✅
- **Keep old scoring functions** even after deprecation (historical data)
- **Version your questions** if you modify existing screenings
- **Log changes** in audit trail when updating scoring logic
- **Test scoring** with known cases before deployment
- **Document cutoffs** and scoring logic in code comments

### DON'T ❌
- **Don't delete question tables** (breaks historical data)
- **Don't change scoring** without versioning (creates inconsistency)
- **Don't hard-code** screening types in database schema
- **Don't break old APIs** (parents may have saved links)
- **Don't migrate data** unless absolutely necessary

---

## 🔍 DEBUGGING TIPS

### Issue: "Scoring doesn't match expected result"
```typescript
// Add debug logging to scoring function
console.log('Scoring M-CHAT:', {
  responses,
  totalScore,
  criticalScore,
  riskLevel
});
```

### Issue: "Questions not loading for new screening"
```typescript
// Check question loader has new case
// Check database has questions seeded
await prisma.newScreeningQuestion.count(); // Should be > 0
```

### Issue: "Old screenings show different scores"
```typescript
// Scoring logic may have changed - check git history
git log -p src/utils/screening-scorer.ts

// Re-score with current logic
const freshScore = scoreMChatR(oldScreening.responses);
```

---

## 📈 MONITORING RECOMMENDATIONS

```sql
-- Track screening adoption
SELECT 
  screening_type,
  DATE_TRUNC('week', started_at) as week,
  COUNT(*) as screenings_started
FROM parent_screenings
GROUP BY screening_type, week
ORDER BY week DESC;

-- Completion rates
SELECT 
  screening_type,
  COUNT(*) as total,
  AVG(CASE WHEN status='completed' THEN 1 ELSE 0 END) as completion_rate
FROM parent_screenings
GROUP BY screening_type;

-- Risk distribution
SELECT 
  screening_type,
  risk_level,
  COUNT(*) as count
FROM parent_screenings
WHERE status = 'completed'
GROUP BY screening_type, risk_level;
```

---

## 🚀 QUICK REFERENCE: Common Tasks

| Task | Time | Files to Change |
|------|------|-----------------|
| Add new screening | 30 min | `screening-scorer.ts`, `parent-screening.controller.ts` |
| Update scoring cutoffs | 5 min | `screening-scorer.ts` |
| Add new questions | 10 min | Database seed file |
| Remove from UI | 2 min | Frontend only |
| A/B test screenings | 15 min | Frontend assignment logic |
| Re-score historical data | 30 min | One-time script |

---

**Remember:** The system is designed to be changed. Don't be afraid to experiment!
