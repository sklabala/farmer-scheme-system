# PostgreSQL Setup Complete ✅

## Installation Summary

**Date**: April 9, 2026  
**PostgreSQL Version**: 16.13 (Homebrew)  
**Database Name**: `farmer_scheme_db`  
**Status**: ✅ Running

---

## Connection Details

```
Host:     localhost
Port:     5432
User:     postgres (default)
Password: (none - local auth)
Database: farmer_scheme_db
```

---

## Useful PostgreSQL Commands

### Connect to database
```bash
psql -d farmer_scheme_db
```

### List databases
```bash
psql -l
```

### Start/Stop PostgreSQL Service
```bash
# Start (already running)
brew services start postgresql@16

# Stop
brew services stop postgresql@16

# Status
brew services list | grep postgresql
```

### Backup database
```bash
pg_dump farmer_scheme_db > backup.sql
```

### Restore from backup
```bash
psql farmer_scheme_db < backup.sql
```

### Delete database (if needed)
```bash
dropdb farmer_scheme_db
```

### Create new database
```bash
createdb <database_name>
```

---

## Backend .env Configuration

Your backend `.env` already has:
```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=farmer_scheme_db
DB_PORT=5432
```

No changes needed! ✅

---

## Next Steps

1. **Run Migrations** (if available):
   ```bash
   cd /Users/susantalabala/demo/backend
   npm run migrate  # or sequelize db:migrate
   ```

2. **Seed Sample Data** (optional):
   ```bash
   npm run seed  # or sequelize db:seed:all
   ```

3. **Start Backend Server**:
   ```bash
   npm start
   ```

4. **Start Frontend** (in another terminal):
   ```bash
   cd /Users/susantalabala/demo/frontend
   npm start
   ```

5. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

---

## Verify PostgreSQL is Running

```bash
# Check service status
brew services list

# Connect directly (no password needed)
psql -d farmer_scheme_db -c "SELECT version();"
```

---

## Troubleshooting

**PostgreSQL won't start:**
```bash
brew services restart postgresql@16
```

**Permission denied connecting:**
```bash
# Reset to peer authentication
sudo -u postgres psql -d postgres
```

**View PostgreSQL logs:**
```bash
log show --predicate 'process == "postgres"' --level=debug
```

---

✅ **PostgreSQL is ready for your Farmer Scheme System!**
