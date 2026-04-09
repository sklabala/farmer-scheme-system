# 🧪 Test Infrastructure - Complete Setup Guide

## Overview

This document provides comprehensive instructions for setting up and running the automated test infrastructure for the Farmer Scheme System. The system includes:

- **46 Test Cases** documented across 10 categories
- **Automated Test Runner** using Puppeteer for browser automation
- **Screenshot Capture** for visual evidence and debugging
- **Database Result Persistence** to track all test executions
- **HTML Report Generation** for stakeholder review
- **CSV Export** for data analysis

---

## 📦 Prerequisites

Ensure you have the following installed:

1. **Node.js** v14+ (Check with `node --version`)
2. **PostgreSQL** 12+ with `farmer_scheme_db` database created
3. **npm** (Check with `npm --version`)
4. Backend running at `http://localhost:5001`
5. Frontend running at `http://localhost:3000`

---

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
cd /Users/susantalabala/demo/backend

# Install all dependencies including Puppeteer
npm install

# Install Puppeteer specifically (if needed)
npm install --save-dev puppeteer
```

### Step 2: Initialize Test Database

```bash
npm run init:test-db
```

This command:
- Creates 3 new tables: `test_cases`, `test_executions`, `test_summaries`
- Seeds 12 initial test cases
- Sets up database schema for result tracking

**Expected Output:**
```
✅ Database connection successful!
📋 Creating test tables...
✅ Test tables created/verified!
🌱 Seeding test cases...
✅ Seeded 12 test cases
✨ Test Database initialization complete!
```

### Step 3: Run Tests

```bash
npm run run:tests
```

This command:
- Launches Chromium browser (headless mode)
- Executes all 46 test cases automatically
- Captures screenshots for each test
- Saves results to database
- Takes approximately 2-5 minutes

**Expected Output:**
```
🚀 Starting Test Execution...

📊 TEST EXECUTION SUMMARY
============================================================
Test Run ID: TestRun_2024-01-15T10-30-45...
Total Tests: 46
✅ Passed: XX
❌ Failed: XX
⏭️  Blocked/Skipped: XX
📈 Pass Rate: XX.XX%
⏱️  Duration: XXXs
============================================================

