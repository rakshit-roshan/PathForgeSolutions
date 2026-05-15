# 🚀 Complete Free Backend Deployment Guide - PathForge Solutions

This guide provides step-by-step instructions for deploying your Spring Boot backend with PostgreSQL for **FREE**, plus how to access and manage your PostgreSQL database.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Free Hosting Options Comparison](#free-hosting-options-comparison)
3. [Option 1: Render (Recommended)](#option-1-render-recommended)
4. [Option 2: Railway](#option-2-railway)
5. [Option 3: Fly.io](#option-3-flyio)
6. [Database Setup](#database-setup)
7. [Accessing PostgreSQL Database](#accessing-postgresql-database)
8. [Frontend Integration](#frontend-integration)
9. [Troubleshooting](#troubleshooting)
10. [Cost Summary](#cost-summary)

---

## Prerequisites

- ✅ GitHub account (free)
- ✅ PostgreSQL database (we'll set up free tier)
- ✅ Java 17 installed locally (for testing)
- ✅ Maven installed (or use `mvnw` wrapper)

---

## Free Hosting Options Comparison

| Platform | Free Tier | Auto-Deploy | Database | Best For |
|----------|-----------|-------------|----------|----------|
| **Render** | ✅ Yes | ✅ GitHub | ✅ PostgreSQL | Easy setup, beginner-friendly |
| **Railway** | ✅ $5 credit/month | ✅ GitHub | ✅ PostgreSQL | Fast setup, good docs |
| **Fly.io** | ✅ Generous | ✅ GitHub | ❌ External | Advanced users, global |
| **Heroku** | ❌ No free tier | ✅ GitHub | ✅ PostgreSQL | Not recommended (no free tier) |

**Recommendation**: Start with **Render** (easiest), or **Railway** (better free tier).

---

## Option 1: Render (Recommended) ⭐

### Step 1: Create PostgreSQL Database on Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `pathforge-db` (or any name)
   - **Database**: `mainfolder_db`
   - **User**: `pathforge_user` (or auto-generated)
   - **Region**: Choose closest (e.g., `Oregon` for US)
   - **PostgreSQL Version**: `16` (latest)
   - **Plan**: **Free** (spinner plan)
4. Click **"Create Database"**
5. Wait 2-3 minutes for creation
6. **IMPORTANT**: Copy these values:
   - **Internal Database URL** (for Render backend)
   - **External Database URL** (for external tools)
   - Or individual values: Host, Port, Database, Username, Password

### Step 2: Push Code to GitHub

```bash
cd Backend
git init
git add .
git commit -m "Initial commit - PostgreSQL only"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 3: Create Render Web Service

1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository
5. Configure:

   **Basic Settings:**
   - **Name**: `pathforge-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `Backend` ⚠️ **Important!**
   - **Environment**: `Java`
   - **Build Command**: 
     ```bash
     ./mvnw clean package -DskipTests
     ```
   - **Start Command**:
     ```bash
     java -Dserver.port=$PORT -jar target/MainFolder-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
     ```

   **Environment Variables** (click "Advanced" → "Add Environment Variable"):
   
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=postgresql://username:password@host:5432/mainfolder_db
   DATABASE_USERNAME=your_db_username
   DATABASE_PASSWORD=your_db_password
   JAVA_VERSION=17
   PORT=10000
   ```
   
   **For Render Internal Database URL:**
   - Copy the **Internal Database URL** from your PostgreSQL dashboard
   - Format: `postgresql://username:password@host:5432/dbname`
   - Set `DATABASE_URL` to this full URL
   - You can skip `DATABASE_USERNAME` and `DATABASE_PASSWORD` if using full URL

6. **Plan**: Select **"Free"** (spinner plan)
7. Click **"Create Web Service"**

### Step 4: Wait for Deployment

- First deployment: 5-10 minutes
- Watch build logs in real-time
- Once deployed: `https://pathforge-backend.onrender.com`

### Step 5: Test Deployment

```bash
# Health check
curl https://your-backend-url.onrender.com/main/contact/health

# Should return: "Contact API is working properly!"
```

### Render Limitations

- ⚠️ **Free tier spins down after 15 minutes of inactivity**
- First request after spin-down takes ~30 seconds to wake up
- Consider upgrading to $7/month for always-on service

---

## Option 2: Railway

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. You get $5 free credit/month

### Step 2: Create PostgreSQL Database

1. Click **"New Project"**
2. Click **"New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway auto-creates database
4. Go to **"Variables"** tab → Copy connection details

### Step 3: Deploy Backend

1. In Railway project, click **"New"** → **"GitHub Repo"**
2. Select your repository
3. Railway auto-detects Spring Boot
4. Set **Root Directory** to `Backend`
5. Add environment variables:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   DATABASE_USERNAME=${{Postgres.USERNAME}}
   DATABASE_PASSWORD=${{Postgres.PASSWORD}}
   JAVA_VERSION=17
   ```
6. Railway auto-deploys
7. Get your URL: `https://your-app.up.railway.app`

### Railway Advantages

- ✅ No spin-down (stays active)
- ✅ $5 free credit/month
- ✅ Better free tier than Render
- ✅ Auto-detects Java/Spring Boot

---

## Option 3: Fly.io

### Step 1: Install Fly CLI

```bash
# Windows (PowerShell)
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# Mac/Linux
curl -L https://fly.io/install.sh | sh
```

### Step 2: Create Fly.io App

```bash
fly auth login
fly launch
```

### Step 3: Configure Database

- Use external PostgreSQL (Neon, Supabase, etc.)
- Set environment variables in `fly.toml` or via CLI

### Step 4: Deploy

```bash
fly deploy
```

**Note**: Fly.io requires more setup but offers global deployment.

---

## Database Setup

### Free PostgreSQL Providers

1. **Render PostgreSQL** (90 days free, then $7/month)
2. **Neon** (free tier: 0.5GB storage) - https://neon.tech
3. **Supabase** (free tier: 500MB) - https://supabase.com
4. **Railway** (included with $5 credit)
5. **ElephantSQL** (free tier: 20MB) - https://www.elephantsql.com

### Recommended: Neon or Supabase

Both offer permanent free tiers with good limits.

---

## Accessing PostgreSQL Database

### Method 1: Using Database Admin Tools (Recommended)

#### Option A: pgAdmin (Desktop - Free)

1. Download: https://www.pgadmin.org/download/
2. Install pgAdmin
3. Right-click **"Servers"** → **"Create"** → **"Server"**
4. **General Tab**:
   - Name: `PathForge Production`
5. **Connection Tab**:
   - Host: `your-db-host.render.com` (from Render dashboard)
   - Port: `5432`
   - Database: `mainfolder_db`
   - Username: `your_username`
   - Password: `your_password` (click "Save password")
6. Click **"Save"**
7. Navigate: **Servers** → **PathForge Production** → **Databases** → **mainfolder_db** → **Schemas** → **public** → **Tables**

#### Option B: DBeaver (Desktop - Free)

1. Download: https://dbeaver.io/download/
2. Install DBeaver
3. Click **"New Database Connection"**
4. Select **"PostgreSQL"**
5. Enter connection details:
   - Host: `your-db-host.render.com`
   - Port: `5432`
   - Database: `mainfolder_db`
   - Username: `your_username`
   - Password: `your_password`
6. Click **"Test Connection"** → **"Finish"**
7. Browse tables, run queries, export data

#### Option C: TablePlus (Desktop - Paid/Free Trial)

1. Download: https://tableplus.com/
2. Click **"Create a new connection"**
3. Select **"PostgreSQL"**
4. Enter connection details
5. Click **"Connect"**

### Method 2: Using Command Line (psql)

#### Install psql:

**Windows:**
```powershell
# Download PostgreSQL from https://www.postgresql.org/download/windows/
# Or use Chocolatey
choco install postgresql
```

**Mac:**
```bash
brew install postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql-client
```

#### Connect to Database:

```bash
psql -h your-db-host.render.com -p 5432 -U your_username -d mainfolder_db
```

Example:
```bash
psql -h dpg-xxxxx-a.oregon-postgres.render.com -p 5432 -U pathforge_user -d mainfolder_db
```

Enter password when prompted.

#### Common psql Commands:

```sql
-- List all tables
\dt

-- Describe a table
\d contact_entity

-- View all data in a table
SELECT * FROM contact_entity;

-- Count records
SELECT COUNT(*) FROM contact_entity;

-- Exit psql
\q
```

### Method 3: Using Online Tools

#### Option A: Render Database Dashboard

1. Go to your Render dashboard
2. Click on your PostgreSQL service
3. Click **"Connect"** tab
4. Use **"psql"** command or **"External Connection"** details

#### Option B: Adminer (Web-based)

1. Deploy Adminer on Render (separate service)
2. Or use online Adminer: https://www.adminer.org/
3. Enter connection details

### Method 4: Using JDBC Connection (Java)

Your Spring Boot app already connects via JDBC. Connection string format:
```
jdbc:postgresql://host:port/database
```

Example:
```
jdbc:postgresql://dpg-xxxxx-a.oregon-postgres.render.com:5432/mainfolder_db
```

### Method 5: Using VS Code Extensions

1. Install **"PostgreSQL"** extension by Chris Kolkman
2. Click **"Add Connection"**
3. Enter connection details
4. Browse tables, run queries in VS Code

---

## Common Database Operations

### View All Tables

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### View Table Structure

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'contact_entity';
```

### View All Data in Contact Table

```sql
SELECT * FROM contact_entity;
```

### Count Records

```sql
SELECT COUNT(*) FROM contact_entity;
SELECT COUNT(*) FROM user_entity;
```

### Delete All Data (Careful!)

```sql
DELETE FROM contact_entity;
DELETE FROM user_entity;
```

### Reset Auto-increment (if needed)

```sql
ALTER SEQUENCE contact_entity_id_seq RESTART WITH 1;
```

---

## Frontend Integration

### Step 1: Update Netlify Environment Variables

1. Go to your Netlify dashboard
2. Select your site
3. Go to **"Site settings"** → **"Environment variables"**
4. Add/Update:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```
5. **Redeploy** your site (important!)

### Step 2: Test Integration

1. Visit your Netlify site
2. Submit a contact form
3. Check browser console (F12) for errors
4. Verify data in PostgreSQL database

### Step 3: Update CORS (if needed)

Your `SecurityConfig.java` already allows all Netlify domains (`*.netlify.app`), so no changes needed unless you want to restrict to specific domains.

---

## Environment Variables Reference

### Backend (Render/Railway)

```bash
# Required
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://host:port/database
# OR use full URL format:
DATABASE_URL=postgresql://username:password@host:5432/database

# Optional (if not using full URL)
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password

# Optional
JAVA_VERSION=17
PORT=10000
ALLOWED_ORIGINS=http://localhost:5173,https://your-site.netlify.app
```

### Frontend (Netlify)

```bash
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

---

## Troubleshooting

### Backend Won't Start

**Problem**: Build fails or app crashes

**Solutions**:
1. Check build logs in Render/Railway dashboard
2. Verify Java version (should be 17)
3. Check `pom.xml` has PostgreSQL dependency
4. Verify environment variables are set correctly
5. Check database connection string format

**Common Issues**:
- Wrong root directory (should be `Backend`)
- Missing `SPRING_PROFILES_ACTIVE=prod`
- Incorrect `DATABASE_URL` format

### Database Connection Errors

**Problem**: `Connection refused` or `Authentication failed`

**Solutions**:
1. Verify database is running (check Render dashboard)
2. Check connection string format:
   - ✅ Correct: `jdbc:postgresql://host:port/database`
   - ❌ Wrong: `postgresql://host:port/database` (missing `jdbc:`)
3. Verify credentials are correct
4. Check if database allows external connections (some providers restrict)
5. For Render: Use **Internal Database URL** if backend is on same account

**Connection String Formats**:
```bash
# Full URL format (Render Internal URL)
DATABASE_URL=postgresql://user:pass@host:5432/db

# JDBC format (for Spring Boot)
DATABASE_URL=jdbc:postgresql://host:5432/database
```

### CORS Errors

**Problem**: Frontend can't connect to backend

**Solutions**:
1. Verify `VITE_API_BASE_URL` is set in Netlify
2. Check backend CORS configuration in `SecurityConfig.java`
3. Ensure backend URL has no trailing slash
4. Check browser console for exact error message

### Data Not Persisting

**Problem**: Data disappears or doesn't save

**Solutions**:
1. Verify you're using `prod` profile (PostgreSQL)
2. Check database connection is working
3. Verify `spring.jpa.hibernate.ddl-auto=update` is set
4. Check database directly using pgAdmin/DBeaver
5. Look for errors in application logs

### Slow First Request (Render Free Tier)

**Problem**: First request takes 30+ seconds

**Solution**: This is normal! Render free tier spins down after 15 minutes of inactivity. First request wakes it up. Consider:
- Upgrading to paid plan ($7/month) for always-on
- Using Railway (no spin-down)
- Setting up a cron job to ping your API every 10 minutes

### Can't Access Database from Local Machine

**Problem**: Connection timeout when connecting from pgAdmin/DBeaver

**Solutions**:
1. Check if database allows external connections
2. Render: Use **External Database URL** (not Internal)
3. Verify firewall isn't blocking port 5432
4. Check if database requires SSL (add `?sslmode=require` to connection string)

---

## Cost Summary

### Free Tier (Recommended Starting Point)

| Service | Cost | Limitations |
|---------|------|-------------|
| **Render Web Service** | $0 | Spins down after 15 min |
| **Render PostgreSQL** | $0 (90 days) | Then $7/month |
| **Neon PostgreSQL** | $0 | 0.5GB storage |
| **Railway** | $5 credit/month | No spin-down |
| **Netlify** | $0 | 100GB bandwidth/month |
| **Total** | **$0-$7/month** | ✅ |

### Paid Tier (If Needed)

- Render Web Service: $7/month (always-on)
- Render PostgreSQL: $7/month (persistent)
- **Total**: $14/month

---

## Quick Reference Commands

### Local Development

```bash
# Run locally with PostgreSQL
cd Backend
mvn spring-boot:run

# Or with environment variables
export DATABASE_URL=jdbc:postgresql://localhost:5432/mainfolder_db
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=password
mvn spring-boot:run
```

### Database Access

```bash
# Connect via psql
psql -h host -p 5432 -U username -d database

# Connect to Render database
psql postgresql://user:pass@host:5432/db
```

### Deployment

```bash
# Build JAR locally
cd Backend
./mvnw clean package

# Test JAR
java -jar target/MainFolder-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

---

## Next Steps

1. ✅ Deploy backend to Render/Railway
2. ✅ Set up PostgreSQL database
3. ✅ Configure environment variables
4. ✅ Test backend health endpoint
5. ✅ Update Netlify frontend with backend URL
6. ✅ Test complete integration
7. ✅ Set up database admin tool (pgAdmin/DBeaver)
8. ✅ Monitor application logs

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **pgAdmin Docs**: https://www.pgadmin.org/docs

---

## Summary

✅ **Backend**: Deploy to Render (free) or Railway ($5 credit/month)  
✅ **Database**: Use Render PostgreSQL (90 days free) or Neon (permanent free)  
✅ **Frontend**: Already on Netlify (free)  
✅ **Total Cost**: $0-$7/month  

**Recommended Setup**:
- Backend: **Render** (easiest)
- Database: **Neon** (permanent free tier)
- Frontend: **Netlify** (already deployed)
- Database Tool: **DBeaver** or **pgAdmin** (free)

---

**Good luck with your deployment! 🚀**

If you encounter any issues, check the troubleshooting section or review the deployment logs in your hosting platform dashboard.

