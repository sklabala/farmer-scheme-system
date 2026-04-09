/**
 * Test Report Generator
 * Generates HTML reports from test execution results
 */

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize database
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
  id: { type: Sequelize.INTEGER, primaryKey: true },
  testCaseId: { type: Sequelize.INTEGER },
  status: { type: Sequelize.ENUM('Pass', 'Fail', 'Blocked', 'Skipped') },
  actualResult: { type: Sequelize.TEXT },
  screenshotPath: { type: Sequelize.STRING },
  executionTime: { type: Sequelize.INTEGER },
  executionDate: { type: Sequelize.DATE }
}, { tableName: 'test_executions', timestamps: true });

const TestSummary = sequelize.define('TestSummary', {
  id: { type: Sequelize.INTEGER, primaryKey: true },
  testRunId: { type: Sequelize.STRING },
  totalTests: { type: Sequelize.INTEGER },
  passedTests: { type: Sequelize.INTEGER },
  failedTests: { type: Sequelize.INTEGER },
  blockedTests: { type: Sequelize.INTEGER },
  passPercentage: { type: Sequelize.DECIMAL(5, 2) },
  executionDuration: { type: Sequelize.INTEGER }
}, { tableName: 'test_summaries', timestamps: false });

// Define associations
TestExecution.belongsTo(TestCase, {
  foreignKey: 'testCaseId',
  targetKey: 'id'
});