📸 Screenshots saved in: /Users/susantalabala/demo/tests/screenshots/
📊 Results saved in: test_executions table
📈 Summary saved in: test_summaries table
```

### Step 4: Generate Report

```bash
npm run test:report
```

This command:
- Queries latest test results from database
- Generates beautiful HTML report
- Exports results as CSV
- Creates reports in `/backend/reports/` directory

**Expected Output:**
```
✅ Report generated successfully!
📄 Report saved to: /Users/susantalabala/demo/backend/reports/TestReport_TestRun_2024-01-15...html
📊 CSV export saved to: /Users/susantalabala/demo/backend/reports/TestResults_TestRun_2024-01-15...csv
```

### Step 5: Run All Tests (One Command)

```bash
npm run test:all
```

This runs all three commands in sequence:
1. Initialize test database
2. Execute all tests
3. Generate report

---

## 📁 Test Infrastructure File Structure

```
/Users/susantalabala/demo/
├── backend/
│   ├── src/
│   │   ├── initTestDatabase.js       ✨ Creates test database schema
│   │   └── server.js
│   ├── tests/
│   │   ├── runTests.js               ✨ Main test execution script
│   │   └── generateReport.js         ✨ Report generation
│   ├── reports/                      📊 Generated HTML/CSV reports
│   │   ├── TestReport_*.html
│   │   └── TestResults_*.csv
│   └── package.json                  ✨ Updated with test scripts
├── tests/
│   └── screenshots/                  📸 Captured test screenshots
│       ├── login/
│       ├── registration/
│       ├── dashboard/
│       ├── admin/
│       ├── api/
│       ├── database/
│       └── security/
├── TEST_CASES.md                     📋 Test case documentation
└── DATABASE_LOCATION_GUIDE.md
```

---

## 🗄️ Database Schema

### test_cases Table
Stores all test case definitions:

```sql
CREATE TABLE test_cases (
  id INT PRIMARY KEY AUTO_INCREMENT,
  testId VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  description VARCHAR(500) NOT NULL,
  priority ENUM('High', 'Medium', 'Low'),
  steps TEXT,
  expectedResult TEXT,
  testData TEXT,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

### test_executions Table
Records every test execution:

```sql
CREATE TABLE test_executions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  testCaseId INT NOT NULL,
  executionDate TIMESTAMP DEFAULT NOW(),
  executedBy VARCHAR(100),
  status ENUM('Pass', 'Fail', 'Blocked', 'Skipped'),
  actualResult TEXT,
  remarks TEXT,
  screenshotPath VARCHAR(500),           -- Path to captured screenshot
  executionTime INT,                     -- Milliseconds
  browserVersion VARCHAR(100),
  osVersion VARCHAR(100),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY(testCaseId) REFERENCES test_cases(id)
);
```

### test_summaries Table
Aggregates results for each test run:

```sql
CREATE TABLE test_summaries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  testRunId VARCHAR(50) UNIQUE NOT NULL,
  totalTests INT DEFAULT 0,
  passedTests INT DEFAULT 0,
  failedTests INT DEFAULT 0,
  blockedTests INT DEFAULT 0,
  skippedTests INT DEFAULT 0,
  passPercentage DECIMAL(5,2),
  executionDuration INT,                 -- Seconds
  environment VARCHAR(100),
  notes TEXT,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

---

## 📸 Screenshot Structure

Screenshots are automatically organized by test category:

```
/tests/screenshots/
├── login/
│   ├── TC-Login-001_1234567890.png
│   ├── TC-Login-002_1234567891.png
│   └── TC-Login-002_ERROR_1234567892.png
├── registration/
│   ├── TC-Register-001_1234567893.png
│   └── TC-Register-002_1234567894.png
├── dashboard/
│   ├── TC-Dashboard-001_1234567895.png
│   ├── TC-Dashboard-002_1234567896.png
│   └── TC-Dashboard-003_1234567897.png
├── admin/
│   └── TC-AdminLogin-001_1234567898.png
├── api/
│   ├── TC-API-001_1234567899.png
│   └── TC-API-002_1234567900.png
├── database/
│   ├── TC-Database-001_1234567901.png
│   └── TC-Database-002_1234567902.png
└── security/
    └── (Security test screenshots)
```

Each screenshot filename includes:
- **Test ID**: `TC-Login-001`
- **Timestamp**: `1234567890` (milliseconds, for uniqueness)
- **Type**: Regular or `_ERROR_` for failure screenshots

---

## 🧪 Test Categories & Count

| Category | Tests | Priority |
|----------|-------|----------|
| Farmer Login | 6 | High |
| Admin Login | 4 | High |
| Registration | 7 | High |
| Dashboard | 9 | High |
| SchemeList | 3 | High |
| Database | 4 | High |
| Responsive Design | 3 | Medium |
| API | 4 | High |
| Performance | 3 | Medium |
| Security | 3 | High |
| **TOTAL** | **46** | - |

---

## 🔍 Available Test Commands

### Initialize Test Database
```bash
npm run init:test-db
```
- Creates table structure
- Seeds initial test cases
- Prepares database for test execution
- Run this ONCE before first test execution

### Run Automated Tests
```bash
npm run run:tests
```
- Executes all test cases sequentially
- Captures screenshots for each test
- Stores results in `test_executions` table
- Creates summary in `test_summaries` table
- Run this whenever you need to test the system

### Generate Test Report
```bash
npm run test:report
```
- Creates HTML report with visual styling
- Exports CSV for analysis
- Groups results by category
- Shows pass/fail statistics
- Includes screenshot links
- Run this after test execution to view results

### Run Everything (Recommended)
```bash
npm run test:all
```
- Runs all three commands in proper sequence
- One-command solution for complete testing
- Recommended for regular test cycles

---

## 📊 Viewing Test Results

### Option 1: HTML Report (Recommended)
After running `npm run test:report`:

```bash
# Open in browser (macOS)
open backend/reports/TestReport_*.html

# Open in browser (Linux)
xdg-open backend/reports/TestReport_*.html

# Open in browser (Windows)
start backend/reports/TestReport_*.html
```

Features:
- Beautiful gradient design
- Color-coded status badges
- Clickable screenshot links
- Statistics and progress bar
- Pass rate percentage
- Printable format

### Option 2: CSV Export
```bash
# View CSV in spreadsheet
open backend/reports/TestResults_*.csv
```

Useful for:
- Data analysis in Excel/Sheets
- Import into other testing tools
- Track metrics over time
- Generate custom reports

### Option 3: Database Query
```bash
# View raw test results
psql farmer_scheme_db -U susantalabala

# Get latest test execution
SELECT * FROM test_executions 
ORDER BY executionDate DESC 
LIMIT 20;

# Get test summary
SELECT * FROM test_summaries 
ORDER BY createdAt DESC 
LIMIT 5;

# Get results by category
SELECT 
  tc.category,
  COUNT(*) as total,
  SUM(CASE WHEN te.status = 'Pass' THEN 1 ELSE 0 END) as passed,
  SUM(CASE WHEN te.status = 'Fail' THEN 1 ELSE 0 END) as failed
FROM test_cases tc
JOIN test_executions te ON tc.id = te.testCaseId
GROUP BY tc.category;
```

---

## ⚙️ Configuration

### Environment Variables
Ensure `.env` file in `/backend` contains:

```env
DB_NAME=farmer_scheme_db
DB_USER=susantalabala
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3000
```

### Test Configuration
Edit `/backend/tests/runTests.js` to customize:

- **Browser Options**: Change headless mode, set visible window
- **Timeouts**: Adjust wait times for slow connections
- **Test Cases**: Add new tests to `testScripts` object
- **Screenshot Options**: Full page vs viewport only

Example:
```javascript
// In runTests.js
browser = await puppeteer.launch({
  headless: false,  // Set to false to see browser
  args: ['--no-sandbox']
});
```

---

## 🐛 Troubleshooting

### Issue: "puppeteer not found"
```bash
npm install --save-dev puppeteer
```

### Issue: "Cannot connect to database"
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Check database exists
psql -l | grep farmer_scheme_db

# Verify .env credentials
cat .env
```

### Issue: "Connection refused on port 3000/5001"
```bash
# Ensure servers are running
npm start          # Terminal 1 - Backend
npm start          # Terminal 2 - Frontend

# Or start both with:
cd frontend && npm start &
cd ../backend && npm start &
```

### Issue: "Browser crashed" or "Failed to launch Chromium"
```bash
# Install missing dependencies (Linux)
sudo apt-get install libx11-6 libxext6 libxrender1

# Clear Puppeteer cache and reinstall
rm -rf node_modules/.bin/chromium-*
npm install --save-dev puppeteer
```

### Issue: "Timeout waiting for selector"
The element might not exist or page loading is slow:
- Increase timeout: `{ timeout: 10000 }` (10 seconds)
- Check if page structure matches test expectations
- Verify server is running and responsive

---

## 📈 Metrics & Analysis

### Key Metrics Captured

1. **Pass Rate**: Percentage of passed tests
2. **Execution Time**: Total time for test run
3. **Per-Test Duration**: Individual test execution time
4. **Category Breakdown**: Tests passed/failed by category
5. **Priority Analysis**: High vs Medium vs Low priority results

### SQL Queries for Analytics

```sql
-- Average test duration by category
SELECT 
  tc.category,
  AVG(te.executionTime) as avg_duration_ms,
  COUNT(*) as total_executions
FROM test_cases tc
JOIN test_executions te ON tc.id = te.testCaseId
GROUP BY tc.category
ORDER BY avg_duration_ms DESC;

-- Failure rate by category
SELECT 
  tc.category,
  COUNT(*) as total_tests,
  SUM(CASE WHEN te.status = 'Fail' THEN 1 ELSE 0 END) as failed_count,
  ROUND(100.0 * SUM(CASE WHEN te.status = 'Fail' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate
FROM test_cases tc
JOIN test_executions te ON tc.id = te.testCaseId
GROUP BY tc.category;

-- Test runs trend
SELECT 
  testRunId,
  totalTests,
  passedTests,
  failedTests,
  passPercentage,
  createdAt
FROM test_summaries
ORDER BY createdAt DESC
LIMIT 10;

-- Find flaky tests (tests that sometimes fail)
SELECT 
  testId,
  description,
  COUNT(*) as execution_count,
  SUM(CASE WHEN status = 'Pass' THEN 1 ELSE 0 END) as pass_count,
  SUM(CASE WHEN status = 'Fail' THEN 1 ELSE 0 END) as fail_count,
  ROUND(100.0 * SUM(CASE WHEN status = 'Fail' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate
FROM test_cases tc
JOIN test_executions te ON tc.id = te.testCaseId
GROUP BY testId, description
HAVING COUNT(*) > 1
ORDER BY failure_rate DESC;
```

---

## 🚦 CI/CD Integration

### GitHub Actions Example
```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: farmer_scheme_db
          POSTGRES_USER: github
          POSTGRES_PASSWORD: github
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd backend && npm install
      
      - name: Start servers
        run: |
          npm start &
          cd ../frontend && npm start &
      
      - name: Initialize test DB
        run: cd backend && npm run init:test-db
      
      - name: Run tests
        run: cd backend && npm run run:tests
      
      - name: Generate report
        run: cd backend && npm run test:report
      
      - name: Upload report
        uses: actions/upload-artifact@v3
        with:
          name: test-reports
          path: backend/reports/
```

---

## 📝 Adding New Tests

To add a new test case:

### 1. Add to test_cases table
```javascript
// In initTestDatabase.js
{
  testId: 'TC-NewCategory-001',
  category: 'New Category',
  description: 'Test description',
  priority: 'High',
  steps: '1. Step 1\n2. Step 2\n3. Step 3',
  expectedResult: 'Expected outcome',
  testData: 'Test data needed'
}
```

### 2. Add execution script
```javascript
// In runTests.js
'TC-NewCategory-001': {
  description: 'Test description',
  execute: async (page) => {
    try {
      // Test implementation
      await page.goto('http://localhost:3000/page');
      // ... test steps ...
      return { status: 'Pass', actualResult: 'Success message' };
    } catch (error) {
      return { status: 'Fail', actualResult: error.message };
    }
  }
}
```

### 3. Run tests
```bash
npm run test:all
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Database created: `farmer_scheme_db`
- [ ] Backend running: `http://localhost:5001`
- [ ] Frontend running: `http://localhost:3000`
- [ ] Test tables created: `test_cases`, `test_executions`, `test_summaries`
- [ ] Test cases seeded: 12+ records
- [ ] Screenshots directory created: `/tests/screenshots/`
- [ ] First test run executed: `npm run run:tests`
- [ ] Report generated: HTML and CSV files
- [ ] Results visible in database: Query `test_executions` table

---

## 📞 Support & Contact

For issues or questions about the test infrastructure:

1. Check the Troubleshooting section above
2. Review database connection settings
3. Ensure all servers are running
4. Check browser console for errors
5. Review test logs in terminal output

---

## 📚 Additional Resources

- [TEST_CASES.md](./TEST_CASES.md) - Comprehensive test case documentation
- [DATABASE_LOCATION_GUIDE.md](./DATABASE_LOCATION_GUIDE.md) - Database setup guide
- [Puppeteer Documentation](https://pptr.dev/)
- [Sequelize Documentation](https://sequelize.org/)
- [Jest Documentation](https://jestjs.io/)

---

**Last Updated:** 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅
