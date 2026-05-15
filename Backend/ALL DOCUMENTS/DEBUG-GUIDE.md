# Debug Guide for Spring Boot Application

## Quick Debug Commands

### Run with Debug Output Enabled
```bash
cd Backend
mvn spring-boot:run
```

### Run in Debug Mode (Remote Debugging - Port 5005)
```bash
cd Backend
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

Then attach your IDE debugger to `localhost:5005`

### Run with More Verbose Logging
```bash
cd Backend
mvn spring-boot:run -Dlogging.level.com.example.MainFolder=DEBUG
```

## Check Logs

### View Log File in Real-Time (Windows PowerShell)
```powershell
Get-Content Backend\logs\application.log -Wait -Tail 50
```

### View Last 100 Lines
```powershell
Get-Content Backend\logs\application.log -Tail 100
```

### Search Log File
```powershell
Select-String -Path Backend\logs\application.log -Pattern "CONTACT"
```

## Debug Output Locations

1. **Console/Terminal** - `System.out.println()` always appears here
2. **Log File** - `Backend/logs/application.log`
3. **IDE Console** - If running from IntelliJ/Eclipse

## What to Look For

When you submit a contact form, you should see:

```
========== CONTACT CONTROLLER CALLED ==========
Email: [email]
Name: [name]
========== CONTACT SERVICE CALLED ==========
[SERVICE] Validation passed - creating entity
[SERVICE] Attempting to save to database...
[SERVICE] Saved with ID: [number]
========== SUCCESS: Contact inquiry submitted successfully!...
```

If you DON'T see these messages, the request isn't reaching your code.

## Common Issues

### No Debug Output?
- ✅ Check console/terminal where Spring Boot is running
- ✅ Verify application restarted after code changes
- ✅ Check if request is actually reaching `/main/contact` endpoint

### Logs Not Appearing in File?
- ✅ Check console output first (logs go there too)
- ✅ Verify `Backend/logs/application.log` file exists
- ✅ Check file permissions

### Breakpoints Not Working?
- ✅ Make sure you're running in DEBUG mode (not just RUN mode)
- ✅ Verify you set breakpoints on correct lines
- ✅ Check if code is compiled (try Build > Rebuild Project)

## Remove Debug Statements Later

Once you confirm everything works, you can remove the `System.out.println()` statements and keep only the logger statements.
