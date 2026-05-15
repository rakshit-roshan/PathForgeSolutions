# How to Delete PostgreSQL Databases

## ⚠️ WARNING
**Deleting databases is permanent and cannot be undone!** Make sure you have backups if you need the data.

---

## Step 1: List All Databases

Before deleting, see what databases exist:

### Using psql (Command Line):

**Windows:**
```powershell
cd "C:\Program Files\PostgreSQL\{version}\bin"
.\psql -U postgres -c "\l"
```

**Mac/Linux:**
```bash
psql -U postgres -c "\l"
```

### Using psql Interactive Mode:

```bash
psql -U postgres
```

Then in psql:
```sql
\l
-- or
SELECT datname FROM pg_database;
```

You'll see output like:
```
                                  List of databases
   Name    |  Owner   | Encoding |   Collate   |    Ctype    |   Access privileges   
-----------+----------+----------+-------------+-------------+-----------------------
 postgres  | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | 
 template0 | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
           |          |          |             |             | postgres=CTc/postgres
 template1 | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
           |          |          |             |             | postgres=CTc/postgres
 mainfolder_db | postgres | UTF8 | en_US.UTF-8 | en_US.UTF-8 | 
```

---

## Step 2: Delete a Specific Database

### Method 1: Using psql Command Line (Recommended)

**Windows:**
```powershell
cd "C:\Program Files\PostgreSQL\{version}\bin"
.\psql -U postgres -c "DROP DATABASE IF EXISTS mainfolder_db;"
```

**Mac/Linux:**
```bash
psql -U postgres -c "DROP DATABASE IF EXISTS mainfolder_db;"
```

### Method 2: Using psql Interactive Mode

```bash
psql -U postgres
```

Then:
```sql
DROP DATABASE IF EXISTS mainfolder_db;
```

**Note:** `IF EXISTS` prevents errors if the database doesn't exist.

### Method 3: Force Delete (if database has active connections)

If you get an error like "database is being accessed by other users", you need to terminate connections first:

```sql
-- Terminate all connections to the database
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'mainfolder_db'
  AND pid <> pg_backend_pid();

-- Then delete the database
DROP DATABASE IF EXISTS mainfolder_db;
```

---

## Step 3: Delete Multiple Databases

### Delete Specific Databases:

```sql
DROP DATABASE IF EXISTS database1;
DROP DATABASE IF EXISTS database2;
DROP DATABASE IF EXISTS database3;
```

### Delete All User Databases (Keep System Databases):

**⚠️ This will delete ALL user-created databases!**

```sql
-- Connect to postgres database first
\c postgres

-- Generate and execute DROP commands for all non-system databases
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT datname 
        FROM pg_database 
        WHERE datistemplate = false 
        AND datname NOT IN ('postgres')
    LOOP
        EXECUTE 'DROP DATABASE IF EXISTS ' || quote_ident(r.datname) || ';';
    END LOOP;
END $$;
```

**Or using a script approach:**

```sql
-- List databases to delete (excluding system databases)
SELECT 'DROP DATABASE IF EXISTS ' || datname || ';' 
FROM pg_database 
WHERE datistemplate = false 
AND datname NOT IN ('postgres');
```

Copy the output and execute it.

---

## Step 4: Delete ALL Databases (Including postgres)

**⚠️ EXTREME WARNING: This will delete EVERYTHING including the default postgres database!**

This is usually only needed for a complete PostgreSQL reset:

```sql
-- Connect to template1 (one of the system databases)
\c template1

-- Terminate all connections
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE datname IS NOT NULL
  AND pid <> pg_backend_pid();

-- Delete all databases except template0 and template1
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT datname 
        FROM pg_database 
        WHERE datname NOT IN ('template0', 'template1')
    LOOP
        EXECUTE 'DROP DATABASE IF EXISTS ' || quote_ident(r.datname) || ';';
    END LOOP;
END $$;
```

