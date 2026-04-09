/**
 * Database Initialization Script
 * Creates tables and seeds sample data for the Farmer Scheme System
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

// Define Models
const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  email: {
    type: Sequelize.STRING(255),
    allowNull: false,
    unique: true
  },
  phone: {
    type: Sequelize.STRING(15),
    allowNull: true
  },
  password: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  state: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  district: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  landSize: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true
  },
  cropsGrown: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  role: {
    type: Sequelize.ENUM('farmer', 'admin'),
    defaultValue: 'farmer'
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
  tableName: 'users',
  timestamps: true
});

const Scheme = sequelize.define('Scheme', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  category: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  eligibility: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  benefits: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  deadline: {
    type: Sequelize.DATE,
    allowNull: true
  },
  applicationLink: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  source: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'schemes',
  timestamps: false
});

const Application = sequelize.define('Application', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  schemeId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'schemes',
      key: 'id'
    }
  },
  status: {
    type: Sequelize.ENUM('pending', 'approved', 'rejected', 'under_review'),
    defaultValue: 'pending'
  },
  applicationDate: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  documents: {
    type: Sequelize.JSON,
    allowNull: true
  },
  remarks: {
    type: Sequelize.TEXT,
    allowNull: true
  }
}, {
  tableName: 'applications',
  timestamps: true
});

// Initialize Database
async function initializeDatabase() {
  try {
    console.log('\n🚀 Starting Database Initialization...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful!\n');

    // Sync models (create tables if they don't exist)
    console.log('📋 Creating tables...');
    await sequelize.sync({ alter: false });
    console.log('✅ Tables created/verified!\n');

    // Seed sample data
    console.log('🌱 Seeding sample data...\n');

    // Create sample schemes
    const schemes = await Scheme.bulkCreate([
      {
        name: 'PM Kisan Samman Nidhi',
        description: 'Direct income support scheme for farmers providing ₹6000 per year in three installments',
        category: 'Subsidy',
        eligibility: 'Small and marginal farmers',
        benefits: '₹6000 per year in 3 installments of ₹2000 each',
        deadline: new Date('2026-12-31'),
        applicationLink: 'https://pmkisan.gov.in',
        source: 'Government Portal'
      },
      {
        name: 'Pradhan Mantri Fasal Bima Yojana',
        description: 'Crop insurance scheme to protect farmers from crop failure',
        category: 'Insurance',
        eligibility: 'All farmers growing notified crops',
        benefits: 'Crop insurance coverage up to 80% of average yield loss',
        deadline: new Date('2026-06-30'),
        applicationLink: 'https://pmfby.gov.in',
        source: 'Government Portal'
      },
      {
        name: 'Soil Health Card Scheme',
        description: 'Provides free soil testing and health cards for better crop management',
        category: 'Training',
        eligibility: 'All farmers',
        benefits: 'Free soil testing and personalized fertilizer recommendations',
        deadline: new Date('2026-05-15'),
        applicationLink: 'https://www.soilhealth.dac.gov.in',
        source: 'Department of Agriculture'
      },
      {
        name: 'Agricultural Infrastructure Fund',
        description: 'Financing scheme for farm infrastructure development',
        category: 'Loan',
        eligibility: 'Farmers, FPOs, Cooperatives',
        benefits: 'Loans up to ₹100 lakhs at subsidized interest rates',
        deadline: new Date('2026-08-31'),
        applicationLink: 'https://aif.gov.in',
        source: 'Government Portal'
      },
      {
        name: 'National Mission on Agricultural Extension',
        description: 'Provides training and technology transfer to farmers',
        category: 'Training',
        eligibility: 'All farmers',
        benefits: 'Free training programs and agricultural extension services',
        deadline: new Date('2026-10-31'),
        applicationLink: 'https://nmae.gov.in',
        source: 'DAC'
      },
      {
        name: 'Kisan Credit Card Scheme',
        description: 'Easy credit access for agricultural operations',
        category: 'Loan',
        eligibility: 'Farmers with valid land records',
        benefits: 'Credit lines up to ₹3 lakhs at concessional rates',
        deadline: new Date('2026-12-31'),
        applicationLink: 'https://www.rbi.org.in/kcc',
        source: 'Reserve Bank of India'
      },
      {
        name: 'Equipment Subsidy Scheme',
        description: 'Subsidies for agricultural equipment and machinery',
        category: 'Equipment',
        eligibility: 'Farmers with landholding',
        benefits: '40-50% subsidy on farm machinery',
        deadline: new Date('2026-07-15'),
        applicationLink: 'https://dac.gov.in/equipment',
        source: 'State Government'
      },
      {
        name: 'Organic Farming Scheme',
        description: 'Support for farmers transitioning to organic farming',
        category: 'Subsidy',
        eligibility: 'Farmers willing to adopt organic farming',
        benefits: '₹50,000 per hectare for 3 years',
        deadline: new Date('2026-09-30'),
        applicationLink: 'https://ofp.dac.gov.in',
        source: 'Department of Agriculture'
      }
    ]);
    console.log(`✅ Created ${schemes.length} sample schemes`);

    // Create sample users
    const users = await User.bulkCreate([
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '9876543210',
        password: 'hashed_password_1',
        state: 'Maharashtra',
        district: 'Pune',
        landSize: 2.5,
        cropsGrown: 'Sugarcane, Wheat',
        role: 'farmer'
      },
      {
        name: 'Priya Singh',
        email: 'priya@example.com',
        phone: '9876543211',
        password: 'hashed_password_2',
        state: 'Tamil Nadu',
        district: 'Coimbatore',
        landSize: 1.5,
        cropsGrown: 'Rice, Cotton',
        role: 'farmer'
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '9999999999',
        password: 'hashed_admin_password',
        state: 'Delhi',
        district: 'Central',
        role: 'admin'
      }
    ]);
    console.log(`✅ Created ${users.length} sample users`);

    // Create sample applications
    const applications = await Application.bulkCreate([
      {
        userId: users[0].id,
        schemeId: schemes[0].id,
        status: 'approved',
        applicationDate: new Date('2026-01-15'),
        remarks: 'Approved - Documents verified'
      },
      {
        userId: users[0].id,
        schemeId: schemes[1].id,
        status: 'pending',
        applicationDate: new Date('2026-02-01'),
        remarks: null
      },
      {
        userId: users[1].id,
        schemeId: schemes[2].id,
        status: 'under_review',
        applicationDate: new Date('2026-01-20'),
        remarks: 'Awaiting document verification'
      }
    ]);
    console.log(`✅ Created ${applications.length} sample applications`);

    console.log('\n✨ Database initialization complete!\n');
    console.log('📊 Database Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Schemes: ${schemes.length}`);
    console.log(`   - Applications: ${applications.length}`);
    console.log('\n🎯 Next Steps:');
    console.log('   1. View database tables: psql -U susantalabala -d farmer_scheme_db -c "\\dt"');
    console.log('   2. Query users: psql -U susantalabala -d farmer_scheme_db -c "SELECT * FROM users;"');
    console.log('   3. Query schemes: psql -U susantalabala -d farmer_scheme_db -c "SELECT * FROM schemes;"');
    console.log('   4. Start backend: npm run dev\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Initialization error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();
