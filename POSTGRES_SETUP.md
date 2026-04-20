# PostgreSQL Quick Setup Guide

## Step 1: Open PostgreSQL Command Line

```bash
# Open Command Prompt and run:
psql -U postgres
```

## Step 2: When prompted for password:
Try these common defaults:
- `postgres` (most common)
- `password`
- `admin`
- Press Enter (empty password)

## Step 3: If connection works, verify your password is set:

```sql
-- In psql shell:
\password postgres
```

This will prompt you to enter a new password. Enter: `postgres`

## Step 4: Create the database:

```sql
CREATE DATABASE ecommerce_db;
```

## Step 5: Verify database was created:

```sql
\l
```

You should see `ecommerce_db` in the list.

## Step 6: Exit psql:

```sql
\q
```

## Step 7: Run setup script:

```bash
npm run setup-db
```

## Common Issues:

### Issue: "role 'postgres' does not exist"
**Solution:** PostgreSQL might have a different admin user. Reinstall PostgreSQL.

### Issue: Always get authentication error
**Solution:** PostgreSQL might be using `trust` authentication in pg_hba.conf. Try:
```bash
psql -U postgres -h localhost
```

### Issue: Connection refused
**Solution:** PostgreSQL service isn't running. Run:
```powershell
# As Administrator in PowerShell:
Start-Service postgresql-x64-18
```

### Issue: Still not working?
**Solution:** Reset the password using Windows Administrator:
```powershell
# As Administrator:
cd "C:\Program Files\PostgreSQL\18\bin"
.\pg_ctl.exe -D "C:\Program Files\PostgreSQL\18\data" -l logfile start
psql -U postgres -c "ALTER USER postgres PASSWORD 'postgres';"
```

## Verify Everything Works:

```bash
npm run setup-db
```

You should see all green checkmarks ✅
