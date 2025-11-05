# Deployment Guide - PathForge Solutions

This guide will help you deploy your Spring Boot backend with PostgreSQL and React frontend to production for **FREE**.

## 📋 Prerequisites

1. GitHub account (free)
2. Render account (free) - for backend hosting
3. Netlify account (free) - for frontend hosting
4. PostgreSQL database (free tier from Render)

---

## 🗄️ Step 1: Set Up PostgreSQL Database (FREE)

### Option A: Render PostgreSQL (Recommended - Easiest)

1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `pathforge-db` (or any name you like)
   - **Database**: `mainfolder_db`
   - **User**: `pathforge_user` (or auto-generated)
   - **Region**: Choose closest to your users (e.g., `Oregon` for US)
   - **PostgreSQL Version**: `16` (or latest)
   - **Plan**: **Free** (select this!)
4. Click **"Create Database"**
5. Wait 2-3 minutes for database to be created
6. **IMPORTANT**: Copy these values (you'll need them later):
   - **Internal Database URL** (for Render backend)
   - Or individual values:
     - Host
     - Port (usually 5432)
     - Database name
     - Username
     - Password

### Option B: Other Free PostgreSQL Options

- **Supabase** (free tier): https://supabase.com
- **Railway** (free tier with credit): https://railway.app
- **Neon** (free tier): https://neon.tech
- **ElephantSQL** (free tier): https://www.elephantsql.com

---

## 🚀 Step 2: Deploy Backend to Render

### 2.1 Push Code to GitHub

1. Make sure your `Backend` folder is in a GitHub repository
2. If not already done:
   ```bash
   cd Backend
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

### 2.2 Create Render Web Service

1. Go to [render.com](https://render.com/dashboard)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository (authorize if needed)
4. Select your repository
5. Configure the service:

   **Basic Settings:**
   - **Name**: `pathforge-backend` (or any name)
   - **Region**: Same as your database (e.g., `Oregon`)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `Backend` (important!)
   - **Environment**: `Java`
   - **Build Command**: 
     ```bash
     ./mvnw clean package -DskipTests
     ```
   - **Start Command**:
     ```bash
     java -Dserver.port=$PORT -jar target/MainFolder-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
     ```

   **Environment Variables** (click "Advanced" to add):
   
   Add these environment variables:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=jdbc:postgresql://YOUR_DB_HOST:5432/mainfolder_db
   DATABASE_USERNAME=your_db_username
   DATABASE_PASSWORD=your_db_password
   JAVA_VERSION=17
   ALLOWED_ORIGINS=http://localhost:5173,https://your-site.netlify.app
   ```
   
   **Note on ALLOWED_ORIGINS**: 
   - This is optional - by default, CORS allows all Netlify domains (`*.netlify.app`, `*.netlify.com`) and localhost
   - If you want to restrict to specific domains, set this variable with comma-separated URLs
   - Example: `ALLOWED_ORIGINS=http://localhost:5173,https://pathforge-solutions.netlify.app`

   **For Render Internal Database URL:**
   - If you created PostgreSQL on Render, use the **Internal Database URL** from your database dashboard
   - Format: `postgresql://username:password@host:5432/dbname`
   - Set `DATABASE_URL` to this full URL

   **For External PostgreSQL:**
   - Extract individual values and set:
     - `DATABASE_URL=jdbc:postgresql://HOST:PORT/DATABASE`
     - `DATABASE_USERNAME=username`
     - `DATABASE_PASSWORD=password`

6. **Plan**: Select **"Free"** (spinner plan)
7. Click **"Create Web Service"**

### 2.3 Wait for Deployment

- Render will build and deploy your application (takes 5-10 minutes first time)
- You'll see build logs in real-time
- Once deployed, you'll get a URL like: `https://pathforge-backend.onrender.com`

### 2.4 Test Backend

1. Open: `https://your-backend-url.onrender.com/main/contact/health`
2. Should return: `"Contact API is working properly!"`
3. If it works, you're good! ✅

### 2.5 Important Notes

- **Free tier spins down after 15 minutes of inactivity** - first request after spin-down takes ~30 seconds
- Database connections persist even when service spins down
- Consider upgrading to paid plan ($7/month) if you need always-on service

---

## 🌐 Step 3: Deploy Frontend to Netlify

### 3.1 Update API Configuration

Your frontend already uses environment variables (`VITE_API_BASE_URL`), which is perfect!

### 3.2 Build Locally (Test First - Optional)

```bash
cd Frontend
npm install
npm run build
```

This creates a `dist` folder. Test it works locally.

### 3.3 Deploy to Netlify

#### Option A: GitHub Integration (Recommended)

1. Go to [netlify.com](https://app.netlify.com) and sign up/login
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify to access your repositories
5. Select your repository
6. Configure:
   - **Base directory**: `Frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - Click **"Show advanced"** → **"New variable"**
   - Add environment variable:
     - **Key**: `VITE_API_BASE_URL`
     - **Value**: `https://your-backend-url.onrender.com` (your Render backend URL from Step 2.3)
7. Click **"Deploy site"**

#### Option B: Manual Drag & Drop

1. Build your frontend locally:
   ```bash
   cd Frontend
   npm install
   npm run build
   ```
2. Go to [netlify.com](https://app.netlify.com)
3. Drag and drop the `Frontend/dist` folder to Netlify dashboard
4. Go to **Site settings** → **Environment variables**
5. Add: `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com`
6. Redeploy after adding environment variable

### 3.4 Update CORS in Backend (Important!)

After Netlify deployment, update your backend CORS:

1. Go to your Netlify site dashboard
2. Copy your site URL (e.g., `https://pathforge-solutions.netlify.app`)
3. Update `Backend/src/main/java/com/example/MainFolder/Controller/ContactController.java`:
   ```java
   @CrossOrigin(origins = {"http://localhost:5173", "https://YOUR-NETLIFY-SITE.netlify.app"})
   ```
4. Commit and push to GitHub
5. Render will automatically redeploy (or trigger manual redeploy)

### 3.5 Test Complete Integration

1. Visit your Netlify site URL
2. Try submitting a contact form
3. Check if it connects to your backend
4. Verify data is saved in PostgreSQL (use Render database dashboard or connect via tool)

---

## 🔧 Step 4: Configure Database Connection (Detailed)

### For Render PostgreSQL (Same Account)

If both your backend and database are on Render:

1. In your **Web Service** dashboard, go to **"Environment"** tab
2. Find **"Add Environment Variable"**
3. Render automatically provides database connection variables if on same account
4. Or manually set:
   ```
   DATABASE_URL=postgresql://username:password@host:5432/mainfolder_db
   ```
   (Copy from your PostgreSQL service dashboard)

### For External PostgreSQL

Set these environment variables:

```
DATABASE_URL=jdbc:postgresql://HOST:PORT/DATABASE
DATABASE_USERNAME=username
DATABASE_PASSWORD=password
```

Replace:
- `HOST`: Your database host (e.g., `dpg-xxxxx-a.oregon-postgres.render.com`)
- `PORT`: Usually `5432`
- `DATABASE`: Your database name (e.g., `mainfolder_db`)
- `username` & `password`: Your database credentials

---

## 📝 Environment Variables Summary

### Backend (Render)

```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://host:5432/mainfolder_db
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
JAVA_VERSION=17
PORT=10000
ALLOWED_ORIGINS=http://localhost:5173,https://your-site.netlify.app
```

**Note**: `ALLOWED_ORIGINS` is optional. By default, CORS allows all Netlify domains automatically.

### Frontend (Netlify)

```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

---

## ✅ Verification Checklist

- [ ] PostgreSQL database created and running
- [ ] Backend deployed on Render and health check works
- [ ] Frontend deployed on Netlify
- [ ] Environment variables set correctly in both services
- [ ] CORS updated with Netlify URL
- [ ] Contact form submits successfully
- [ ] Data persists in PostgreSQL (check via Render dashboard or admin tool)

---

## 🐛 Troubleshooting

### Backend won't start
- Check build logs in Render dashboard
- Verify Java version matches (should be 17)
- Check environment variables are set correctly
- Ensure PostgreSQL connection string is correct

### Database connection errors
- Verify `DATABASE_URL` format: `jdbc:postgresql://host:port/database`
- Check database credentials are correct
- Ensure database is accessible (not IP-restricted)
- For Render: Use **Internal Database URL** for same-account services

### CORS errors in browser
- Update `ContactController.java` with your exact Netlify URL
- Redeploy backend after CORS update
- Check browser console for exact error message

### Frontend can't connect to backend
- Verify `VITE_API_BASE_URL` is set in Netlify environment variables
- Ensure backend URL is correct (no trailing slash)
- Check backend health endpoint works directly
- Verify CORS is configured correctly

### Data not persisting
- Check you're using `prod` profile (PostgreSQL)
- Verify database connection is working
- Check Render database dashboard for data
- Ensure `spring.jpa.hibernate.ddl-auto=update` is set (auto-creates tables)

---

## 🔄 Updating Your Application

### Backend Updates
1. Make changes locally
2. Commit and push to GitHub
3. Render automatically redeploys (or trigger manually)

### Frontend Updates
1. Make changes locally
2. Commit and push to GitHub
3. Netlify automatically redeploys
4. Update environment variables if backend URL changes

---

## 💰 Cost Summary

**Total Cost: $0/month** ✅

- Render Web Service: **Free** (spins down after 15 min inactivity)
- Render PostgreSQL: **Free** (90 days free, then $7/month or use alternatives)
- Netlify: **Free** (100GB bandwidth/month, unlimited builds)

---

## 🎯 Next Steps

1. **Monitor your application** via Render and Netlify dashboards
2. **Set up custom domain** (free on Netlify, paid on Render)
3. **Add SSL certificates** (automatic on both platforms)
4. **Set up monitoring/alerts** (optional, available in both platforms)
5. **Consider upgrading** to paid plans if you need:
   - Always-on backend (Render: $7/month)
   - More database storage (varies)
   - Higher bandwidth (Netlify Pro: $19/month)

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Spring Boot Docs**: https://spring.io/projects/spring-boot

---

**Good luck with your deployment! 🚀**

