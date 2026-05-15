# Gmail Credentials Setup Guide

This guide will walk you through the steps to obtain Gmail credentials for sending emails from your Spring Boot application.

## Prerequisites
- A Gmail account
- Access to your Google Account settings

---

## Step-by-Step Instructions

### Step 1: Enable 2-Step Verification

Gmail requires 2-Step Verification to be enabled before you can generate an App Password.

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Sign in with your Gmail account
3. Under **"Signing in to Google"**, find **"2-Step Verification"**
4. Click on **"2-Step Verification"**
5. Click **"Get Started"** and follow the prompts to enable it
   - You'll need to verify your phone number
   - You may need to enter a verification code sent to your phone

### Step 2: Generate an App Password

Once 2-Step Verification is enabled, you can generate an App Password:

1. Go back to [Google Account Security](https://myaccount.google.com/security)
2. Under **"Signing in to Google"**, find **"App passwords"**
   - If you don't see "App passwords", make sure 2-Step Verification is enabled
3. Click on **"App passwords"**
4. You may be asked to sign in again
5. Select **"Mail"** as the app type
6. Select **"Other (Custom name)"** as the device type
7. Enter a name like **"PathForge Solutions Email Service"** or **"Spring Boot App"**
8. Click **"Generate"**
9. **IMPORTANT**: Copy the 16-character password that appears (it will look like: `abcd efgh ijkl mnop`)
   - This password will only be shown once, so save it immediately!
   - Remove any spaces when using it (it should be 16 characters without spaces)

### Step 3: Configure Your Application

You have two options to configure the Gmail credentials:

#### Option A: Environment Variables (Recommended for Production)

Set these environment variables:

```bash
# Windows PowerShell
$env:MAIL_USERNAME="your-email@gmail.com"
$env:MAIL_PASSWORD="your-16-character-app-password"
$env:MAIL_ADMIN="admin-email@gmail.com"

# Windows Command Prompt
set MAIL_USERNAME=your-email@gmail.com
set MAIL_PASSWORD=your-16-character-app-password
set MAIL_ADMIN=admin-email@gmail.com

# Linux/Mac
export MAIL_USERNAME="your-email@gmail.com"
export MAIL_PASSWORD="your-16-character-app-password"
export MAIL_ADMIN="admin-email@gmail.com"
```

#### Option B: Update application.properties (For Local Development Only)

**⚠️ WARNING: Never commit credentials to version control!**

Edit `Backend/src/main/resources/application.properties`:

```properties
# Email Settings
spring.mail.username=your-email@gmail.com
spring.mail.password=your-16-character-app-password

# Admin notification email (can be same or different from sender)
mail.notifications.admin=admin-email@gmail.com
```

**Important**: Add `application.properties` to `.gitignore` if it contains credentials, or use `application-local.properties` which should be gitignored.

---

## Configuration Details

### Required Credentials

| Property | Description | Example |
|----------|-------------|---------|
| `MAIL_USERNAME` or `spring.mail.username` | Your Gmail address | `yourname@gmail.com` |
| `MAIL_PASSWORD` or `spring.mail.password` | 16-character App Password (not your regular password) | `abcdefghijklmnop` |
| `MAIL_ADMIN` or `mail.notifications.admin` | Email address(es) to receive notifications (comma-separated for multiple) | `admin@example.com` or `admin1@example.com,admin2@example.com` |

### Current Configuration in application.properties

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME:}
spring.mail.password=${MAIL_PASSWORD:}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

mail.notifications.admin=${MAIL_ADMIN:}
```

---

## Testing Your Configuration

1. Start your Spring Boot application
2. Submit a contact form through your application
3. Check the admin email address for the notification
4. Check application logs for any email-related errors

### Common Issues and Solutions

#### Issue: "Username and Password not accepted"
- **Solution**: Make sure you're using the App Password (16 characters), not your regular Gmail password
- **Solution**: Verify 2-Step Verification is enabled
- **Solution**: Check that there are no spaces in the App Password

#### Issue: "Less secure app access" error
- **Solution**: This shouldn't occur with App Passwords. If it does, ensure you're using an App Password, not your regular password

#### Issue: "Connection timeout"
- **Solution**: Check your firewall/network settings
- **Solution**: Verify port 587 is not blocked
- **Solution**: Try using port 465 with SSL instead (requires different configuration)

#### Issue: Emails not being received
- **Solution**: Check spam/junk folder
- **Solution**: Verify `mail.notifications.admin` is set correctly
- **Solution**: Check application logs for email sending errors

---

## Security Best Practices

1. ✅ **Use App Passwords** - Never use your regular Gmail password
2. ✅ **Use Environment Variables** - Don't hardcode credentials in properties files
3. ✅ **Gitignore Credentials** - Never commit credentials to version control
4. ✅ **Rotate Passwords** - Regenerate App Passwords periodically
5. ✅ **Limit Access** - Use a dedicated Gmail account for your application if possible

---

## Alternative: Using Gmail with OAuth2 (Advanced)

For production applications, consider using OAuth2 instead of App Passwords:
- More secure
- Better for enterprise applications
- Requires additional setup with Google Cloud Console

For most applications, App Passwords are sufficient and easier to set up.

---

## Quick Reference

**Gmail SMTP Settings:**
- Host: `smtp.gmail.com`
- Port: `587` (TLS) or `465` (SSL)
- Username: Your Gmail address
- Password: 16-character App Password

**Where to get App Passwords:**
- https://myaccount.google.com/apppasswords

**Where to enable 2-Step Verification:**
- https://myaccount.google.com/security

---

## Need Help?

If you encounter issues:
1. Check the application logs in `Backend/logs/application.log`
2. Verify all environment variables are set correctly
3. Test the SMTP connection using a simple email client first
4. Ensure your Gmail account is not locked or restricted

