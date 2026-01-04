# SCREENING FRAMEWORK INTEGRATION GUIDE
## How to Integrate Your Pre-Coded Screening UI

**Purpose:** This guide explains how to integrate your pre-coded M-CHAT, ASQ, and other screening frameworks into the Daira parent portal containers we'll build.

---

## 🎯 OVERVIEW

**What We're Building:**
- Container pages with routing
- Data fetching from backend API
- Navigation structure
- Results display containers
- Integration points for your frameworks

**What You're Providing:**
- M-CHAT question flow UI
- ASQ question flow UI
- Question progression logic
- Answer selection components
- Any other screening tools

---

## 📁 FILE STRUCTURE

We'll create this structure for easy integration:

```
frontend/src/pages/screening/
├── ScreeningContainer.tsx          # Main container (we build)
├── ScreeningSelection.tsx          # Choose screening type (we build)
├── ScreeningHistory.tsx            # Past screenings (we build)
├── ScreeningResults.tsx            # Results display (we build)
│
└── frameworks/                     # YOUR PRE-CODED FRAMEWORKS GO HERE
    ├── MChatFramework.tsx          # Your M-CHAT UI
    ├── ASQFramework.tsx            # Your ASQ UI
    ├── index.ts                    # Export all frameworks
    └── README.md                   # Your framework documentation
```

---

## 🔌 INTEGRATION POINTS

### Container Structure We'll Provide:

```typescript
// File: src/pages/screening/ScreeningContainer.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import screeningService from '../../services/screening.service';

// YOUR FRAMEWORKS WILL BE IMPORTED HERE
// import { MChatFramework, ASQFramework } from './frameworks';

interface ScreeningContainerProps {
  // Props we'll define
}

export default function ScreeningContainer() {
  const { screeningId } = useParams();
  const [screening, setScreening] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We fetch screening data from API
    loadScreening();
  }, [screeningId]);

  const loadScreening = async () => {
    const data = await screeningService.getScreening(screeningId);
    setScreening(data);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="screening-page">
      {/* HEADER - We build this */}
      <div className="screening-header">
        <h1>{screening.screeningType} Screening</h1>
        <p>Child: {screening.patient.firstName}</p>
      </div>

      {/* INTEGRATION POINT - Your framework goes here */}
      <div className="screening-content">
        {renderScreeningFramework(screening.screeningType, screening)}
      </div>

      {/* FOOTER - We build this */}
      <div className="screening-footer">
        <button onClick={saveAndExit}>Save & Exit</button>
      </div>
    </div>
  );
}

// This function routes to your frameworks
function renderScreeningFramework(type: string, screening: any) {
  switch (type) {
    case 'M-CHAT-R':
      // YOUR FRAMEWORK WILL BE USED HERE
      return <MChatFramework screeningId={screening.id} />;
    
    case 'ASQ-3':
      // YOUR FRAMEWORK WILL BE USED HERE
      return <ASQFramework screeningId={screening.id} />;
    
    default:
      return <div>Screening type not supported</div>;
  }
}
```

---

## 📋 PROPS YOUR FRAMEWORK WILL RECEIVE

### Standard Props Interface:

```typescript
// We'll provide these props to your framework

interface ScreeningFrameworkProps {
  // Screening identification
  screeningId: string;
  screeningType: string;
  
  // Child information
  childId: string;
  childAge: number; // in months
  
  // Screening data
  questions: Question[];
  currentProgress: number; // 0-100
  savedResponses?: Record<string, any>;
  
  // Callbacks
  onSaveResponse: (questionId: string, answer: any) => Promise<void>;
  onComplete: (allResponses: Record<string, any>) => Promise<void>;
  onExit: () => void;
  
  // Optional
  allowBackNavigation?: boolean;
  autoSave?: boolean;
}

interface Question {
  id: string;
  questionNumber: number;
  questionText: string;
  // ... your specific question structure
}
```

---

## 🔄 DATA FLOW

### 1. Container Fetches Data:

```typescript
// We call the API
const screening = await screeningService.getScreening(screeningId);
const questions = await screeningService.getQuestions(screeningId);
```

### 2. Props Passed to Your Framework:

```typescript
<YourFramework
  screeningId={screening.id}
  questions={questions}
  onSaveResponse={handleSaveResponse}
  onComplete={handleComplete}
/>
```

### 3. Your Framework Handles UI/UX:

```typescript
// Inside your framework
export function MChatFramework({ 
  screeningId, 
  questions, 
  onSaveResponse, 
  onComplete 
}: ScreeningFrameworkProps) {
  // Your question flow logic
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  const handleAnswer = async (answer: string) => {
    // Save to backend via our callback
    await onSaveResponse(questions[currentQuestion].id, answer);
    
    // Move to next question
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // All done - trigger completion
      await onComplete(allResponses);
    }
  };
  
  return (
    <div>
      {/* YOUR UI HERE */}
    </div>
  );
}
```

### 4. Completion Triggers Scoring:

```typescript
// We handle the scoring
const handleComplete = async (responses: Record<string, any>) => {
  const result = await screeningService.complete(screeningId, responses);
  navigate(`/screening/${screeningId}/results`);
};
```

---

## 🎨 STYLING APPROACH

### Option 1: Use Our Tailwind Classes

```typescript
// Your framework using our Tailwind setup
export function MChatFramework(props) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">
          Question {currentQuestion + 1}
        </h2>
        {/* Your content */}
      </div>
    </div>
  );
}
```

### Option 2: Bring Your Own Styles