// Generate HTML Report
async function generateReport() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // Get latest test run
    const latestSummary = await TestSummary.findOne({
      order: [['id', 'DESC']],
      limit: 1
    });

    if (!latestSummary) {
      console.log('❌ No test results found. Please run tests first.');
      process.exit(1);
    }

    console.log(`📊 Generating report for: ${latestSummary.testRunId}\n`);

    // Get all executions for this run (approximation - all recent)
    const executions = await TestExecution.findAll({
      include: [{
        model: TestCase,
        attributes: ['testId', 'category', 'description', 'priority']
      }],
      order: [['createdAt', 'DESC']],
      limit: 100
    });

    // Group by category
    const byCategory = {};
    executions.forEach(exec => {
      const cat = exec.TestCase.category;
      if (!byCategory[cat]) {
        byCategory[cat] = [];
      }
      byCategory[cat].push(exec);
    });

    // Generate HTML
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Execution Report - ${latestSummary.testRunId}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 40px;
            background: #f8f9fa;
        }
        
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #667eea;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .summary-card h3 {
            color: #666;
            font-size: 0.9em;
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        
        .summary-card .number {
            font-size: 2.5em;
            font-weight: bold;
            color: #667eea;
        }
        
        .summary-card.passed .number { color: #28a745; }
        .summary-card.failed .number { color: #dc3545; }
        .summary-card.blocked .number { color: #ffc107; }
        .summary-card.total .number { color: #667eea; }
        
        .summary-card.passed { border-left-color: #28a745; }
        .summary-card.failed { border-left-color: #dc3545; }
        .summary-card.blocked { border-left-color: #ffc107; }
        
        .progress-section {
            padding: 40px;
            text-align: center;
        }
        
        .progress-bar {
            width: 100%;
            height: 30px;
            background: #e9ecef;
            border-radius: 15px;
            overflow: hidden;
            margin-bottom: 20px;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            transition: width 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 0.9em;
        }
        
        .results {
            padding: 40px;
        }
        
        .category {
            margin-bottom: 30px;
        }
        
        .category-header {
            background: #f8f9fa;
            padding: 15px 20px;
            border-left: 4px solid #667eea;
            margin-bottom: 15px;
            border-radius: 4px;
        }
        
        .category-header h3 {
            color: #333;
        }
        
        .test-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        
        .test-table thead {
            background: #f8f9fa;
        }
        
        .test-table th {
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #dee2e6;
        }
        
        .test-table td {
            padding: 12px;
            border-bottom: 1px solid #dee2e6;
        }
        
        .test-table tbody tr:hover {
            background: #f8f9fa;
        }
        
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-pass {
            background: #d4edda;
            color: #155724;
        }
        
        .status-fail {
            background: #f8d7da;
            color: #721c24;
        }
        
        .status-blocked {
            background: #fff3cd;
            color: #856404;
        }
        
        .priority-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: 600;
        }
        
        .priority-high {
            background: #ffe0e0;
            color: #c00;
        }
        
        .priority-medium {
            background: #fff4e0;
            color: #c80;
        }
        
        .priority-low {
            background: #e0f0ff;
            color: #008;
        }
        
        .screenshot-link {
            color: #667eea;
            text-decoration: none;
            font-size: 0.9em;
        }
        
        .screenshot-link:hover {
            text-decoration: underline;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            border-top: 1px solid #dee2e6;
        }
        
        .timestamp {
            color: #999;
            font-size: 0.9em;
        }
        
        @media print {
            body {
                background: white;
            }
            
            .container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Test Execution Report</h1>
            <p>Farmer Scheme System - Quality Assurance</p>
            <p class="timestamp">${new Date(latestSummary.createdAt).toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card total">
                <h3>Total Tests</h3>
                <div class="number">${latestSummary.totalTests}</div>
            </div>
            <div class="summary-card passed">
                <h3>Passed</h3>
                <div class="number">${latestSummary.passedTests}</div>
            </div>
            <div class="summary-card failed">
                <h3>Failed</h3>
                <div class="number">${latestSummary.failedTests}</div>
            </div>
            <div class="summary-card blocked">
                <h3>Blocked/Skipped</h3>
                <div class="number">${latestSummary.blockedTests}</div>
            </div>
        </div>
        
        <div class="progress-section">
            <h3>Pass Rate</h3>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${latestSummary.passPercentage}%">
                    ${latestSummary.passPercentage}%
                </div>
            </div>
            <p>Execution Time: ${latestSummary.executionDuration}s</p>
        </div>
        
        <div class="results">
            <h2>📋 Test Results by Category</h2>
            ${Object.entries(byCategory).map(([category, tests]) => `
                <div class="category">
                    <div class="category-header">
                        <h3>${category} (${tests.length} tests)</h3>
                    </div>
                    <table class="test-table">
                        <thead>
                            <tr>
                                <th>Test ID</th>
                                <th>Description</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Execution Time</th>
                                <th>Screenshot</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tests.map(test => `
                                <tr>
                                    <td><strong>${test.TestCase.testId}</strong></td>
                                    <td>${test.TestCase.description}</td>
                                    <td><span class="priority-badge priority-${test.TestCase.priority?.toLowerCase() || 'medium'}">${test.TestCase.priority || 'Medium'}</span></td>
                                    <td><span class="status-badge status-${test.status.toLowerCase()}">${test.status}</span></td>
                                    <td>${test.executionTime}ms</td>
                                    <td>${test.screenshotPath ? `<a href="${test.screenshotPath}" class="screenshot-link" target="_blank">📸 View</a>` : '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `).join('')}
        </div>
        
        <div class="footer">
            <p><strong>Test Run ID:</strong> ${latestSummary.testRunId}</p>
            <p><strong>Environment:</strong> Local Development</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <p style="margin-top: 15px; color: #ccc; font-size: 0.9em;">Farmer Scheme System © 2024</p>
        </div>
    </div>
</body>
</html>
    `;

    // Save report
    const reportDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportFile = path.join(reportDir, `TestReport_${latestSummary.testRunId}.html`);
    fs.writeFileSync(reportFile, html);

    console.log('✅ Report generated successfully!');
    console.log(`📄 Report saved to: ${reportFile}\n`);
    
    // Also generate CSV for data analysis
    const csvContent = generateCSVReport(executions, latestSummary);
    const csvFile = path.join(reportDir, `TestResults_${latestSummary.testRunId}.csv`);
    fs.writeFileSync(csvFile, csvContent);
    console.log(`📊 CSV export saved to: ${csvFile}\n`);

    console.log('📊 TEST REPORT SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${latestSummary.totalTests}`);
    console.log(`Passed: ${latestSummary.passedTests} ✅`);
    console.log(`Failed: ${latestSummary.failedTests} ❌`);
    console.log(`Blocked: ${latestSummary.blockedTests} ⏭️`);
    console.log(`Pass Rate: ${latestSummary.passPercentage}%`);
    console.log(`Duration: ${latestSummary.executionDuration}s`);
    console.log('='.repeat(50) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Report generation error:', error.message);
    process.exit(1);
  }
}

// Generate CSV Report
function generateCSVReport(executions, summary) {
  let csv = 'Test Run ID,Date,Total Tests,Passed,Failed,Blocked,Pass %\n';
  csv += `"${summary.testRunId}","${new Date(summary.createdAt).toLocaleString()}",${summary.totalTests},${summary.passedTests},${summary.failedTests},${summary.blockedTests},${summary.passPercentage}\n\n`;
  
  csv += 'Test ID,Category,Description,Priority,Status,Result,Execution Time (ms),Screenshot Path\n';
  
  executions.forEach(exec => {
    const testId = exec.TestCase.testId.replace(/"/g, '""');
    const desc = exec.TestCase.description.replace(/"/g, '""');
    const result = (exec.actualResult || '').replace(/"/g, '""').substring(0, 100);
    const screenshot = exec.screenshotPath ? `"${exec.screenshotPath}"` : '';
    
    csv += `"${testId}","${exec.TestCase.category}","${desc}","${exec.TestCase.priority}","${exec.status}","${result}",${exec.executionTime},${screenshot}\n`;
  });
  
  return csv;
}

// Run report generation
generateReport();
