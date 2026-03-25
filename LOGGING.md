# Logging Structure

This application has a comprehensive logging system to help track failures and debug issues easily.

## Log Files Location

All log files are stored in the `logs/` directory:
- **logs/app.log** - General application logs with all messages (INFO, WARNING, ERROR, DEBUG)
- **logs/error.log** - Error-specific logs (ERROR level only)

## Log Format

Each log entry contains:
```
2026-03-25 14:30:45 - module_name - INFO - [filename.py:123] - function_name() - Message
```

### Components:
- **Timestamp** - When the event occurred (`YYYY-MM-DD HH:MM:SS`)
- **Module Name** - Which module/logger generated the log
- **Level** - Log severity (DEBUG, INFO, WARNING, ERROR, CRITICAL)
- **File:Line** - Source file and line number where log was generated
- **Function** - Function name where the log was generated
- **Message** - The actual log message

## Log Levels

- **DEBUG** - Detailed information for debugging (verbose)
- **INFO** - General informational messages (default level)
- **WARNING** - Warning messages
- **ERROR** - Error messages (also written to error.log)
- **CRITICAL** - Critical failures that may stop the application

## Where to Find Issues

### Startup Issues
Check logs when the application starts:
```
2026-03-25 14:30:45 - __main__ - INFO - Starting Peace Coalition Website Backend
2026-03-25 14:30:46 - __main__ - INFO - Flask app initialized. Frontend directory: ...
2026-03-25 14:30:47 - __main__ - INFO - Database configured: sqlite:///war_data.db
```

### API Request Issues
Look for API endpoint logs:
```
2026-03-25 14:31:00 - __main__ - INFO - GET /api/countries - Fetching all countries data
2026-03-25 14:31:01 - __main__ - DEBUG - Retrieved 25 country records
```

### Database Issues
Search for database-related errors:
```
2026-03-25 14:31:15 - __main__ - ERROR - Error initializing database: [database error details]
```

### Scheduled Task Issues
Check for scheduler logs:
```
2026-03-25 00:00:00 - __main__ - INFO - Starting scheduled war data update...
2026-03-25 00:00:05 - __main__ - INFO - ✓ War data update completed successfully
```

## How to View Logs

### In Terminal/Console
```bash
# View all logs
cat logs/app.log

# View recent logs (last 50 lines)
tail -50 logs/app.log

# View errors only
cat logs/error.log

# Follow logs in real-time
tail -f logs/app.log
```

### In VS Code
1. Open the `logs/app.log` file in VS Code
2. Use Ctrl+Shift+F to search for errors or specific function names
3. Use Ctrl+G to jump to specific lines

### Windows PowerShell
```powershell
# View all logs
Get-Content logs/app.log

# View recent logs
Get-Content logs/app.log -Tail 50

# Search for errors
Select-String -Path logs/app.log -Pattern "ERROR"

# Follow logs in real-time
Get-Content logs/app.log -Tail 0 -Wait
```

## Full Traceback for Debugging

When an error occurs, the full Python traceback is included:
```
2026-03-25 14:31:15 - __main__ - ERROR - Error initializing database: connection failed
Traceback (most recent call last):
  File "backend/app.py", line 120, in initialize_data()
    db.create_all()
  File "site-packages/sqlalchemy/...", line 45, in create_all
    ...
```

This helps identify exactly where the error occurred in the code.

## Log Rotation

By default, logs are automatically rotated:
- **app.log** - Rotates when it reaches 10MB (keeps 5 backups)
- **error.log** - Rotates when it reaches 5MB (keeps 3 backups)

Old logs are stored as:
- `app.log.1`, `app.log.2`, etc.

## Common Error Patterns

### Database Connection Failed
```
ERROR - Error initializing database: unable to open database file
```
**Solution:** Check `DATABASE_URL` environment variable and ensure the directory has write permissions.

### API Endpoint Not Working
```
WARNING - API endpoint not found: /api/unknown
```
**Solution:** Check the endpoint URL and ensure the API route is defined in `app.py`.

### Scheduled Task Failed
```
ERROR - Error updating war data: [error details]
```
**Solution:** Check the logs for specific database or data processing errors.

## Environmental Information

The logs include information about the environment:
- Flask environment (development/production)
- Port the server is running on
- Database location
- Scheduler status
- Timezone

## Performance Monitoring

Use logs to monitor performance:
```
INFO - GET /api/global-metrics - Retrieved 30 global metric records
```

If an endpoint is taking too long, check:
1. Database query performance
2. Number of records being processed
3. Filesystem I/O operations

## Tips for Debugging

1. **Start from the error** - Look for ERROR or traceback in the logs
2. **Work backwards** - Trace which function called which
3. **Check timestamps** - Correlate errors with specific times
4. **Look for patterns** - Repeated errors indicate systemic issues
5. **Enable DEBUG level** - Set `FLASK_ENV=development` for more verbose logs

## Example Troubleshooting Session

**Problem:** Frontend not loading

**Step 1:** Check startup logs
```
tail -50 logs/app.log | grep -i "frontend"
```

**Step 2:** Check for file serving errors
```
grep "/" logs/app.log | tail -20
```

**Step 3:** Check for 404 errors
```
grep "404" logs/app.log
```

**Step 4:** Check error log for any issues
```
cat logs/error.log
```

This comprehensive logging system makes it easy to track down exactly what went wrong and where!
