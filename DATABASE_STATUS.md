# 🗄️ Database Status Report

**Last Updated**: April 9, 2026  
**Status**: ⚠️ NOT CURRENTLY RUNNING

---

## 📊 Current Database Setup

### Backend Configuration

**File**: `/backend/.env`

```env
DB_HOST=localhost
DB_USER=susantalabala
DB_PASSWORD=
DB_NAME=farmer_scheme_db
DB_PORT=5432
```

### Technology Stack

| Component | Technology | Status |
|-----------|-----------|--------|
| **Database Engine** | PostgreSQL | ✅ Configured |
| **ORM** | Sequelize | ✅ Installed |
| **Driver** | pg (PostgreSQL) | ✅ Installed |
| **Utilities** | pg-hstore | ✅ Installed |

### Server Configuration

**File**: `/backend/src/server.js`

```javascript
// Database Connection (Lines 14-26)
const sequelize = new Sequelize(
  process.env.DB_NAME,           // farmer_scheme_db
  process.env.DB_USER,           // susantalabala
  process.env.DB_PASSWORD,       // (empty - uses OS auth)
  {
    host: process.env.DB_HOST,   // localhost
    port: process.env.DB_PORT,   // 5432
    dialect: 'postgres',
    logging: false
  }
);
```

---

## 📋 Data Models Defined

The application has defined the following data models (Mongoose schemas):

### 1. **Application Model** (`/models/Application.js`)
```javascript
Fields:
- userId (references User)
- schemeId (references Scheme)
- status: ['draft', 'pending', 'under_review', 'approved', 'rejected', 'withdrawn']
- documents (array of uploaded docs with verification status)
- applicationNumber (unique identifier)
- appliedAt (timestamp)
- lastUpdated (timestamp)
- notes (array of comments)
- timeline (array of status changes with dates)
```

### 2. **Category Model** (`/models/Category.js`)
- Defines scheme categories (Subsidy, Loan, Insurance, etc.)

### 3. **Scheme Model** (`/models/Scheme.js`)
- Defines government schemes
- Links to categories
- Stores deadline, eligibility, benefits

### 4. **ScrapedData Model** (`/models/ScrapedData.js`)
- Stores scraped scheme information
- Tracks data source and date

### 5. **Source Model** (`/models/Source.js`)
- Defines data sources (government websites, newspapers, etc.)

---

## ⚠️ Current Issues

### Issue 1: PostgreSQL Not Running
```
Error: connection to server at "localhost" (::1), port 5432 failed
Status: Database server is not accessible
```

### Issue 2: Database Not Created
```
Error: database "farmer_scheme_db" does not exist
Status: Need to create database schema
```

### Issue 3: Model Mismatch
- **Backend Server**: Uses Sequelize (SQL ORM)
- **Model Files**: Use Mongoose (MongoDB ODM)
- **Status**: ⚠️ Inconsistent configuration

---

## 🔄 Current Data Flow

### In Development (npm start)

The frontend currently uses **mock data** (no database):

```javascript
// Dashboard.jsx - Lines 130-145
const [schemes, setSchemes] = useState([
  {
    id: 1,
    name: 'PM Kisan Samman Nidhi',
    category: 'Subsidy',
    // ... mock data
  },
  // ... more mock schemes
]);
```

When user clicks "Apply Now":
1. Shows confirmation alert
2. No data is saved to database
3. No persistence between sessions

---

## 🚀 Setting Up the Database

### Step 1: Start PostgreSQL

```bash
# On macOS
brew services start postgresql

# Verify
psql --version
```

### Step 2: Create Database and User

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql terminal:
CREATE USER susantalabala WITH PASSWORD '';
ALTER ROLE susantalabala CREATEDB;
CREATE DATABASE farmer_scheme_db OWNER susantalabala;
\q
```

### Step 3: Set Up Database Tables

**Option A: Using Sequelize Migrations**
```bash
cd /Users/susantalabala/demo/backend
npm run migrate
```

**Option B: Manual Schema Creation**
You'll need to create migration files:

```bash
npx sequelize migration:generate --name create-users
npx sequelize migration:generate --name create-schemes
npx sequelize migration:generate --name create-applications
```

### Step 4: Seed Initial Data

```bash
npm run seed
```

---

## 📝 What Happens When Database is Connected

### Frontend (No Changes Needed)
- Continues to work with UI
- Can be enhanced to load from API instead of mock data

### Backend (Needs Implementation)
```javascript
// backend/src/server.js - MOCK ROUTES (Lines 47-100)
// Current: Returns hardcoded mock data
app.get('/api/schemes', (req, res) => {
  res.json({ success: true, data: [...] });
});

