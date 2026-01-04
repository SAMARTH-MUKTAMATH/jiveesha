# DAIRA ANTIGRAVITY PROMPTS - MASTER INDEX
## Phased Development Guide for Backend + Parent Portal

**Project:** Daira Neurodevelopmental Screening Platform  
**Location:** `/Users/anikaet/Downloads/Jiveesha-Clinical/`  
**Strategy:** Execute prompts sequentially, one at a time

---

## 📋 PROMPT STRUCTURE

Each prompt is **self-contained** and can be executed independently by Antigravity.

**Naming Convention:**
- `PHASE_X_Y_FEATURE_NAME.md`
- Example: `PHASE_1_A_DATABASE_SESSIONS.md`

**Execution Order:**
1. Complete all Phase 1 prompts (Backend - Clinician features)
2. Complete all Phase 2 prompts (Backend - Parent features)
3. Complete all Phase 3 prompts (Frontend - Parent portal)

---

## 🗂️ COMPLETE PROMPT LIST

### **PHASE 1: COMPLETE CLINICIAN BACKEND (10 prompts)**
*Expand existing backend to support all clinician features*

**Priority: P0 - Must complete before anything else**

#### **SECTION A: Database Foundation (2 prompts)**
- **1-A1: Sessions & Journal Models** - Add consultation sessions, journal, notifications
- **1-A2: Clinical Models** - Add assessments, IEP, interventions, reports, messages

#### **SECTION B: Session Management (2 prompts)**
- **1-B1: Sessions Controller & Routes** - CRUD for consultation sessions
- **1-B2: Journal Controller & Routes** - Patient journal entries

#### **SECTION C: Assessment System (2 prompts)**
- **1-C1: Assessments Controller** - ISAA, ADHD, GLAD, ASD Deep-Dive
- **1-C2: Assessment Results & Comparison** - Scoring, interpretation, comparison

#### **SECTION D: IEP System (2 prompts)**
- **1-D1: IEP Builder Controller** - Create, edit IEPs with goals
- **1-D2: IEP Services & Progress** - Services, accommodations, progress tracking

#### **SECTION E: Clinical Features (2 prompts)**
- **1-E1: Interventions Controller** - Intervention plans and strategies
- **1-E2: Reports & Messages** - Report generation, messaging system

---

### **PHASE 2: PARENT PORTAL BACKEND (8 prompts)**
*Build parent-specific authentication and features*

**Priority: P1 - After Phase 1 complete**

#### **SECTION F: Parent Foundation (2 prompts)**
- **2-F1: Parent Authentication** - Register, login, profile for parents
- **2-F2: Parent-Child Links** - Link parents to children, manage relationships

#### **SECTION G: Consent System (2 prompts)**
- **2-G1: Consent Models & Tokens** - Consent grant system, 8-char tokens
- **2-G2: Consent Management API** - Grant, revoke, audit consent

#### **SECTION H: Parent Screening (2 prompts)**
- **2-H1: Screening Models** - Parent-led questionnaires (M-CHAT, ASQ)
- **2-H2: Screening API** - Create, save, complete screenings

#### **SECTION I: Parent Education (2 prompts)**
- **2-I1: PEP Builder** - Personalized Education Plans for home
- **2-I2: Resources & Activities** - Home activities, educational resources

---

### **PHASE 3: PARENT PORTAL FRONTEND (20 prompts)**
*Build React components from Figma designs + missing screens*

**Priority: P2 - After Phase 2 complete**

#### **SECTION J: Authentication & Onboarding (4 prompts)**
- **3-J1: Parent Login** - Login page
- **3-J2: Parent Signup** - Registration flow
- **3-J3: Email Verification** - Verify email
- **3-J4: Onboarding Welcome** - First-time user experience

#### **SECTION K: Dashboard & Navigation (3 prompts)**
- **3-K1: Parent Dashboard** - Main landing (FROM FIGMA: parent_dashboard/)
- **3-K2: Header & Navigation** - Top nav bar
- **3-K3: Notifications Panel** - Notification system

#### **SECTION L: Child Management (4 prompts)**
- **3-L1: Children List** - Overview (FROM FIGMA: my_children_(list)__1/)
- **3-L2: Child Profile** - Details page (FROM FIGMA: child_profile/)
- **3-L3: Add Child Form** - New child wizard
- **3-L4: Edit Child** - Update child info

#### **SECTION M: Screening Flow (3 prompts)**
- **3-M1: Screening Start** - Choose assessment
- **3-M2: Questionnaire** - Multi-step form (FROM FIGMA: screening_flow_(parent)__1/ & __2/)
- **3-M3: Results View** - Display results (FROM FIGMA: screening_results_(parent_view)__1/ & __2/)

#### **SECTION N: Consent & Sharing (2 prompts)**
- **3-N1: Consent Dashboard** - Manage consents (FROM FIGMA: consent_&_permissions/)
- **3-N2: Share Access** - Grant to professionals (FROM FIGMA: consent_&_share_(parent_view)_/)

