# Test Infrastructure Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FARMER SCHEME TESTING INFRASTRUCTURE                  │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                           USER COMMANDS                                  │
│                                                                          │
│    npm run init:test-db     │    npm run run:tests    │ npm run test:all│
│    (Create Tables)          │    (Execute Tests)      │   (Everything)  │
│                                                                          │
└──────────────────────┬───────────────┬──────────────────┬───────────────┘
                       │               │                  │
                       ▼               ▼                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         BACKEND SCRIPTS                                  │
│                                                                          │
│  ┌──────────────────┐  ┌────────────────┐  ┌──────────────────────────┐ │
│  │ initTestDatabase │  │   runTests.js  │  │  generateReport.js       │ │
│  │      .js         │  │                │  │                          │ │
│  │                  │  │ • Browser Ctrl │  │ • Query Results          │ │
│  │ • Create Tables  │  │ • Run Tests    │  │ • Generate HTML          │ │
│  │ • Seed Cases     │  │ • Screenshots  │  │ • Export CSV             │ │
│  │ • Setup Schema   │  │ • DB Logging   │  │ • Calculate Stats        │ │
│  └────────┬─────────┘  └────────┬───────┘  └────────────┬─────────────┘ │
│           │                     │                       │                │
└───────────┼─────────────────────┼───────────────────────┼────────────────┘
            │                     │                       │
            ▼                     ▼                       ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      POSTGRESQL DATABASE                                 │
│                    (farmer_scheme_db)                                    │
│                                                                          │
│  ┌─────────────────┐  ┌───────────────────┐  ┌──────────────────────┐  │
│  │  test_cases     │  │ test_executions   │  │  test_summaries      │  │
│  │                 │  │                   │  │                      │  │
│  │ • testId        │◄─┤ • testCaseId      │  │ • testRunId          │  │
│  │ • category      │  │ • status          │  │ • totalTests         │  │
│  │ • description   │  │ • actualResult    │  │ • passedTests        │  │
│  │ • priority      │  │ • screenshotPath  │◄─┤ • failedTests        │  │
│  │ • steps         │  │ • executionTime   │  │ • passPercentage     │  │
│  │ • expectedResult│  │ • executionDate   │  │ • executionDuration  │  │
│  │ • testData      │  │ • browserVersion  │  │ • environment        │  │
│  └─────────────────┘  │ • osVersion       │  └──────────────────────┘  │
│                       └───────────────────┘                             │
│                                                                          │
│  12+ Test Cases         Per-Test Results        Overall Statistics      │
│                         with Screenshot Path    per Test Run            │
└──────────────────────────────────────────────────────────────────────────┘

                            ▼
            ┌───────────────────────────────┐
            │  FILE SYSTEM STORAGE          │
            │                               │
            │  /tests/screenshots/          │
            │  ├── login/                   │
            │  │   ├── TC-Login-001_*.png   │
            │  │   └── TC-Login-002_*.png   │
            │  ├── dashboard/               │
            │  │   ├── TC-Dashboard-001_*.png
            │  │   └── TC-Dashboard-002_*.png
            │  ├── api/                     │
            │  │   ├── TC-API-001_*.png     │
            │  │   └── TC-API-002_*.png     │
            │  ├── admin/                   │
            │  ├── registration/            │
            │  ├── database/                │
            │  └── security/                │
            │                               │
            │  /backend/reports/            │
            │  ├── TestReport_*.html        │
            │  └── TestResults_*.csv        │
            │                               │
            └───────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════

TEST EXECUTION FLOW:
═══════════════════════════════════════════════════════════════════════════

1. INITIALIZATION PHASE
   ┌─────────────────────────────────────────┐
   │ initTestDatabase.js                     │
   ├─────────────────────────────────────────┤
   │ • Connect to PostgreSQL                 │
   │ • Drop existing test tables             │
   │ • Create: test_cases, test_executions   │
   │ • Create: test_summaries                │
   │ • Seed 12 test case records             │
   │ ✓ Database ready                        │
   └─────────────────────────────────────────┘

