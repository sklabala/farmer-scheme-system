/**
 * Database Schema for Test Results
 * Creates tables to track test execution and results
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log,
  }
);

// Test Cases Table
const TestCase = sequelize.define('TestCase', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  testId: {
    type: Sequelize.STRING(50),
    allowNull: false,
    unique: true
  },
  category: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  description: {
    type: Sequelize.STRING(500),
    allowNull: false
  },
  priority: {
    type: Sequelize.ENUM('High', 'Medium', 'Low'),
    defaultValue: 'Medium'
  },
  steps: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  expectedResult: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  testData: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'test_cases',
  timestamps: false
});

// Test Execution Table
const TestExecution = sequelize.define('TestExecution', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  testCaseId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'test_cases',
      key: 'id'
    }
  },
  executionDate: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  executedBy: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  status: {
    type: Sequelize.ENUM('Pass', 'Fail', 'Blocked', 'Skipped'),
    defaultValue: 'Blocked'
  },
  actualResult: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  remarks: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  screenshotPath: {
    type: Sequelize.STRING(500),
    allowNull: true
  },
  executionTime: {
    type: Sequelize.INTEGER,
    allowNull: true,
    comment: 'Time in milliseconds'
  },
  browserVersion: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  osVersion: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    primaryKey: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'test_executions',
  timestamps: true
});

// Test Bugs Table
const TestBug = sequelize.define('TestBug', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bugId: {
    type: Sequelize.STRING(50),
    allowNull: false,
    unique: true
  },
  testExecutionId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'test_executions',
      key: 'id'
    }
  },
  title: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  severity: {
    type: Sequelize.ENUM('Critical', 'High', 'Medium', 'Low'),
    defaultValue: 'Medium'
  },
  status: {
    type: Sequelize.ENUM('Open', 'In Progress', 'Closed', 'Reopened'),
    defaultValue: 'Open'
  },
  assignedTo: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  screenshotPath: {
    type: Sequelize.STRING(500),
    allowNull: true
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'test_bugs',
  timestamps: true
});

// Test Summary Table
const TestSummary = sequelize.define('TestSummary', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  testRunId: {
    type: Sequelize.STRING(50),
    allowNull: false,
    unique: true
  },
  totalTests: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  passedTests: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  failedTests: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  blockedTests: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  skippedTests: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  passPercentage: {
    type: Sequelize.DECIMAL(5, 2),
    allowNull: true
  },
  executionDuration: {
    type: Sequelize.INTEGER,
    allowNull: true,
    comment: 'Duration in seconds'
  },
  environment: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  notes: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'test_summaries',
  timestamps: false
});

// Initialize Testing Database
async function initializeTestDatabase() {
  try {
    console.log('\n🧪 Starting Test Database Initialization...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful!\n');

    // Sync models (create tables if they don't exist)
    console.log('📋 Creating test tables...');
    await sequelize.sync({ alter: false });
    console.log('✅ Test tables created/verified!\n');

    // Seed test cases
    console.log('🌱 Seeding test cases...\n');

    const testCases = [
      // Login Tests
      {
        testId: 'TC-Login-001',
        category: 'Farmer Login',
        description: 'Test farmer login with valid credentials',
        priority: 'High',
        steps: '1. Open login page\n2. Enter email\n3. Enter password\n4. Click Login',
        expectedResult: 'User redirected to Dashboard',
        testData: 'Email: rajesh@example.com, Password: password123'
      },
      {
        testId: 'TC-Login-002',
        category: 'Farmer Login',
        description: 'Test login with invalid email format',
        priority: 'High',
        steps: '1. Enter invalid email\n2. Click Login',
        expectedResult: 'Error message displayed',
        testData: 'Email: invalidemail'
      },
      {
        testId: 'TC-AdminLogin-001',
        category: 'Admin Login',
        description: 'Test admin login with valid credentials',
        priority: 'High',
        steps: '1. Open admin login\n2. Enter credentials\n3. Click Login',
        expectedResult: 'Redirected to Admin Dashboard',
        testData: 'Username: admin, Password: admin123'
      },
      // Registration Tests
      {
        testId: 'TC-Register-001',
        category: 'Registration',
        description: 'Complete registration with valid data',
        priority: 'High',
        steps: '1. Fill registration form\n2. Accept terms\n3. Submit',
        expectedResult: 'Success message displayed',
        testData: 'All fields with valid data'
      },
      {
        testId: 'TC-Register-002',
        category: 'Registration',
        description: 'Test duplicate email',
        priority: 'High',
        steps: '1. Enter existing email\n2. Submit',
        expectedResult: 'Error message "Email already registered"',
        testData: 'Email: rajesh@example.com'
      },
      // Dashboard Tests
      {
        testId: 'TC-Dashboard-001',
        category: 'Dashboard',
        description: 'Test dashboard page loads',
        priority: 'High',
        steps: '1. Login\n2. Navigate to dashboard',
        expectedResult: 'Dashboard displays all schemes',
        testData: 'N/A'
      },
      {
        testId: 'TC-Dashboard-002',
        category: 'Dashboard',
        description: 'Test search schemes',
        priority: 'High',
        steps: '1. Open dashboard\n2. Search "Kisan"',
        expectedResult: 'Filtered schemes displayed',
        testData: 'Search: Kisan'
      },
      {
        testId: 'TC-Dashboard-003',
        category: 'Dashboard',
        description: 'Test category filter - Subsidy',
        priority: 'High',
        steps: '1. Click Subsidy filter',
        expectedResult: 'Only subsidy schemes shown',
        testData: 'N/A'
      },
      // API Tests
      {
        testId: 'TC-API-001',
        category: 'API',
        description: 'Test health check endpoint',
        priority: 'High',
        steps: 'Call http://localhost:5001/health',
        expectedResult: 'Returns 200 with status message',
        testData: 'GET /health'
      },
      {
        testId: 'TC-API-002',
        category: 'API',
        description: 'Test get schemes endpoint',
        priority: 'High',
        steps: 'Call http://localhost:5001/api/schemes',
        expectedResult: 'Returns JSON array with schemes',
        testData: 'GET /api/schemes'
      },
      // Database Tests
      {
        testId: 'TC-Database-001',
        category: 'Database',
        description: 'Test user data persistence',
        priority: 'High',
        steps: '1. Register user\n2. Query database',
        expectedResult: 'User record exists in database',
        testData: 'N/A'
      },
      {
        testId: 'TC-Database-002',
        category: 'Database',
        description: 'Test application data persistence',
        priority: 'High',
        steps: '1. Apply to scheme\n2. Query database',
        expectedResult: 'Application record created',
        testData: 'N/A'
      }
    ];

    await TestCase.bulkCreate(testCases);
    console.log(`✅ Seeded ${testCases.length} test cases`);

    console.log('\n✨ Test Database initialization complete!\n');
    console.log('📊 Database Summary:');
    console.log(`   - Test Cases: ${testCases.length}`);
    console.log('\n🎯 Next Steps:');
    console.log('   1. Run tests with: node runTests.js');
    console.log('   2. View results: SELECT * FROM test_executions;');
    console.log('   3. Generate report: node generateTestReport.js\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Initialization error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run initialization
initializeTestDatabase();