#### **SECTION O: Education & Resources (2 prompts)**
- **3-O1: PEP Builder** - Home education plan (FROM FIGMA: pep_builder_(personalized_education_plan)_/)
- **3-O2: Resources Hub** - Activities & resources (FROM FIGMA: resources_&_home_activities_(parent_view)_/)

#### **SECTION P: Settings & Support (2 prompts)**
- **3-P1: Settings** - Account settings (FROM FIGMA: settings_&_account/)
- **3-P2: Help Center** - Support & FAQs

---

## 📊 PROGRESS TRACKER

### Phase 1: Clinician Backend (10 prompts)
- [ ] 1-A1: Sessions & Journal Models
- [ ] 1-A2: Clinical Models
- [ ] 1-B1: Sessions Controller
- [ ] 1-B2: Journal Controller
- [ ] 1-C1: Assessments Controller
- [ ] 1-C2: Assessment Results
- [ ] 1-D1: IEP Builder Controller
- [ ] 1-D2: IEP Services
- [ ] 1-E1: Interventions Controller
- [ ] 1-E2: Reports & Messages

### Phase 2: Parent Backend (8 prompts)
- [ ] 2-F1: Parent Authentication
- [ ] 2-F2: Parent-Child Links
- [ ] 2-G1: Consent Models
- [ ] 2-G2: Consent API
- [ ] 2-H1: Screening Models
- [ ] 2-H2: Screening API
- [ ] 2-I1: PEP Builder
- [ ] 2-I2: Resources API

### Phase 3: Parent Frontend (20 prompts)
- [ ] 3-J1-J4: Authentication (4 prompts)
- [ ] 3-K1-K3: Dashboard (3 prompts)
- [ ] 3-L1-L4: Child Management (4 prompts)
- [ ] 3-M1-M3: Screening (3 prompts)
- [ ] 3-N1-N2: Consent (2 prompts)
- [ ] 3-O1-O2: Education (2 prompts)
- [ ] 3-P1-P2: Settings (2 prompts)

**Total:** 38 prompts

---

## 🎯 HOW TO USE THIS SYSTEM

### Step 1: Start with Phase 1-A1
Read and execute: `PHASE_1_A1_DATABASE_SESSIONS.md`

### Step 2: Execute in Order
Complete each prompt sequentially:
- 1-A1 → 1-A2 → 1-B1 → 1-B2 → ... → 1-E2

### Step 3: Verify After Each Prompt
Each prompt includes:
- ✅ Success criteria
- 🧪 Test commands
- 📝 Verification steps

### Step 4: Move to Next Phase
Only proceed to Phase 2 when **ALL** Phase 1 prompts complete.

---

## 🚦 EXECUTION RULES

1. **One prompt at a time** - Don't skip ahead
2. **Verify completion** - Check success criteria before next prompt
3. **Sequential order** - Prompts build on each other
4. **Report issues** - If stuck, note which prompt and error
5. **Save progress** - Commit after each successful prompt

---

## 📁 REFERENCE FILES

### For Backend Development (Phase 1-2)
- Existing schema: `backend/prisma/schema.prisma`
- Existing controllers: `backend/src/controllers/`
- Existing routes: `backend/src/routes/`
- Server entry: `backend/src/app.ts`

### For Frontend Development (Phase 3)
- Figma designs: `stitch_jiveesha-parent_updated_ui/*/code.html`
- Screenshots: `stitch_jiveesha-parent_updated_ui/*/screen.png`
- Clinician reference: `Frontend/components/` (for patterns)

---

## 🎨 UI DESIGN REFERENCE

**Parent Portal Screens Available:**
1. `parent_dashboard/` - Main landing page
2. `my_children_(list)__1/` & `__2/` - Children overview (2 versions)
3. `child_profile/` - Individual child details
4. `screening_flow_(parent)__1/` & `__2/` - Questionnaire steps
5. `screening_results_(parent_view)__1/` & `__2/` - Results display
6. `consent_&_permissions/` - Consent management
7. `consent_&_share_(parent_view)_/` - Grant access
8. `professional_referrals_(parent_view)_/` - Find professionals
9. `pep_builder_(personalized_education_plan)_/` - Education plan
10. `resources_&_home_activities_(parent_view)_/` - Activities
11. `settings_&_account/` - Settings

**Each folder contains:**
- `code.html` - Full Tailwind CSS implementation
- `screen.png` - Visual reference

---

## ⚡ QUICK START

**To begin development, execute:**

```bash
# Step 1: Read first prompt
cat PHASE_1_A1_DATABASE_SESSIONS.md

# Step 2: Give to Antigravity
"Execute the instructions in PHASE_1_A1_DATABASE_SESSIONS.md"

# Step 3: After completion, move to next
cat PHASE_1_A2_CLINICAL_MODELS.md
```

---

## 📞 SUPPORT

**If you encounter issues:**
1. Note the prompt number (e.g., "Stuck on 1-C1")
2. Copy the error message
3. Check the verification steps
4. Report and we'll debug

---

**Ready to start? Begin with PHASE_1_A1_DATABASE_SESSIONS.md** ⭐

