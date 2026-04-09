# 📚 QUICK REFERENCE - SCRAPING SYSTEM

## 🚀 Quick Start

### Check All Services
```bash
# Backend health
curl http://localhost:5001/health

# Frontend accessibility
curl http://localhost:3000

# Database connection
psql -U susantalabala -d farmer_scheme_db -c "SELECT COUNT(*) FROM schemes;"
```

### Trigger Scraping Operations
```bash
# Scrape government portals
curl -X POST http://localhost:5001/api/scraping/scrape-government

# Scrape newspapers
curl -X POST http://localhost:5001/api/scraping/scrape-newspapers

# Get statistics
curl http://localhost:5001/api/scraping/stats

# Get schemes (limit to 20)
curl 'http://localhost:5001/api/scraping/schemes?limit=20'

# Get schemes by category
curl 'http://localhost:5001/api/scraping/schemes?category=Insurance'

# Get schemes by source
curl 'http://localhost:5001/api/scraping/schemes?source=government'
```

---

## 📊 Data Extraction Features

### Auto-Categorization
The system automatically categorizes schemes into:
- **Insurance** - Crop insurance and protection schemes
- **Subsidy** - Direct financial support
- **Loan** - Credit and loan programs
- **Training** - Skill development programs
- **Equipment** - Machinery and equipment support
- **Relief** - Disaster and emergency relief
- **Other** - Miscellaneous schemes

### Extracted Fields
```json
{
  "title": "Scheme name",
  "description": "Full description",
  "category": "Auto-determined",
  "source": "Portal name",
  "sourceType": "government|newspaper",
  "sourceUrl": "Direct link to scheme",
  "scrapedAt": "Timestamp of scraping",
  "eligibility": ["Criteria 1", "Criteria 2"],
  "benefits": ["Benefit 1", "Benefit 2"],
  "deadline": "Parsed deadline date",
  "verified": false
}
```

---

## 🔧 Troubleshooting

### Backend Not Responding
```bash
# Kill all node processes
killall -9 node

# Restart backend
cd /Users/susantalabala/demo/backend && npm start
```

### Frontend Not Compiling
```bash
# Clear node modules
rm -rf /Users/susantalabala/demo/frontend/node_modules

# Reinstall
cd /Users/susantalabala/demo/frontend && npm install

# Start
npm start
```

### Database Connection Issues
```bash
# Check PostgreSQL status
brew services list

# Check specific database
psql -U susantalabala -d farmer_scheme_db -c "SELECT 1;"

# View .env file settings
cat /Users/susantalabala/demo/backend/.env
```

### Port Already in Use
```bash
# Find process on port 5001
lsof -i :5001

# Find process on port 3000
lsof -i :3000

# Kill specific process
kill -9 <PID>
```

---

## 📁 Important Directories

```
/Users/susantalabala/demo/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── server.js       # Main server file
│   │   └── routes/
│   │       └── scrapingRoutes.js  # Scraping endpoints
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SchemeList.jsx
│   │   │   └── Profile.jsx
│   │   └── index.js
│   └── package.json
├── scripts/                # Utility scripts
│   └── scheme-scraping-agent.js  # Core scraping agent
├── models/                 # Data models
│   └── Scheme.js          # Enhanced scheme model
└── routes/                 # Root level routes
    └── scrapingRoutes.js  # Original scraping routes

Database: farmer_scheme_db
```

---

## 🔐 Environment Variables

### Backend (.env)
```properties
NODE_ENV=development
PORT=5001
DB_HOST=localhost
DB_USER=susantalabala
DB_PASSWORD=
DB_NAME=farmer_scheme_db
DB_PORT=5432
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```properties
REACT_APP_API_URL=http://localhost:5001/api
```

---

## 📈 System Architecture

```
┌─────────────────────────────────────┐
│      External Data Sources          │
│  (Gov Portals, Newspapers, etc)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Scraping Agent (Node.js)          │
│  - HTTP requests (Axios)            │
│  - HTML parsing (Cheerio)           │
│  - Text analysis                    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Data Processing                   │
│  - Categorization                   │
│  - Extraction                       │
│  - Deduplication                    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Storage Layer                     │
│  - In-memory cache                  │
│  - PostgreSQL (optional)            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   REST API Endpoints                │
│  /api/scraping/schemes              │
│  /api/scraping/stats                │
│  /api/scraping/scrape-*             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Frontend & Consumers              │
│  - React UI                         │
│  - External APIs                    │
└─────────────────────────────────────┘
```

---

## 🌐 Supported Sources

### Government Portals (7 configurable)
1. agriwelfare.gov.in
2. pmkisan.gov.in
3. pmfby.gov.in
4. myscheme.gov.in
5. kisanportal.org
6. ysrrythubharosa.ap.gov.in
7. state-specific portals

### Newspapers (3 configurable)
1. The Hindu (thehindu.com)
2. Business Standard (business-standard.com)
3. Times of India (timesofindia.indiatimes.com)

---

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-04-09T03:44:23.061Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Human readable message",
  "timestamp": "2026-04-09T03:44:23.061Z"
}
```

---

## 🎯 Common Tasks

### Task 1: Get Latest Schemes
```bash
curl 'http://localhost:5001/api/scraping/schemes?limit=50' | jq '.schemes'
```

### Task 2: Run Full Scraping
```bash
# Government portals
curl -X POST http://localhost:5001/api/scraping/scrape-government

# Then newspapers
curl -X POST http://localhost:5001/api/scraping/scrape-newspapers

# Check results
curl http://localhost:5001/api/scraping/stats
```

### Task 3: Filter by Category
```bash
curl 'http://localhost:5001/api/scraping/schemes?category=Subsidy&limit=20'
```

### Task 4: Monitor System Health
```bash
# Backend
curl http://localhost:5001/health | jq

# Frontend
curl http://localhost:3000 | head -20

# Database
psql -U susantalabala -d farmer_scheme_db -c "SELECT version();"
```

---

## 🔄 Workflow Examples

### Complete Data Pipeline
```bash
# 1. Trigger scraping
curl -X POST http://localhost:5001/api/scraping/scrape-government

# 2. Get statistics
curl http://localhost:5001/api/scraping/stats

# 3. Retrieve specific category
curl 'http://localhost:5001/api/scraping/schemes?category=Insurance'

# 4. Display in frontend
# Frontend calls the API and renders results
```

---

## 📝 Logs & Debugging

### Backend Logs
```bash
# If running in foreground, logs appear in terminal
# If running in background:
tail -f /tmp/backend.log
```

### Frontend Logs
```bash
# Browser console: F12 → Console tab
# Check for API response errors
```

### Database Logs
```bash
# PostgreSQL logs
tail -f /usr/local/var/log/postgres.log
```

---

## 🚀 Performance Tips

1. **Cache Results** - Data is cached in memory after scraping
2. **Limit Requests** - Use pagination (limit=20 by default)
3. **Batch Operations** - Scrape all sources in one request
4. **Filter Results** - Use category/source filters to reduce data
5. **Monitor Metrics** - Check stats endpoint regularly

---

## 📱 Mobile Access

### Access from Network
```bash
# Find your machine IP
ifconfig | grep "inet "

# Access frontend from another device
http://<YOUR_IP>:3000

# Access API
http://<YOUR_IP>:5001/api
```

---

**Last Updated:** April 9, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
