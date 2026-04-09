# 🗄️ PostgreSQL Database Location Guide

## 📍 Where is Your Database?

### PostgreSQL Installation

**PostgreSQL Path**: `/opt/homebrew/var/postgresql@16`

**Full Path to Your Database Files**: `/opt/homebrew/var/postgresql@16/base`

```
/opt/homebrew/var/postgresql@16/
├── base/                          ← Your databases are here
│   ├── 1/                         ← PostgreSQL system database
│   ├── 16384/                     ← farmer_scheme_db (your database)
│   └── ...
├── global/                        ← System-wide data
├── pg_hba.conf                    ← Access control config
├── pg_ident.conf                  ← Identity mapping
├── pg_logical/                    ← Logical replication
├── pg_multixact/                  ← Transaction state
└── ... (other PostgreSQL directories)
```

---

## 🔍 Finding Your farmer_scheme_db

### Step 1: Check PostgreSQL Installation

```bash
# See PostgreSQL version and path
psql --version
# Output: psql (PostgreSQL) 16.13 (Homebrew)

which psql
# Output: /opt/homebrew/bin/psql
```

### Step 2: PostgreSQL Data Directory

```bash
# List PostgreSQL data directory
ls -la /opt/homebrew/var/postgresql@16/
```

### Step 3: Find Your Database OID

```bash
# Get the Object ID (OID) of your database
psql -U susantalabala -d farmer_scheme_db -c "SELECT oid, datname FROM pg_database WHERE datname='farmer_scheme_db';"
```

**Output**: Your database OID (e.g., 16384)

### Step 4: Access Your Database Files

```bash
# The actual database files are in:
ls -la /opt/homebrew/var/postgresql@16/base/16384/
```

---

## 📊 Database Structure on Disk

```
/opt/homebrew/var/postgresql@16/
│
├── base/
│   ├── 1/                        ← template0 (system)
│   ├── 4/                        ← template1 (system)
│   ├── 16384/                    ← farmer_scheme_db ✓ YOUR DB
│   │   ├── 16385                 ← users table
│   │   ├── 16391                 ← schemes table
│   │   ├── 16397                 ← applications table
│   │   ├── 16385_fsm             ← free space map
│   │   ├── 16385_vm              ← visibility map
│   │   └── ... (indices, etc)
│   └── ...
│
├── global/
│   ├── pg_database               ← Database metadata
│   ├── pg_filenode.map           ← File node mapping
│   └── ...
│
└── pg_wal/                        ← Write-ahead logs (backups)
    ├── 000000010000000000000001
    ├── 000000010000000000000002
    └── ... (transaction logs)
```

---

## 🎯 Important Paths Reference

| Item | Path | Purpose |
|------|------|---------|
| **PostgreSQL Binary** | `/opt/homebrew/bin/psql` | Command to access databases |
| **PostgreSQL Server** | `/opt/homebrew/bin/postgres` | Database server executable |
| **Data Directory** | `/opt/homebrew/var/postgresql@16` | All database files stored here |
| **Your Database** | `/opt/homebrew/var/postgresql@16/base/16384` | farmer_scheme_db files |
| **Configuration** | `/opt/homebrew/var/postgresql@16/pg_hba.conf` | Access control rules |
| **Logs** | `/opt/homebrew/var/log/postgresql@16.log` | Server activity logs |

---

## 🔗 Connecting to Your Database

### Command Line Access

```bash
# Connect as susantalabala user
psql -U susantalabala -d farmer_scheme_db

# Connection details
Host:     localhost
Port:     5432
Database: farmer_scheme_db
User:     susantalabala
```

### View Database Information

```bash
# List all databases
psql -U susantalabala -c "SELECT datname FROM pg_database ORDER BY datname;"

# Get database size
psql -U susantalabala -d farmer_scheme_db -c "SELECT pg_size_pretty(pg_database.datdblsize) as size FROM pg_database WHERE datname='farmer_scheme_db';"

# List all tables
psql -U susantalabala -d farmer_scheme_db -c "\dt"

# Show table details
psql -U susantalabala -d farmer_scheme_db -c "\d users"
```

