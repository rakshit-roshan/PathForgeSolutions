# Quick Deployment Reference 🚀

## Backend: Render (FREE) - PostgreSQL Only

### 1. Create PostgreSQL Database on Render
- New → PostgreSQL → Free tier
- Copy **Internal Database URL** (for Render backend)
- Copy **External Database URL** (for admin tools)

### 2. Create Web Service on Render
- New → Web Service → Connect GitHub
- **Root Directory**: `Backend` ⚠️ Important!
- **Build Command**: `./mvnw clean package -DskipTests`
- **Start Command**: `java -Dserver.port=$PORT -jar target/MainFolder-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod`

### 3. Environment Variables
```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=postgresql://user:pass@host:5432/mainfolder_db
JAVA_VERSION=17
PORT=10000
```

**Note**: Both local and production now use PostgreSQL (no H2).

---

## Frontend: Netlify (FREE)

### 1. Connect GitHub Repository
- Add new site → Import from Git
- **Base directory**: `Frontend`
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### 2. Environment Variables
```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

---

## ✅ Test Your Deployment

1. Backend Health: `https://your-backend.onrender.com/main/contact/health`
2. Frontend: Visit your Netlify URL
3. Submit contact form and verify it works!

---

## 📊 Access PostgreSQL Database

### Quick Methods:
1. **pgAdmin** (Desktop): https://www.pgadmin.org/download/
2. **DBeaver** (Desktop): https://dbeaver.io/download/
3. **psql** (Command Line): `psql postgresql://user:pass@host:5432/db`
4. **Render Dashboard**: View data directly in Render

---

**📖 Full Guide**: See `FREE-BACKEND-DEPLOYMENT.md` for complete instructions with database access details