// Needed: Connect to actual database
app.get('/api/schemes', async (req, res) => {
  const schemes = await Scheme.findAll();
  res.json({ success: true, data: schemes });
});
```

### When Applications Submitted
- ✅ Currently: Shows alert, no storage
- ⏳ Needed: Save to database
- ⏳ Needed: API endpoint to save applications
- ⏳ Needed: Backend validation and processing

---

## 🔗 Integration Points

### Frontend → Backend API

**Current Routes** (in backend/src/server.js):
- `GET /health` - Server health check
- `GET /api` - API documentation
- `GET /api/schemes` - List schemes (MOCK)
- `GET /api/farmers` - List farmers (MOCK)
- `GET /api/scraping/*` - Scraping operations

**Needed Routes** (for full functionality):
- `POST /api/applications` - Submit application
- `GET /api/applications/:id` - Get application status
- `POST /api/users/register` - Farmer registration
- `POST /api/users/login` - User authentication
- `POST /api/upload` - Document uploads

---

## 📊 Current Frontend → Backend Connection

### Frontend Application States

**1. Dashboard.jsx** (Lines 30-80)
```javascript
// State: All data is LOCAL (not from API)
const [schemes, setSchemes] = useState([
  // ... hardcoded 12 schemes ...
]);

// Apply Now button: Shows alert, doesn't save
const handleApplyNow = () => {
  alert('✅ Application submitted!');
  // ⚠️ No API call to backend
  // ⚠️ No database persistence
};
```

**2. FarmerLogin.jsx** (Lines 120-150)
```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  // ⚠️ No API call to validate credentials
  // ⚠️ No database lookup
  // ⚠️ Just shows mock success
  setSuccessMessage('✅ Login successful!');
};
```

**3. FarmerRegistration.jsx**
```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  // ⚠️ No API call to register
  // ⚠️ No database insert
  // ⚠️ Just shows success alert
};
```

---

## 🎯 Next Steps to Enable Database Storage

### Priority 1: Database Setup (Recommended)
1. ✅ Install PostgreSQL (if not already)
2. Create database and user
3. Run Sequelize migrations
4. Seed initial scheme data

### Priority 2: Backend API Implementation
1. Implement `/api/applications` endpoints
2. Add authentication routes
3. Create upload endpoints
4. Add validation middleware

### Priority 3: Frontend Integration
1. Replace mock data with API calls
2. Add loading states
3. Add error handling
4. Add success confirmations with API

### Priority 4: Testing
1. Test all API endpoints
2. Verify data persistence
3. Test authentication flow
4. Test application submission

---

## 📋 Checklist: Database Setup

- [ ] PostgreSQL installed
- [ ] PostgreSQL service running
- [ ] Database user created
- [ ] Database created (farmer_scheme_db)
- [ ] Database connection verified
- [ ] Migration files created
- [ ] Migrations run successfully
- [ ] Seed data inserted
- [ ] Backend API tested
- [ ] Frontend updated to use API

---

## 🔧 Troubleshooting

### PostgreSQL Not Starting
```bash
# Check if PostgreSQL is running
brew services list | grep postgres

# Start PostgreSQL
brew services start postgresql

# Or manually
pg_ctl -D /usr/local/var/postgres start
```

### Can't Connect to Database
```bash
# Verify PostgreSQL is listening
lsof -i :5432

# Check password auth
psql -U susantalabala -h localhost
```

### Sequelize Connection Error
```bash
# Check backend logs
cd backend
npm run dev

# Look for: "❌ Database connection failed"
```

---

## 📊 Summary

### Current State
- ✅ PostgreSQL configured in `.env`
- ✅ Sequelize ORM installed and configured
- ✅ Data models defined
- ✅ Backend server ready to connect
- ⚠️ Database NOT running
- ⚠️ Database NOT created
- ⚠️ Applications using mock data only

### When Database is Operational
- Real data persistence
- User authentication
- Application tracking
- Scheme management
- Admin functionality
- Data analytics

### Ready for Deployment?
- ⏳ Frontend: Yes (works with or without database)
- ⏳ Backend: Partially (needs database + API endpoints)
- ⏳ Database: Not yet (needs setup)

---

## 📞 Next Action

**To enable database storage:**
1. Follow "Step 1: Start PostgreSQL" section above
2. Follow "Step 2: Create Database and User" section
3. Run backend with: `cd backend && npm run dev`
4. Check logs for: "✅ Database connected successfully"

Once database is connected, backend will be ready for frontend integration!

---

**Status**: ⚠️ Configured but Not Running  
**Recommendation**: Set up PostgreSQL to enable data persistence  
**Effort**: ~30 minutes for complete setup  
**Complexity**: Low (straightforward SQL setup)
