# 🎯 DATABASE QUICK REFERENCE

## Where Is Your Database?

```
PHYSICAL LOCATION ON MAC:
/opt/homebrew/var/postgresql@16/base/16384/

Easy way to remember:
- PostgreSQL installed by Homebrew: /opt/homebrew/
- Databases stored in: var/postgresql@16/
- Individual databases in: base/
- Your database ID: 16384 (farmer_scheme_db)
- Database files: Inside 16384/ folder
```

---

## ✅ What's Inside farmer_scheme_db

```
🗄️ DATABASE: farmer_scheme_db
│
├── 👥 USERS TABLE (3 records)
│   ├─ Rajesh Kumar (farmer)
│   ├─ Priya Singh (farmer)
│   └─ Admin User (admin)
│
├── 🎯 SCHEMES TABLE (8 records)
│   ├─ PM Kisan Samman Nidhi
│   ├─ Pradhan Mantri Fasal Bima Yojana
│   ├─ Soil Health Card Scheme
│   ├─ Agricultural Infrastructure Fund
│   ├─ National Mission on Agri Extension
│   ├─ Kisan Credit Card Scheme
│   ├─ Equipment Subsidy Scheme
│   └─ Organic Farming Scheme
│
└── 📝 APPLICATIONS TABLE (3 records)
    ├─ Rajesh → PM Kisan (approved)
    ├─ Rajesh → Fasal Bima (pending)
    └─ Priya → Soil Health Card (under_review)
```

---

## 🎮 Quick Commands

```bash
# VIEW YOUR DATABASE
psql -U susantalabala -d farmer_scheme_db

# VIEW TABLES
psql -U susantalabala -d farmer_scheme_db -c "\dt"

# VIEW USERS
psql -U susantalabala -d farmer_scheme_db -c "SELECT * FROM users;"

# VIEW SCHEMES
psql -U susantalabala -d farmer_scheme_db -c "SELECT name, category FROM schemes;"

# COUNT RECORDS
psql -U susantalabala -d farmer_scheme_db -c "SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM schemes;"

# START BACKEND
cd /Users/susantalabala/demo/backend && npm run dev

# START FRONTEND
cd /Users/susantalabala/demo/frontend && npm start

# BACKUP DATABASE
pg_dump -U susantalabala -d farmer_scheme_db > backup.sql
```

---

## 📊 Connection Details

| Item | Value |
|------|-------|
| Host | localhost |
| Port | 5432 |
| Database | farmer_scheme_db |
| User | susantalabala |
| Password | (none) |
| Location | /opt/homebrew/var/postgresql@16/base/16384/ |

---

## 🌐 Access Points

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:3000 | ✅ Ready |
| Backend | http://localhost:5001 | ✅ Ready |
| Health Check | http://localhost:5001/health | ✅ Ready |
| API Schemes | http://localhost:5001/api/schemes | ✅ Ready |

---

## ✨ Latest Updates

✅ **Database Created** - farmer_scheme_db fully initialized  
✅ **Tables Ready** - users, schemes, applications  
✅ **Sample Data Loaded** - 14 records total  
✅ **Backend Connected** - Successfully connects to database  
✅ **Registration Form Enhanced** - Success message with animation  
✅ **Documentation Complete** - All guides written

---

## 📖 Key Documents

| Document | Purpose |
|----------|---------|
| DATABASE_LOCATION_GUIDE.md | Detailed database location & access |
| DATABASE_STATUS.md | Setup instructions & troubleshooting |
| PROJECT_FOLDER_STRUCTURE.md | Complete file structure diagram |
| DATABASE_SETUP_COMPLETE.md | Full summary & checklist |

---

## 🚀 Start Now!

```bash
# Terminal 1: Backend
cd /Users/susantalabala/demo/backend && npm run dev

# Terminal 2: Frontend
cd /Users/susantalabala/demo/frontend && npm start

# Terminal 3: Check Database
psql -U susantalabala -d farmer_scheme_db

# Then visit: http://localhost:3000
```

**Everything is ready! Your database is live! 🎉**
