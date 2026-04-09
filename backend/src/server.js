const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Sequelize } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
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

// Test Database Connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection failed:', err));

// Health Check Route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Farmer Scheme API is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// Import scraping routes
const scrapingRoutes = require('./routes/scrapingRoutes');

// API Routes
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Farmer Scheme Information System API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      schemes: '/api/schemes',
      scraping: '/api/scraping',
      farmers: '/api/farmers',
      applications: '/api/applications'
    }
  });
});

// Mount scraping routes
app.use('/api/scraping', scrapingRoutes);

// Mock Routes (for demo)
app.get('/api/schemes', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        title: 'PM-KISAN',
        description: 'Direct income support ₹6000/year',
        category: 'Subsidy',
        deadline: '2026-03-31',
        source: 'Government Portal',
        sourceType: 'government'
      },
      {
        id: 2,
        title: 'PM Fasal Bima Yojana',
        description: 'Crop insurance coverage',
        category: 'Insurance',
        deadline: '2026-06-30',
        source: 'Government Portal',
        sourceType: 'government'
      },
      {
        id: 3,
        title: 'Soil Health Card Scheme',
        description: 'Free soil testing and health cards',
        category: 'Other',
        deadline: '2026-05-15',
        source: 'The Hindu',
        sourceType: 'newspaper'
      }
    ]
  });
});

app.get('/api/farmers', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Ramesh Kumar', phone: '9876543210', state: 'Maharashtra' },
      { id: 2, name: 'Sita Devi', phone: '8765432109', state: 'Tamil Nadu' }
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 Farmer Scheme API Server`);
  console.log(`📍 Running on http://localhost:${PORT}`);
  console.log(`📚 Health Check: http://localhost:${PORT}/health`);
  console.log(`📖 API Docs: http://localhost:${PORT}/api`);
  console.log(`🗄️  Database: ${process.env.DB_NAME} (${process.env.DB_HOST}:${process.env.DB_PORT})`);
  console.log(`🔐 Environment: ${process.env.NODE_ENV}\n`);
});

module.exports = app;