---

## 📈 Your Database Tables

### Tables Created

1. **users** (File OID: ~16385)
   - Farmer and admin user profiles
   - 3 sample records (Rajesh Kumar, Priya Singh, Admin User)

2. **schemes** (File OID: ~16391)
   - Government schemes information
   - 8 sample schemes (PM Kisan, Fasal Bima, etc.)

3. **applications** (File OID: ~16397)
   - Farmer applications for schemes
   - 3 sample applications with status tracking

### Sample Data

```
USERS TABLE:
id | name         | email              | phone      | state      | role
1  | Rajesh Kumar | rajesh@example.com | 9876543210 | Maharashtra| farmer
2  | Priya Singh  | priya@example.com  | 9876543211 | Tamil Nadu | farmer
3  | Admin User   | admin@example.com  | 9999999999 | Delhi      | admin

SCHEMES TABLE:
id | name                        | category  | deadline
1  | PM Kisan Samman Nidhi       | Subsidy   | 2026-12-31
2  | Pradhan Mantri Fasal Bima   | Insurance | 2026-06-30
3  | Soil Health Card Scheme     | Training  | 2026-05-15
4  | Agricultural Infrastructure | Loan      | 2026-08-31
... (8 total)

APPLICATIONS TABLE:
id | userId | schemeId | status       | applicationDate
1  | 1      | 1        | approved     | 2026-01-15
2  | 1      | 2        | pending      | 2026-02-01
3  | 2      | 3        | under_review | 2026-01-20
```

---

## 🚀 Backup Your Database

### Create a Backup

```bash
# Backup entire database to a file
pg_dump -U susantalabala -d farmer_scheme_db > ~/farmer_scheme_backup.sql

# Backup with compression
pg_dump -U susantalabala -d farmer_scheme_db | gzip > ~/farmer_scheme_backup.sql.gz

# Backup all databases
pg_dumpall -U susantalabala > ~/all_databases_backup.sql
```

### Restore from Backup

```bash
# Restore from SQL file
psql -U susantalabala -d farmer_scheme_db < ~/farmer_scheme_backup.sql

# Restore from compressed file
gunzip < ~/farmer_scheme_backup.sql.gz | psql -U susantalabala -d farmer_scheme_db
```

---

## 🛠️ Common Database Operations

### Check Database Size

```bash
psql -U susantalabala -d farmer_scheme_db -c "
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

### Count Records in Tables

```bash
psql -U susantalabala -d farmer_scheme_db -c "
SELECT
  'users' AS table_name, COUNT(*) AS record_count FROM users
UNION ALL
SELECT 'schemes', COUNT(*) FROM schemes
UNION ALL
SELECT 'applications', COUNT(*) FROM applications;
"
```

### View All Indexes

```bash
psql -U susantalabala -d farmer_scheme_db -c "\di"
```

### Check Connections

```bash
psql -U susantalabala -c "
SELECT datname, count(*) as connections 
FROM pg_stat_activity 
GROUP BY datname;
"
```

---

## 🔐 Database Configuration

### Connection Configuration

**File**: `/opt/homebrew/var/postgresql@16/pg_hba.conf`

```
# Allow local connections (default)
local   all             all                                     trust

# Allow TCP connections from localhost
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
```

### Database Environment Variables

```bash
# Set in your .env file (/Users/susantalabala/demo/backend/.env)
DB_HOST=localhost
DB_USER=susantalabala
DB_PASSWORD=
DB_NAME=farmer_scheme_db
DB_PORT=5432
```

---

## 📱 Project Structure Integration

```
/Users/susantalabala/demo/
│
├── backend/                       ← Backend application
│   ├── src/
│   │   ├── server.js             ← Connects to PostgreSQL
│   │   └── initDatabase.js       ← Initialization script
│   ├── .env                      ← Database credentials
│   └── package.json
│
├── frontend/                      ← Frontend (React)
│   └── src/
│
└── [PostgreSQL Data] ────────────┐
    (Not in project folder)       │
    ↓                             │
    /opt/homebrew/var/postgresql@16/base/16384/
    (farmer_scheme_db files)      ←─ Referenced via .env
