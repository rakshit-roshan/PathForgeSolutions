# Quick Start: PostgreSQL Setup

## 🚀 Fastest Way to Get Started

### For Windows Users:

1. **Install PostgreSQL** (if not already installed):
   - Download from: https://www.postgresql.org/download/windows/
   - Install with default settings
   - Remember the password you set for `postgres` user

2. **Run the setup script:**
   ```powershell
   cd Backend
   .\setup-postgres-windows.ps1
   ```
   
   Or manually:
   ```powershell
   # Open PowerShell as Administrator
   cd "C:\Program Files\PostgreSQL\{version}\bin"
   .\psql -U postgres
   # Then run:
   CREATE DATABASE mainfolder_db;
   \q
   ```

3. **Update application.properties:**
   ```properties
   spring.datasource.password=your_postgres_password
   ```

4. **Run the application:**
   ```powershell
   mvn spring-boot:run
   ```

### For Mac/Linux Users:

1. **Install PostgreSQL:**
   ```bash
   # macOS
   brew install postgresql@15
   brew services start postgresql@15
   
   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

2. **Run the setup script:**
   ```bash
   cd Backend
   chmod +x setup-postgres-linux.sh
   ./setup-postgres-linux.sh
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

---

## 📝 Manual Setup (Alternative)

### Step 1: Start PostgreSQL Service

**Windows:**
- Open Services (Win+R → `services.msc`)
- Find "postgresql-x64-{version}"
- Right-click → Start

**Mac:**
```bash
brew services start postgresql@15
```

**Linux:**
```bash
sudo systemctl start postgresql
```

### Step 2: Create Database

**Windows:**
```powershell
cd "C:\Program Files\PostgreSQL\{version}\bin"
.\psql -U postgres
```

**Mac/Linux:**
```bash
sudo -u postgres psql
```

**Then in psql:**
```sql
CREATE DATABASE mainfolder_db;
\q
```

### Step 3: Configure Application

Edit `Backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mainfolder_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_POSTGRES_PASSWORD
```

### Step 4: Run Application

```bash
cd Backend
mvn spring-boot:run
```

---

## ✅ Verify Setup

1. **Check PostgreSQL is running:**
   - Windows: Services panel
   - Mac: `brew services list`
   - Linux: `sudo systemctl status postgresql`

2. **Test database connection:**
   ```bash
   psql -U postgres -d mainfolder_db
   ```

3. **Run application:**
   ```bash
   mvn spring-boot:run
   ```

   You should see:
   ```
   Started MainFolderApplication in X.XXX seconds
   ```

---

## 🔧 Troubleshooting

### "Connection refused"
→ PostgreSQL service is not running. Start it using the commands above.

### "password authentication failed"
→ Update the password in `application.properties` or use environment variables.

### "database does not exist"
→ Run the CREATE DATABASE command from Step 2.

---

## 📚 More Information

See `POSTGRESQL-SETUP.md` for detailed documentation.

