# .env File Setup Instructions

## File Location

Create the `.env` file in the **Backend** directory:

```
D:\Spring\PathForgeSolutions\Backend\.env
```

Or relative path from project root:
```
Backend\.env
```

## File Contents

Copy and paste this into your `.env` file, then fill in your actual values:

```env
# ============================================
# Environment Variables Configuration
# ============================================
# Fill in your actual values below
# DO NOT commit this file to version control!

# ============================================
# Database Configuration
# ============================================
DATABASE_URL=jdbc:postgresql://localhost:5432/mainfolder_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=admin@123

# ============================================
# Email Configuration (Gmail)
# ============================================
# IMPORTANT: Use Gmail App Password, not your regular password!
# See GMAIL-CREDENTIALS-SETUP.md for instructions

# Gmail SMTP Settings
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587

# Your Gmail address (the one sending emails)
MAIL_USERNAME=your-email@gmail.com

# Gmail App Password (16 characters, no spaces)
# Get this from: https://myaccount.google.com/apppasswords
MAIL_PASSWORD=your-16-character-app-password

# Admin email(s) to receive contact form notifications
# For multiple emails, separate with commas: email1@gmail.com,email2@gmail.com
MAIL_ADMIN=admin@example.com

# Optional: Company branding
MAIL_COMPANY_NAME=PathForge Solutions
MAIL_COMPANY_LOGO=

# ============================================
# Server Configuration
# ============================================
PORT=8080
```

## Quick Setup Steps

1. **Navigate to Backend folder:**
   ```
   D:\Spring\PathForgeSolutions\Backend
   ```

2. **Create a new file named `.env`** (with the dot at the beginning)

3. **Copy the template above** and fill in:
   - `MAIL_USERNAME` - Your Gmail address
   - `MAIL_PASSWORD` - Your Gmail App Password (16 characters)
   - `MAIL_ADMIN` - Admin email(s) to receive notifications

4. **Save the file**

5. **Restart your Spring Boot application** for changes to take effect

## Important Notes

- ✅ The `.env` file is already added to `.gitignore` - it won't be committed to version control
- ✅ The application will automatically load the `.env` file on startup
- ✅ Environment variables take precedence over `.env` file values
- ✅ If `.env` file is missing, the application will use defaults from `application.properties`

## Testing

After creating the `.env` file and restarting the application:

1. Check the console output for: `========== .ENV FILE LOADED ==========`
2. Test email configuration: `GET http://localhost:8080/main/contact/test-email`
3. Check logs to verify email configuration is loaded

## Example .env File

Here's a complete example (replace with your actual values):

```env
MAIL_USERNAME=rakshitros1@gmail.com
MAIL_PASSWORD=fqdrlisrhyqyampy
MAIL_ADMIN=rakshitros1@gmail.com,sukanyapatil7875@gmail.com
MAIL_COMPANY_NAME=PathForge Solutions
```