```

---

## ✅ Quick Verification Checklist

- ✅ PostgreSQL installed: `/opt/homebrew/bin/psql`
- ✅ Data directory: `/opt/homebrew/var/postgresql@16`
- ✅ Database exists: `farmer_scheme_db`
- ✅ Tables created: `users`, `schemes`, `applications`
- ✅ Sample data: 3 users, 8 schemes, 3 applications
- ✅ Backend connection: Configured in `.env`
- ✅ Server running: Connected successfully ✓

---

## 🎯 Access Your Database

### Via Terminal

```bash
# Interactive access
psql -U susantalabala -d farmer_scheme_db

# Once connected:
\dt                  # List tables
SELECT * FROM users; # Query data
\q                   # Quit
```

### Via Frontend (After Backend Integration)

The frontend will connect through:
1. Backend API (`http://localhost:5001`)
2. Backend queries PostgreSQL
3. Data returned to frontend

### Example Query Flow

```
User fills registration form
         ↓
Frontend sends to Backend API (/api/register)
         ↓
Backend Node.js receives request
         ↓
Backend sends SQL to PostgreSQL
         ↓
PostgreSQL executes at: /opt/homebrew/var/postgresql@16/base/16384/
         ↓
Data stored in database files
         ↓
Backend returns success response
         ↓
Frontend shows success message
```

---

## 🚨 Troubleshooting

### Database Connection Failed?

```bash
# Check if PostgreSQL is running
brew services list | grep postgres

# Start PostgreSQL
brew services start postgresql@16

# Check PostgreSQL logs
tail -f /opt/homebrew/var/log/postgresql@16.log
```

### Can't Find Database?

```bash
# List all databases
psql -U postgres -l

# Check database exists
psql -U susantalabala -d farmer_scheme_db -c "\l"

# Check table exists
psql -U susantalabala -d farmer_scheme_db -c "\dt"
```

### Permission Denied?

```bash
# Check user has database access
psql -U postgres -c "SELECT usename, usesuper FROM pg_user WHERE usename='susantalabala';"

# Grant privileges if needed
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE farmer_scheme_db TO susantalabala;"
```

---

## 📚 File Reference Guide

| File/Directory | Purpose |
|---|---|
| `/opt/homebrew/var/postgresql@16/` | PostgreSQL data home directory |
| `/opt/homebrew/var/postgresql@16/base/` | All database folders |
| `/opt/homebrew/var/postgresql@16/base/16384/` | farmer_scheme_db files |
| `/opt/homebrew/var/postgresql@16/pg_hba.conf` | Connection authorization rules |
| `/opt/homebrew/var/postgresql@16/postgresql.conf` | Server configuration |
| `/opt/homebrew/var/log/postgresql@16.log` | Server activity logs |
| `/Users/susantalabala/demo/backend/.env` | Backend connection config |
| `/Users/susantalabala/demo/backend/src/initDatabase.js` | Database initialization script |

---

## 🎓 Next Steps

1. **View Your Data**: 
   ```bash
   psql -U susantalabala -d farmer_scheme_db
   \dt
   SELECT * FROM users;
   ```

2. **Start Backend Server**:
   ```bash
   cd /Users/susantalabala/demo/backend
   npm run dev
   ```

3. **Test API Endpoints**:
   ```bash
   curl http://localhost:5001/api/schemes
   curl http://localhost:5001/health
   ```

4. **Update Frontend to Use API**: (Next step in integration)

5. **Add Farmer Registration Success Message**: (Coming next)

---

**Your Database is Ready! 🎉**

- Location: `/opt/homebrew/var/postgresql@16/base/16384/`
- Tables: 3 (users, schemes, applications)
- Records: 14 total (3 users + 8 schemes + 3 applications)
- Status: ✅ Active and Running
