/**
 * Test Runner Script
 * Executes test cases, captures screenshots, and logs results to database
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

// Define models
const TestCase = sequelize.define('TestCase', {
  id: { type: Sequelize.INTEGER, primaryKey: true },
  testId: { type: Sequelize.STRING },
  category: { type: Sequelize.STRING },
  description: { type: Sequelize.STRING },
  priority: { type: Sequelize.ENUM('High', 'Medium', 'Low') }
}, { tableName: 'test_cases', timestamps: false });

const TestExecution = sequelize.define('TestExecution', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  testCaseId: { type: Sequelize.INTEGER },
  status: { type: Sequelize.ENUM('Pass', 'Fail', 'Blocked', 'Skipped') },
  actualResult: { type: Sequelize.TEXT },
  screenshotPath: { type: Sequelize.STRING },
  executionTime: { type: Sequelize.INTEGER },
  executionDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'test_executions', timestamps: true });

const TestSummary = sequelize.define('TestSummary', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  testRunId: { type: Sequelize.STRING, unique: true },
  totalTests: { type: Sequelize.INTEGER },
  passedTests: { type: Sequelize.INTEGER },
  failedTests: { type: Sequelize.INTEGER },
  blockedTests: { type: Sequelize.INTEGER },
  passPercentage: { type: Sequelize.DECIMAL(5, 2) }
}, { tableName: 'test_summaries', timestamps: false });

// Create screenshot directories
function createScreenshotDirs() {
  const baseDir = path.join(__dirname, '../../tests/screenshots');
  const categories = ['login', 'registration', 'dashboard', 'api', 'database', 'security', 'admin'];
  
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
  
  categories.forEach(cat => {
    const catDir = path.join(baseDir, cat);
    if (!fs.existsSync(catDir)) {
      fs.mkdirSync(catDir, { recursive: true });
    }
  });
  
  return baseDir;
}

// Test execution functions
const testScripts = {
  'TC-Login-001': {
    description: 'Test farmer login with valid credentials',
    execute: async (page) => {
      try {
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
        await page.waitForSelector('input[type="email"]', { timeout: 5000 });
        await page.type('input[type="email"]', 'rajesh@example.com');
        await page.type('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
        
        const currentUrl = page.url();
        if (currentUrl.includes('dashboard')) {
          return { status: 'Pass', actualResult: 'Successfully logged in and redirected to dashboard' };
        } else {
          return { status: 'Fail', actualResult: `Unexpected URL: ${currentUrl}` };
        }
      } catch (error) {
        return { status: 'Fail', actualResult: `Error: ${error.message}` };
      }
    }
  },
  
  'TC-Login-002': {
    description: 'Test login with invalid email format',
    execute: async (page) => {
      try {
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
        await page.waitForSelector('input[type="email"]', { timeout: 5000 });
        await page.type('input[type="email"]', 'invalidemail');
        await page.type('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');
        
        // Wait for error message
        const errorVisible = await page.waitForSelector('.error-message, .alert-danger', { timeout: 5000 }).catch(() => false);
        
        if (errorVisible) {
          return { status: 'Pass', actualResult: 'Error message displayed for invalid email' };
        } else {
          return { status: 'Fail', actualResult: 'No error message displayed' };
        }
      } catch (error) {
        return { status: 'Fail', actualResult: `Error: ${error.message}` };
      }
    }
  },

  'TC-AdminLogin-001': {
    description: 'Test admin login with valid credentials',
    execute: async (page) => {
      try {
        await page.goto('http://localhost:3000/admin-login', { waitUntil: 'networkidle2' });
        await page.waitForSelector('input[type="email"]', { timeout: 5000 });
        await page.type('input[type="email"]', 'admin@example.com');
        await page.type('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
        
        const currentUrl = page.url();
        if (currentUrl.includes('admin-dashboard')) {
          return { status: 'Pass', actualResult: 'Successfully logged in as admin' };
        } else {
          return { status: 'Fail', actualResult: `Unexpected URL: ${currentUrl}` };
        }
      } catch (error) {
        return { status: 'Fail', actualResult: `Error: ${error.message}` };
      }
    }
  },

  'TC-Dashboard-001': {
    description: 'Test dashboard page loads',
    execute: async (page) => {
      try {
        await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2' });
        const schemsPresent = await page.$$('.scheme-card, .card');
        
        if (schemsPresent.length > 0) {
          return { status: 'Pass', actualResult: `Dashboard loaded with ${schemsPresent.length} schemes displayed` };
        } else {
          return { status: 'Fail', actualResult: 'No schemes displayed on dashboard' };
        }
      } catch (error) {
        return { status: 'Fail', actualResult: `Error: ${error.message}` };
      }
    }
  },

  'TC-Dashboard-002': {
    description: 'Test search schemes',
    execute: async (page) => {
      try {
        await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2' });
        const searchInput = await page.$('input[placeholder*="Search"], input[type="text"]');
        
        if (searchInput) {
          await page.type('input[placeholder*="Search"], input[type="text"]', 'Kisan');
          await page.waitForTimeout(1000);
          
          const filteredSchemes = await page.$$('.scheme-card, .card');
          return { status: 'Pass', actualResult: `Search returned ${filteredSchemes.length} results` };
        } else {
          return { status: 'Fail', actualResult: 'Search input not found' };
        }
      } catch (error) {
        return { status: 'Fail', actualResult: `Error: ${error.message}` };
      }
    }
  },

  'TC-API-001': {
    description: 'Test health check endpoint',
    execute: async () => {
      try {
        const response = await fetch('http://localhost:5001/health');
        if (response.status === 200) {
          const data = await response.json();
          return { status: 'Pass', actualResult: `Health check passed: ${data.status || 'OK'}` };
        } else {
          return { status: 'Fail', actualResult: `Health check failed with status ${response.status}` };
        }
      } catch (error) {
        return { status: 'Fail', actualResult: `Error: ${error.message}` };
      }
    }
  },

  'TC-API-002': {
    description: 'Test get schemes endpoint',
    execute: async () => {
      try {
        const response = await fetch('http://localhost:5001/api/schemes');
        if (response.status === 200) {
          const data = await response.json();
          const schemeCount = Array.isArray(data) ? data.length : data.data?.length || 0;
          return { status: 'Pass', actualResult: `Retrieved ${schemeCount} schemes from API` };
        } else {
          return { status: 'Fail', actualResult: `API request failed with status ${response.status}` };
        }
      } catch (error) {
        return { status: 'Fail', actualResult: `Error: ${error.message}` };
      }
    }
  },

  'TC-Database-001': {
    description: 'Test user data persistence',
    execute: async () => {
      try {
        const response = await fetch('http://localhost:5001/api/users');
        const data = await response.json();
        const userCount = Array.isArray(data) ? data.length : 0;
        
        if (userCount > 0) {
          return { status: 'Pass', actualResult: `Database contains ${userCount} user records` };
        } else {
          return { status: 'Fail', actualResult: 'No user records found in database' };
        }
      } catch (error) {
        return { status: 'Fail', actualResult: `Error: ${error.message}` };
      }
    }
  }
};

// Main test runner
async function runTests() {
  console.log('\n🚀 Starting Test Execution...\n');
  const startTime = Date.now();
  const runId = `TestRun_${new Date().toISOString().replace(/[:.]/g, '-')}`;
  let browser;

  try {
    // Ensure database is ready
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // Create screenshot directories
    const screenshotBaseDir = createScreenshotDirs();
    console.log(`📁 Screenshot directories created at: ${screenshotBaseDir}\n`);

    // Get all test cases
    const testCases = await TestCase.findAll();
    console.log(`📋 Found ${testCases.length} test cases to execute\n`);

    // Initialize browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    let passCount = 0;
    let failCount = 0;
    let blockCount = 0;

    // Execute each test case
    for (const testCase of testCases) {
      const testStartTime = Date.now();
      const page = await browser.newPage();
      let status = 'Blocked';
      let actualResult = 'Test not executed';
      let screenshotPath = null;

      console.log(`\n🧪 Executing: ${testCase.testId} - ${testCase.description}`);

      try {
        const testScript = testScripts[testCase.testId];

        if (!testScript) {
          console.log(`   ⏭️  Skipping: Test script not implemented`);
          status = 'Skipped';
        } else {
          // Execute test
          const result = await testScript.execute(page);
          status = result.status;
          actualResult = result.actualResult;

          // Capture screenshot
          const categoryDir = testCase.category.toLowerCase().replace(/\s+/g, '-');
          const screenshotFileName = `${testCase.testId}_${new Date().getTime()}.png`;
          screenshotPath = path.join(screenshotBaseDir, categoryDir, screenshotFileName);

          await page.screenshot({
            path: screenshotPath,
            fullPage: true
          });

          // Store relative path for database
          const relativePath = `tests/screenshots/${categoryDir}/${screenshotFileName}`;

          // Save execution result
          await TestExecution.create({
            testCaseId: testCase.id,
            status: status,
            actualResult: actualResult,
            screenshotPath: relativePath,
            executionTime: Date.now() - testStartTime,
            executionDate: new Date(),
            osVersion: process.platform,
            browserVersion: 'Chromium/Puppeteer'
          });

          // Count results
          if (status === 'Pass') passCount++;
          else if (status === 'Fail') failCount++;
          else blockCount++;

          console.log(`   ✓ Status: ${status}`);
          console.log(`   ✓ Result: ${actualResult.substring(0, 100)}...`);
          console.log(`   📸 Screenshot: ${relativePath}`);
        }
      } catch (error) {
        console.log(`   ✗ Error: ${error.message}`);
        status = 'Fail';
        actualResult = error.message;
        failCount++;

        // Capture screenshot on error
        try {
          const categoryDir = testCase.category.toLowerCase().replace(/\s+/g, '-');
          const screenshotFileName = `${testCase.testId}_ERROR_${new Date().getTime()}.png`;
          const errorScreenshotPath = path.join(screenshotBaseDir, categoryDir, screenshotFileName);
          
          await page.screenshot({
            path: errorScreenshotPath,
            fullPage: true
          });

          const relativePath = `tests/screenshots/${categoryDir}/${screenshotFileName}`;
          
          await TestExecution.create({
            testCaseId: testCase.id,
            status: 'Fail',
            actualResult: actualResult,
            screenshotPath: relativePath,
            executionTime: Date.now() - testStartTime,
            executionDate: new Date()
          });
        } catch (screenshotError) {
          console.log(`   ⚠️  Could not capture error screenshot: ${screenshotError.message}`);
        }
      } finally {
        await page.close();
      }
    }

    // Generate summary
    const totalTests = testCases.length;
    const passPercentage = ((passCount / totalTests) * 100).toFixed(2);
    const executionDuration = Math.round((Date.now() - startTime) / 1000);

    await TestSummary.create({
      testRunId: runId,
      totalTests: totalTests,
      passedTests: passCount,
      failedTests: failCount,
      blockedTests: blockCount,
      passPercentage: parseFloat(passPercentage),
      executionDuration: executionDuration,
      environment: 'Local Development'
    });

    // Display summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST EXECUTION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Test Run ID: ${runId}`);
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`⏭️  Blocked/Skipped: ${blockCount}`);
    console.log(`📈 Pass Rate: ${passPercentage}%`);
    console.log(`⏱️  Duration: ${executionDuration}s`);
    console.log('='.repeat(60));
    console.log('\n📸 Screenshots saved in: ' + screenshotBaseDir);
    console.log('📊 Results saved in: test_executions table');
    console.log('📈 Summary saved in: test_summaries table\n');

    await browser.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Test execution error:', error.message);
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

// Run tests
runTests();