2. TEST EXECUTION PHASE
   ┌─────────────────────────────────────────┐
   │ runTests.js                             │
   ├─────────────────────────────────────────┤
   │                                         │
   │  For Each Test Case:                    │
   │  ──────────────────                    │
   │  1. Launch Puppeteer Browser            │
   │  2. Navigate to test URL                │
   │  3. Execute test steps                  │
   │  4. Verify expected results             │
   │  5. Determine Pass/Fail                 │
   │  6. Capture Full-Page Screenshot        │
   │  7. Save Result to test_executions:     │
   │     - testCaseId                        │
   │     - status (Pass/Fail)                │
   │     - actualResult                      │
   │     - screenshotPath ◄── IMPORTANT     │
   │     - executionTime                     │
   │     - executionDate                     │
   │  8. Close Browser Tab                   │
   │                                         │
   │  Create Summary Record in                │
   │  test_summaries:                        │
   │  - totalTests, passedTests, etc.        │
   │                                         │
   │ ✓ All results persisted to database     │
   │ ✓ Screenshots saved to disk             │
   │ ✓ Paths recorded in database            │
   └─────────────────────────────────────────┘

3. REPORTING PHASE
   ┌─────────────────────────────────────────┐
   │ generateReport.js                       │
   ├─────────────────────────────────────────┤
   │ • Query Latest Test Results             │
   │ • Calculate Statistics                  │
   │ • Group by Category                     │
   │ • Generate HTML:                        │
   │   ├── Summary Cards                     │
   │   ├── Pass Rate Bar                     │
   │   ├── Results Table                     │
   │   ├── Screenshot Links ◄── From DB      │
   │   └── Professional Styling              │
   │ • Generate CSV:                         │
   │   ├── All test results                  │
   │   ├── Screenshot paths                  │
   │   └── Execution metrics                 │
   │ ✓ HTML Report: /reports/TestReport_*.html
   │ ✓ CSV Export: /reports/TestResults_*.csv
   └─────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════

DATA FLOW:
═══════════════════════════════════════════════════════════════════════════

Test Case Definition
       │
       ▼
┌─────────────────┐
│  test_cases     │ ◄── initTestDatabase.js seeds 12+ cases
└────────┬────────┘
         │
         │ (testCaseId)
         │
         ▼
   runTests.js
       │
       ├─► Execute Test Steps
       │
       ├─► Capture Screenshot
       │   └─► Saved to: /tests/screenshots/{category}/{id}_{timestamp}.png
       │
       └─► Create Record: test_executions
           ├─► testCaseId (link to test_cases)
           ├─► status (Pass/Fail/Blocked)
           ├─► actualResult (what happened)
           ├─► screenshotPath ◄── Path to saved screenshot
           └─► executionTime, executionDate, etc.

       │
       ▼
generateReport.js
       │
       ├─► Query test_executions
       │
       ├─► Join with test_cases
       │
       ├─► Read screenshotPath from DB
       │
       └─► Generate:
           ├─► HTML Report (with clickable screenshot links)
           └─► CSV Export

═══════════════════════════════════════════════════════════════════════════

KEY FEATURES:
═══════════════════════════════════════════════════════════════════════════

✅ Automated Execution
   • Puppeteer browser automation
   • Headless mode for CI/CD
   • 8 test scripts implemented
   • 38 test cases documented

✅ Screenshot Capture
   • Full-page screenshots
   • Organized by category
   • Unique filenames (with timestamp)
   • Error screenshots captured
   • Paths stored in database

✅ Database Persistence
   • All results saved to PostgreSQL
   • Screenshot paths in database
   • Query-able for analysis
   • Historical tracking

✅ Professional Reports
   • Beautiful HTML styling
   • Color-coded status badges
   • Clickable screenshot links
   • CSV export for analysis
   • Pass rate percentage

✅ Easy to Use
   • Single npm commands
   • Clear error messages
   • Comprehensive documentation
   • Troubleshooting guide

═══════════════════════════════════════════════════════════════════════════

INTEGRATION POINTS:
═══════════════════════════════════════════════════════════════════════════

Frontend (React)
    │
    ├─► http://localhost:3000
    └─► Pages tested:
        • /login
        • /admin-login
        • /dashboard
        • /register
        • /scheme-list
        • etc.

Backend (Node.js/Express)
    │
    ├─► http://localhost:5001
    └─► APIs tested:
        • /health
        • /api/schemes
        • /api/users
        • /api/applications
        • etc.

Database (PostgreSQL)
    │
    ├─► localhost:5432
    ├─► Database: farmer_scheme_db
    └─► Tables:
        • users, schemes, applications (original)
        • test_cases, test_executions, test_summaries (new)