```typescript
// Your framework with custom CSS
import './MChatFramework.css';

export function MChatFramework(props) {
  return (
    <div className="mchat-framework">
      {/* Your styles in MChatFramework.css */}
    </div>
  );
}
```

### Option 3: CSS Modules

```typescript
// Scoped styles
import styles from './MChatFramework.module.css';

export function MChatFramework(props) {
  return (
    <div className={styles.framework}>
      {/* Scoped CSS */}
    </div>
  );
}
```

---

## 📦 FRAMEWORK EXPORT STRUCTURE

### Your index.ts File:

```typescript
// File: src/pages/screening/frameworks/index.ts

export { MChatFramework } from './MChatFramework';
export { ASQFramework } from './ASQFramework';

// If you have shared components
export { QuestionCard } from './components/QuestionCard';
export { ProgressBar } from './components/ProgressBar';
```

---

## 🔒 API SERVICE WE'LL PROVIDE

### Screening Service Interface:

```typescript
// File: src/services/screening.service.ts

class ScreeningService {
  // Start new screening
  async startScreening(data: {
    patientId: string;
    screeningType: string;
    ageAtScreening: number;
  }): Promise<Screening>;

  // Get screening details
  async getScreening(screeningId: string): Promise<Screening>;

  // Get questions for screening
  async getQuestions(screeningId: string): Promise<Question[]>;

  // Save single response (auto-save)
  async saveResponse(
    screeningId: string,
    questionId: string,
    answer: any
  ): Promise<void>;

  // Complete screening
  async complete(
    screeningId: string,
    responses: Record<string, any>
  ): Promise<ScreeningResult>;

  // Get results
  async getResults(screeningId: string): Promise<ScreeningResult>;
}
```

---

## 🧪 INTEGRATION TESTING CHECKLIST

### Before Integration:
- [ ] Your framework works standalone
- [ ] All dependencies documented
- [ ] Props interface matches our specification
- [ ] Callbacks are properly called
- [ ] Error handling implemented

### During Integration:
- [ ] Import paths are correct
- [ ] Props are properly passed
- [ ] API calls work as expected
- [ ] Navigation flows correctly
- [ ] Styling doesn't conflict

### After Integration:
- [ ] Complete screening end-to-end
- [ ] Test auto-save functionality
- [ ] Verify results display
- [ ] Test error scenarios
- [ ] Mobile responsiveness check

---

## 📝 EXAMPLE INTEGRATION

### Minimal Working Example:

```typescript
// YOUR FILE: frameworks/MChatFramework.tsx

import React, { useState } from 'react';
import { ScreeningFrameworkProps } from '../types';

export function MChatFramework({
  screeningId,
  questions,
  savedResponses = {},
  onSaveResponse,
  onComplete,
}: ScreeningFrameworkProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState(savedResponses);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = async (answer: 'yes' | 'no') => {
    // Update local state
    const newResponses = {
      ...responses,
      [currentQuestion.id]: answer,
    };
    setResponses(newResponses);

    // Save to backend (auto-save)
    await onSaveResponse(currentQuestion.id, answer);

    // Move to next or complete
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // All questions answered
      await onComplete(newResponses);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <div className="text-sm text-gray-600">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          {currentQuestion.questionText}
        </h2>

        <div className="flex gap-4">
          <button
            onClick={() => handleAnswer('yes')}
            className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Yes
          </button>
          <button
            onClick={() => handleAnswer('no')}
            className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            No
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
```

---

## 🚀 DEPLOYMENT STEPS

### When You're Ready to Integrate:

1. **Prepare Your Framework:**
   ```bash
   # Ensure all dependencies are in package.json
   npm install <your-dependencies>
   ```

2. **Copy Framework Files:**
   ```bash
   # Copy to frameworks directory
   cp -r your-framework/* frontend/src/pages/screening/frameworks/
   ```

3. **Update Imports:**
   ```typescript
   // In ScreeningContainer.tsx
   import { MChatFramework, ASQFramework } from './frameworks';
   ```

4. **Test Integration:**
   ```bash
   npm run dev
   # Navigate to screening flow
   # Complete full screening
   ```

5. **Verify:**
   - [ ] Questions load
   - [ ] Answers save
   - [ ] Progress tracked
   - [ ] Completion works
   - [ ] Results display

---

## 🆘 COMMON ISSUES & SOLUTIONS

### Issue: Props mismatch
**Solution:** Check our ScreeningFrameworkProps interface

### Issue: API calls fail
**Solution:** Ensure backend is running on port 5001

### Issue: Styling conflicts
**Solution:** Use CSS modules or scoped classes

### Issue: Navigation not working
**Solution:** Verify Router setup in App.tsx

### Issue: State not persisting
**Solution:** Check onSaveResponse callback is being called

---

## 📞 INTEGRATION SUPPORT

**When you're ready to integrate:**
1. Share your framework files
2. We'll help with container setup
3. Test integration together
4. Deploy to production

**Need help?**
- Check prop interface in `types/screening.types.ts`
- Review example integration above
- Test standalone first, then integrate

---

## ✅ INTEGRATION CHECKLIST

**Before You Start:**
- [ ] Framework code is complete and tested
- [ ] All dependencies documented
- [ ] Props interface understood
- [ ] Styling approach decided

**During Integration:**
- [ ] Files copied to frameworks directory
- [ ] Imports updated in container
- [ ] Props correctly passed
- [ ] Callbacks tested

**After Integration:**
- [ ] End-to-end testing complete
- [ ] All screening types working
- [ ] Results display correctly
- [ ] Mobile responsive
- [ ] Performance acceptable

---

**This guide will be updated as we build the containers in Phase 3-M1 and 3-M2!**
