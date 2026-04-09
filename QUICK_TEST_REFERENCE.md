# 🚀 Test Infrastructure - Quick Reference

## ⚡ 30-Second Start

```bash
cd /Users/susantalabala/demo/backend
npm install && npm run test:all
```

Done! Check the report at: `/backend/reports/TestReport_*.html`

---

## 📋 Command Reference

| Command | What it Does | Time |
|---------|-------------|------|
| `npm run init:test-db` | Create test database tables | 10s |
| `npm run run:tests` | Execute all automated tests | 2-5m |
| `npm run test:report` | Generate HTML & CSV reports | 5s |
| `npm run test:all` | Do all three above | 3-6m |

---

## 📁 What Gets Created

```
/backend/tests/runTests.js          → Test executor
/backend/src/initTestDatabase.js    → Database schema
/backend/tests/generateReport.js    → Report generator
/backend/reports/TestReport_*.html  → Beautiful report
/backend/reports/TestResults_*.csv  → Data export
/tests/screenshots/*/               → Screenshot storage
```

---

## 🗄️ Database Tables

```
test_cases      → Test definitions (12+ seeded)
test_executions → Test results with screenshot paths
test_summaries  → Overall statistics per run
```

**Key Column**: `screenshotPath` in `test_executions` stores path to captured screenshot

---

## 📸 Screenshots Auto-Save

Location: `/tests/screenshots/{category}/TC-{testid}_{timestamp}.png`

Example:
- `/tests/screenshots/login/TC-Login-001_1234567890.png`
- `/tests/screenshots/dashboard/TC-Dashboard-002_1234567891.png`
- `/tests/screenshots/api/TC-API-001_ERROR_1234567892.png`

---

## 🧪 Test Cases Covered

- ✅ Farmer Login (2 tests)
- ✅ Admin Login (1 test)
- ✅ Dashboard (2 tests)
- ✅ API Health Check (2 tests)
- ✅ API Schemes (1 test)
- ✅ Database (2 tests)
- Plus 36 more documented in TEST_CASES.md

---

## 📊 View Results

### Option 1: HTML Report (Best)
```bash
open backend/reports/TestReport_*.html
```
- Color-coded results
- Clickable screenshots
- Pass rate percentage
- Professional format

### Option 2: CSV in Excel
```bash
open backend/reports/TestResults_*.csv
```
- Spreadsheet format
- Easy analysis
- Import elsewhere

### Option 3: Database Query
```bash
psql farmer_scheme_db -U susantalabala
SELECT * FROM test_executions ORDER BY executionDate DESC;
```

---

## 📈 Key Metrics Captured

For each test:
- ✅ Test ID & Description
- ✅ Pass/Fail status
- ✅ Execution time (ms)
- ✅ Screenshot path
- ✅ Actual result
- ✅ Timestamp
- ✅ Browser/OS info

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| "puppeteer not found" | `npm install --save-dev puppeteer` |
| "Cannot connect to DB" | Check PostgreSQL running: `pg_isready` |
| "Port 3000/5001 refused" | Start servers in separate terminals |
| "Browser crashed" | Reinstall: `npm install --save-dev puppeteer` |

---

## 📚 Full Documentation

- **TEST_INFRASTRUCTURE_GUIDE.md** - Complete guide (400+ lines)
- **TEST_CASES.md** - All 46 test cases
- **TEST_INFRASTRUCTURE_SUMMARY.md** - Implementation details

---

## ✨ What's Stored in Database

Each test creates a record:

```javascript
{
  testId: 'TC-Login-001',
  status: 'Pass',                    // or 'Fail', 'Blocked'
  screenshotPath: 'tests/screenshots/login/TC-Login-001_123.png',
  executionTime: 2340,              // milliseconds
  actualResult: 'User logged in successfully',
  createdAt: '2024-01-15 10:30:45'
}
```

**Important**: Screenshot path is stored in the `screenshotPath` column!

---

## 🎯 One-Command Everything

```bash
npm run test:all
```

This:
1. Creates database tables
2. Runs all tests (8 automated + 38 to implement)
3. Captures screenshots
4. Saves results to database
5. Generates HTML report
6. Exports CSV

---

## 🚀 Next Steps

1. Install deps: `npm install`
2. Init DB: `npm run init:test-db`
3. Run tests: `npm run run:tests`
4. View report: `open backend/reports/TestReport_*.html`
5. Query results: `SELECT * FROM test_executions;`

---

## 📞 Key Files

| File | Purpose |
|------|---------|
| `initTestDatabase.js` | Create tables & seed data |
| `runTests.js` | Execute tests & capture screenshots |
| `generateReport.js` | Create HTML/CSV reports |
| `TEST_CASES.md` | All 46 test cases |
| `TEST_INFRASTRUCTURE_GUIDE.md` | Complete guide |

---

**Status**: ✅ Ready to Use  
**Tests Implemented**: 8 executable  
**Tests Documented**: 46 total  
**Screenshots**: Auto-captured & stored in database  
**Reports**: HTML + CSV generated

Quick start: `npm run test:all` 🎉