═══════════════════════════════════════════════════════════════════════════
```

---

## 📊 Database Schema Relationship

```
        ┌────────────────────────────┐
        │     test_cases (Master)    │
        │  ┌──────────────────────┐  │
        │  │ id (PK)              │  │
        │  │ testId               │  │
        │  │ category             │  │
        │  │ description          │  │
        │  │ priority             │  │
        │  │ steps                │  │
        │  │ expectedResult       │  │
        │  │ testData             │  │
        │  └──────────────────────┘  │
        └────────────┬────────────────┘
                     │ (1 to Many)
                     │ testCaseId (FK)
                     │
        ┌────────────▼────────────────┐
        │  test_executions (Detail)   │
        │  ┌──────────────────────┐   │
        │  │ id (PK)              │   │
        │  │ testCaseId (FK) ────┘   │
        │  │ executionDate        │   │
        │  │ executedBy           │   │
        │  │ status ──────┐       │   │  ┌──────────────┐
        │  │ actualResult │       │   │  │ test_summaries
        │  │ remarks      │       │   │  │ ┌──────────┐ │
        │  │ screenshot   │       │   │  │ │ id       │ │
        │  │ Path◄────────┼───┐   │   │  │ │ testRunId│ │
        │  │ executionTime│   │   │   │  │ │ total    │ │
        │  │ browserVer   │   │   │   │  │ │ passed   │ │
        │  │ osVersion    │   │   │   │  │ │ failed   │ │
        │  └──────────────┘   │   │   │  │ │ percent  │ │
        │                     │   │   │  └──────────────┘
        │ (Results + Evidence)│   │   │
        │                     │   │   │
        └─────────────────────┼───┼───┘
                              │   │
                    ┌─────────┘   └──────────────┐
                    │                            │
                    ▼                            │
        ┌──────────────────────────┐            │
        │  /tests/screenshots/     │            │
        │  {category}/             │            │
        │  {testid}_{timestamp}.png│            │
        │  (Actual Evidence)       │            │
        └──────────────────────────┘            │
                                                │
                                    (Aggregate Statistics)

═══════════════════════════════════════════════════════════════════════════

QUERY EXAMPLE:
═════════════

SELECT 
    tc.testId,
    tc.description,
    te.status,
    te.actualResult,
    te.screenshotPath,        ◄── Points to /tests/screenshots/...
    te.executionTime,
    te.executionDate
FROM test_cases tc
JOIN test_executions te ON tc.id = te.testCaseId
WHERE te.status = 'Fail'
ORDER BY te.executionDate DESC;

═══════════════════════════════════════════════════════════════════════════
```

---

## 🎯 Test Execution Timeline

```
Start: npm run test:all (or individual commands)
│
├─ 1. npm run init:test-db (10 seconds)
│  │
│  └─► Connects to PostgreSQL
│      Creates test_cases table
│      Creates test_executions table
│      Creates test_summaries table
│      Seeds 12 test cases
│      Status: Database ready ✓
│
├─ 2. npm run run:tests (2-5 minutes)
│  │
│  ├─► Launch Puppeteer
│  │
│  ├─► For each test (8 currently):
│  │   │
│  │   ├─► Execute test steps
│  │   ├─► Capture screenshot
│  │   └─► Save to database
│  │
│  ├─► Create summary record
│  │
│  └─► Status: Tests complete, results in DB ✓
│      Screenshots in /tests/screenshots/ ✓
│
├─ 3. npm run test:report (5 seconds)
│  │
│  ├─► Query test_executions table
│  ├─► Query test_cases table
│  ├─► Calculate statistics
│  ├─► Generate HTML report
│  ├─► Generate CSV export
│  │
│  └─► Status: Reports ready ✓
│      /backend/reports/TestReport_*.html
│      /backend/reports/TestResults_*.csv
│
End: All complete
│
├─► Database: /opt/homebrew/var/postgresql@16/base/16384/
│   └─ test_cases (12+ records)
│   └─ test_executions (8+ records with screenshot paths)
│   └─ test_summaries (1 record per run)
│
├─► Screenshots: /tests/screenshots/
│   └─ login/, registration/, dashboard/, admin/, api/, database/, security/
│   └─ Each screenshot: {testid}_{timestamp}.png
│   └─ Paths stored in test_executions.screenshotPath
│
└─► Reports: /backend/reports/
    └─ TestReport_*.html (view in browser)
    └─ TestResults_*.csv (analyze in Excel)

═══════════════════════════════════════════════════════════════════════════
```

This complete infrastructure ensures:
✅ Automated testing with no manual effort
✅ Visual evidence captured for each test
✅ Results persisted to database
✅ Professional reports for stakeholders
✅ Easy analysis and trend tracking
✅ CI/CD ready for deployment
