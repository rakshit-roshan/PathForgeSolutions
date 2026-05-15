# PostgreSQL Setup Guide

This guide will help you set up PostgreSQL for both local development and production deployment.

## Table of Contents
1. [Local Development Setup (Windows)](#local-development-setup-windows)
2. [Local Development Setup (Mac/Linux)](#local-development-setup-maclinux)
3. [Database Configuration](#database-configuration)
4. [Running the Application](#running-the-application)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Local Development Setup (Windows)

### Step 1: Install PostgreSQL

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Or use the installer: https://www.postgresql.org/download/windows/installer/
   - Download the latest version (recommended: PostgreSQL 15 or 16)

2. **Run the Installer:**
   - Run the downloaded `.exe` file
   - Follow the installation wizard
   - **Important:** Remember the password you set for the `postgres` superuser
   - Default port: `5432` (keep this unless you have a conflict)
   - Default installation directory: `C:\Program Files\PostgreSQL\{version}`

3. **Verify Installation:**
   - Open Command Prompt or PowerShell
   - Navigate to PostgreSQL bin directory:
     ```powershell
     cd "C:\Program Files\PostgreSQL\{version}\bin"
     ```
   - Test connection:
     ```powershell
     psql -U postgres
     ```
   - Enter your password when prompted
   - You should see the PostgreSQL prompt: `postgres=#`

### Step 2: Create Database and User

1. **Connect to PostgreSQL:**
   ```powershell
   psql -U postgres
   ```

2. **Create Database:**
   ```sql
   CREATE DATABASE mainfolder_db;
   ```

3. **Create Application User (Optional but Recommended):**
   ```sql
   CREATE USER mainfolder_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE mainfolder_db TO mainfolder_user;
   \q
   ```

4. **Verify Database Creation:**
   ```powershell
   psql -U postgres -d mainfolder_db
   ```
   Or if using the application user:
   ```powershell
   psql -U mainfolder_user -d mainfolder_db
   ```

### Step 3: Configure Application

The application is already configured to use PostgreSQL. Update credentials if needed:

**Option 1: Update `application.properties`**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mainfolder_db
spring.datasource.username=postgres
spring.datasource.password=your_postgres_password
```

**Option 2: Use Environment Variables (Recommended)**
```powershell
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/mainfolder_db"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="your_postgres_password"
```

---

## Local Development Setup (Mac/Linux)

### Step 1: Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**CentOS/RHEL:**
```bash
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Step 2: Create Database and User

1. **Switch to postgres user:**
   ```bash
   sudo -u postgres psql
   ```

2. **Create Database:**
   ```sql
   CREATE DATABASE mainfolder_db;
   ```

3. **Create Application User (Optional):**
   ```sql
   CREATE USER mainfolder_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE mainfolder_db TO mainfolder_user;
   \q
   ```

### Step 3: Configure Application

**Using Environment Variables:**
```bash
export DATABASE_URL="jdbc:postgresql://localhost:5432/mainfolder_db"
export DATABASE_USERNAME="postgres"
export DATABASE_PASSWORD="your_postgres_password"
```

---

## Database Configuration

### Default Configuration

The application uses these default values (can be overridden with environment variables):

- **Database URL:** `jdbc:postgresql://localhost:5432/mainfolder_db`
- **Username:** `postgres`
- **Password:** `postgres` (change this!)
- **Port:** `5432`

### Environment Variables

You can override defaults using environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Full JDBC connection URL | `jdbc:postgresql://localhost:5432/mainfolder_db` |
| `DATABASE_USERNAME` | Database username | `postgres` |
| `DATABASE_PASSWORD` | Database password | `your_password` |

### Connection Pool Settings

The application uses HikariCP connection pool with these settings:
- Maximum pool size: 10
- Minimum idle: 2
- Connection timeout: 20 seconds
- Idle timeout: 5 minutes
- Max lifetime: 10 minutes

---

## Running the Application

### Method 1: Using Maven (Default Profile)

```bash
cd Backend
mvn spring-boot:run
```

### Method 2: Using Maven with Environment Variables

**Windows PowerShell:**
```powershell
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/mainfolder_db"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="your_password"
mvn spring-boot:run
```

**Windows CMD:**
```cmd
set DATABASE_URL=jdbc:postgresql://localhost:5432/mainfolder_db
set DATABASE_USERNAME=postgres
set DATABASE_PASSWORD=your_password
mvn spring-boot:run
```

**Mac/Linux:**
```bash
export DATABASE_URL="jdbc:postgresql://localhost:5432/mainfolder_db"
export DATABASE_USERNAME="postgres"
export DATABASE_PASSWORD="your_password"
mvn spring-boot:run
```

### Method 3: Using Production Profile

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

---

## Production Deployment

### Render.com / Railway / Heroku

These platforms automatically provide PostgreSQL databases. Use their environment variables:

**Render.com:**
- The platform provides `DATABASE_URL` automatically
- No additional configuration needed if using the provided PostgreSQL addon

**Railway:**
- Provides `DATABASE_URL`, `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`
- Update `application-prod.properties` to use these if needed

**Heroku:**
- Provides `DATABASE_URL` when you add Postgres addon
- Format: `postgres://user:password@host:port/database`

### Manual Production Setup

1. **Install PostgreSQL on your server**
2. **Create production database:**
   ```sql
   CREATE DATABASE mainfolder_db_prod;
   CREATE USER mainfolder_prod WITH PASSWORD 'strong_production_password';
   GRANT ALL PRIVILEGES ON DATABASE mainfolder_db_prod TO mainfolder_prod;
   ```

3. **Set environment variables:**
   ```bash
   export DATABASE_URL="jdbc:postgresql://your-server:5432/mainfolder_db_prod"
   export DATABASE_USERNAME="mainfolder_prod"
   export DATABASE_PASSWORD="strong_production_password"
   export SPRING_PROFILES_ACTIVE=prod
   ```

4. **Update `application-prod.properties` if needed**

---

## Troubleshooting

### Error: "Connection refused"

**Problem:** PostgreSQL service is not running.

**Solution:**
- **Windows:** Open Services (Win+R → `services.msc`), find "postgresql-x64-{version}", right-click → Start
- **Mac:** `brew services start postgresql@15`
- **Linux:** `sudo systemctl start postgresql`

### Error: "password authentication failed"

**Problem:** Wrong password or user doesn't exist.

**Solution:**
1. Reset postgres password:
   ```sql
   ALTER USER postgres WITH PASSWORD 'new_password';
   ```
2. Update `application.properties` or environment variables

### Error: "database does not exist"

**Problem:** Database `mainfolder_db` hasn't been created.

**Solution:**
```sql
CREATE DATABASE mainfolder_db;
```

### Error: "permission denied"

**Problem:** User doesn't have privileges.

**Solution:**
```sql
GRANT ALL PRIVILEGES ON DATABASE mainfolder_db TO your_username;
```

### Port 5432 Already in Use

**Problem:** Another PostgreSQL instance or application is using port 5432.

**Solution:**
1. Find what's using the port:
   - **Windows:** `netstat -ano | findstr :5432`
   - **Mac/Linux:** `lsof -i :5432`
2. Stop the conflicting service or change PostgreSQL port
3. Update connection URL: `jdbc:postgresql://localhost:5433/mainfolder_db`

### Check PostgreSQL Status

**Windows:**
```powershell
Get-Service postgresql*
```

**Mac/Linux:**
```bash
sudo systemctl status postgresql
# or
brew services list
```

### Test Database Connection

```bash
psql -U postgres -d mainfolder_db -h localhost
```

---

## Quick Start Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `mainfolder_db` created
- [ ] User credentials configured (in `application.properties` or environment variables)
- [ ] PostgreSQL service is running
- [ ] Port 5432 is accessible
- [ ] Test connection: `psql -U postgres -d mainfolder_db`
- [ ] Run application: `mvn spring-boot:run`

---

## Additional Resources

- **PostgreSQL Official Docs:** https://www.postgresql.org/docs/
- **Spring Boot Data JPA:** https://spring.io/guides/gs/accessing-data-jpa/
- **HikariCP Configuration:** https://github.com/brettwooldridge/HikariCP

---

## Need Help?

If you encounter issues:
1. Check PostgreSQL logs:
   - **Windows:** `C:\Program Files\PostgreSQL\{version}\data\log\`
   - **Mac/Linux:** `/var/log/postgresql/` or check with `journalctl -u postgresql`
2. Verify connection with `psql` command-line tool
3. Check application logs for detailed error messages
4. Ensure firewall allows connections on port 5432