**Note:** You cannot delete `template0` and `template1` as they are required system databases.

---

## Complete Reset Script (Windows PowerShell)

Save this as `reset-postgres.ps1`:

```powershell
# PostgreSQL Complete Reset Script
# WARNING: This deletes ALL user databases!

param(
    [string]$Username = "postgres",
    [string]$Password = ""
)

$pgPath = "C:\Program Files\PostgreSQL"
$pgVersions = Get-ChildItem -Path $pgPath -Directory | Where-Object { $_.Name -match '^\d+$' }

if (-not $pgVersions) {
    Write-Host "PostgreSQL not found!" -ForegroundColor Red
    exit 1
}

$latestVersion = $pgVersions | Sort-Object { [int]($_.Name) } -Descending | Select-Object -First 1
$psqlPath = Join-Path $latestVersion.FullName "bin\psql.exe"

Write-Host "Listing all databases..." -ForegroundColor Yellow
& $psqlPath -U $Username -c "\l"

$confirm = Read-Host "`nAre you sure you want to delete ALL user databases? (type 'YES' to confirm)"
if ($confirm -ne "YES") {
    Write-Host "Cancelled." -ForegroundColor Green
    exit 0
}

Write-Host "`nDeleting all user databases..." -ForegroundColor Yellow

# Get list of databases to delete
$databases = & $psqlPath -U $Username -t -c "SELECT datname FROM pg_database WHERE datistemplate = false AND datname NOT IN ('postgres');"

foreach ($db in $databases) {
    $db = $db.Trim()
    if ([string]::IsNullOrWhiteSpace($db)) { continue }
    
    Write-Host "Deleting database: $db" -ForegroundColor Yellow
    
    # Terminate connections
    & $psqlPath -U $Username -d postgres -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '$db' AND pid <> pg_backend_pid();" 2>&1 | Out-Null
    
    # Drop database
    & $psqlPath -U $Username -d postgres -c "DROP DATABASE IF EXISTS $db;" 2>&1 | Out-Null
}

Write-Host "`nAll user databases deleted!" -ForegroundColor Green
```

Usage:
```powershell
.\reset-postgres.ps1 -Username admin -Password admin@123
```

---

## Quick Reference Commands

### List Databases:
```bash
psql -U postgres -c "\l"
```

### Delete Single Database:
```bash
psql -U postgres -c "DROP DATABASE IF EXISTS database_name;"
```

### Delete with Active Connections:
```sql
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'database_name'
  AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS database_name;
```

### Delete All User Databases (Safe - keeps postgres):
```sql
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT datname 
        FROM pg_database 
        WHERE datistemplate = false 
        AND datname NOT IN ('postgres')
    LOOP
        EXECUTE 'DROP DATABASE IF EXISTS ' || quote_ident(r.datname) || ';';
    END LOOP;
END $$;
```

---

## Common Issues

### Error: "database is being accessed by other users"

**Solution:** Terminate connections first:
```sql
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'your_database'
  AND pid <> pg_backend_pid();
```

### Error: "cannot drop the currently open database"

**Solution:** Connect to a different database first:
```sql
\c postgres
DROP DATABASE your_database;
```

### Error: "permission denied"

**Solution:** Use a superuser account (usually `postgres`):
```bash
psql -U postgres
```

---

## Safety Tips

1. **Always backup before deleting:**
   ```bash
   pg_dump -U postgres database_name > backup.sql
   ```

2. **Test on a development environment first**

3. **Use `IF EXISTS` to avoid errors:**
   ```sql
   DROP DATABASE IF EXISTS database_name;
   ```

4. **Double-check database names before deleting**

5. **Never delete `template0` or `template1`** - these are system databases

---

## Restore After Deletion

If you have a backup:
```bash
psql -U postgres -c "CREATE DATABASE database_name;"
psql -U postgres -d database_name < backup.sql
```


