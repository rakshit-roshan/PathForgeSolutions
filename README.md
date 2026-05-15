# PathForgeSolutions Platform

A professional internship management platform built with Next.js (Frontend) and Spring Boot (Backend).

## 🚀 One-Click Startup
To start both the frontend and backend simultaneously, run the following script from the project root:
```powershell
.\start-app.bat
```

## 🛠 Features
- **Authentication**: JWT-based Login/Register with premium glassmorphic UI.
- **Google Auth**: Secure social login integration (requires Google Client ID configuration).
- **Candidate Dashboard**:
  - Daily log submission to track tasks and progress.
  - Final Report generation as PDF.
- **Admin Dashboard**:
  - Full visibility into candidate status and joining dates.
  - Direct email communication with candidates.
  - Program-wide statistics and management.
- **Contact System**: Lead management with automated email notifications to admins.

## 🔐 Credentials (Demo/Dev)
- **Admin**: `admin@rasutech.in` / `admin123` (Seeded automatically on startup)
- **Database**: PostgreSQL (Configured via `.env` in Backend folder)

## 📧 Email Configuration
The system supports **Brevo** and **Gmail** SMTP.
Configure your API keys in `Backend/.env`:
```env
# Brevo (Recommended)
BREVO_API_KEY=your_key_here
BREVO_SENDER_EMAIL=your_verified_email
BREVO_SENDER_NAME=PathForgeSolutions

# Gmail (Fallback)
SPRING_MAIL_USERNAME=your_gmail@gmail.com
SPRING_MAIL_PASSWORD=your_app_password
```

## 📂 Project Structure
- `Frontend/`: Next.js 14 (App Router) with Tailwind CSS.
- `Backend/`: Spring Boot 3 with Spring Security (JWT + OAuth2) and JPA.
- `docs/`: Deployment and architecture guides.
