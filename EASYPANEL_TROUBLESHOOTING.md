# EasyPanel Docker Deployment - Troubleshooting Guide

## Quick Deployment Steps

### 1. Access EasyPanel Dashboard
- Log in to your EasyPanel account
- Navigate to "Applications" or "Services"

### 2. Create New Application
- Click **"New App"** or **"Create Application"**
- Select **"Docker"** as deployment method

### 3. Connect GitHub Repository
- **Repository URL**: `https://github.com/ranjith8889999/war`
- **Branch**: `master`
- **Dockerfile**: `./Dockerfile` (should auto-detect)

### 4. Set Environment Variables
Click "Add Environment Variable" and set:
```
FLASK_ENV=production
PORT=5000
CORS_ORIGINS=*
```

### 5. Deploy
Click **"Deploy"** button - EasyPanel will automatically:
- Clone your repository
- Build Docker image
- Start container
- Run health checks

---

## 🔍 Where to Find Errors in EasyPanel

### During Build Phase
**Path**: Dashboard → Your App → **Build Logs**

Look for:
- ❌ `npm ERR!` - Frontend build failed
- ❌ `ERROR: failed to solve` - Docker layer failed
- ❌ `pip install` errors - Python dependency issues

**Fix**: Check the specific error message and see "Common Errors" section below.

### During Runtime (After Build)
**Path**: Dashboard → Your App → **Runtime Logs** (or Container Logs)

Look for:
- ❌ `ERROR` - Application errors
- ❌ `ModuleNotFoundError` - Missing imports
- ❌ `Connection refused` - Port binding issues
- ⚠️ `WARNING` - Non-fatal issues but worth checking

---

## 🐛 Common Deployment Errors & Solutions

### ❌ Error: "npm ERR! 404 Not Found"
**Problem**: Frontend dependencies not found  
**Solution**:
1. Check `frontend/package.json` exists
2. Verify npm version compatibility
3. Clear npm cache and retry

### ❌ Error: "ModuleNotFoundError: No module named 'flask'"
**Problem**: Python dependencies not installed  
**Solution**:
1. Verify `backend/requirements.txt` exists
2. Check all imports are listed
3. Run locally: `pip install -r backend/requirements.txt`

### ❌ Error: "Permission denied" on logs directory
**Problem**: Cannot write logs  
**Solution**: Fixed in updated Dockerfile (auto-creates logs directory)

### ❌ Error: "Cannot find module 'logger_config'"
**Problem**: Import path issue  
**Solution**: logger_config.py should be in `backend/` directory

### ❌ Error: "Address already in use" port 5000
**Problem**: Port conflicts  
**Solution**:
1. EasyPanel automatically manages ports
2. Set `PORT=5000` in environment variables
3. Verify no other services using port 5000

### ❌ Error: "Health check failed"
**Problem**: Container started but /api/health endpoint not responding  
**Solution**:
1. Check app.py has `@app.route('/api/health')`
2. Wait 40+ seconds for startup (health check has 40s grace period)
3. Check logs for application startup errors

---

## ✅ Verifying Successful Deployment

### Step 1: Check Container Status
- EasyPanel Dashboard → Your App
- Status should show: **"Running"** ✅

### Step 2: Test Health Endpoint
```bash
curl https://your-app.easypanel.io/api/health
```
Expected response:
```json
{"status": "ok", "timestamp": "2026-03-25T14:30:45"}
```

### Step 3: Access Frontend
- Open: `https://your-app.easypanel.io/`
- Should show Peace Coalition website UI

### Step 4: Test API Endpoints
```bash
# Test countries endpoint
curl https://your-app.easypanel.io/api/countries

# Test global metrics
curl https://your-app.easypanel.io/api/global-metrics

# Test summary
curl https://your-app.easypanel.io/api/summary
```

### Step 5: Check Logs in EasyPanel
- Go to: Dashboard → Your App → **Runtime Logs**
- Should NOT see any ERROR entries
- Should see startup messages like:
  ```
  ================================================================================
  Starting Peace Coalition Website Backend
  ================================================================================
  ```

---

## 📋 EasyPanel Environment Variables

### Required Variables
```
FLASK_ENV=production
PORT=5000
```

### Optional Variables
```
FLASK_DEBUG=False
CORS_ORIGINS=*
DATABASE_URL=sqlite:///war_data.db
PYTHONUNBUFFERED=1
```

### How to Set in EasyPanel
1. Go to App Settings
2. Scroll to "Environment Variables"
3. Click "Add Environment Variable"
4. Add name and value
5. Click "Deploy" to apply

---

## 🔧 Manual Testing (Before Deploying)

### Test Docker Build Locally
```bash
# Navigate to project
cd c:\Users\Ranjit\Desktop\war\war1

# Build image
docker build -t peace-coalition .

# Check if build succeeds
echo $? # Should print 0 for success
```

### Test Docker Container Locally
```bash
# Run container
docker run -p 5000:5000 peace-coalition

# In another terminal, test endpoint
curl http://localhost:5000/api/health
```

---

## 📊 Expected Startup Output

When container starts, you should see (in Runtime Logs):

```
==========================================
Starting Peace Coalition Website Backend
==========================================
Flask app initialized. Frontend directory: ...
CORS enabled for origins: *
Database configured: sqlite:///war_data.db
APScheduler initialized and started
Starting database initialization...
✓ Database initialized successfully

✓ Backend server starting...
✓ API available at http://localhost:5000
✓ Environment: Production
✓ Logs directory: /app/logs
✓ Scheduler activated - daily updates at 12:00 AM
==========================================
```

---

## 🚨 Emergency Troubleshooting

### App won't start
1. Check **Runtime Logs** for error messages
2. Look for specific error (see Common Errors section)
3. Redeploy with fixed code
4. GitHub repo automatically triggers rebuild

### Database errors
1. Check write permissions on `/app/logs/`
2. Verify SQLite can create files
3. Check available disk space

### Frontend not loading
1. Verify `frontend/dist/` exists
2. Check build logs for npm errors
3. Test locally: `npm run build`

### Logs not updating
1. Check `/app/logs/` directory permissions
2. Verify logger_config.py is imported
3. Check app.py has logging setup

---

## 📞 Support Resources

### EasyPanel Documentation
- Official Docs: https://docs.easypanel.io/
- Docker Support: Check their Docker deployment guide

### GitHub Repository
- Repo: https://github.com/ranjith8889999/war
- All logs are in `logs/` directory locally
- Check git history for recent changes

### Local Development
To test locally before deploying:
```bash
# Activate venv
.\.venv\Scripts\Activate.ps1

# Run backend
python backend/app.py

# Should see startup messages
# Access at http://localhost:5000
```

---

## 📝 Deployment Checklist

Before clicking Deploy in EasyPanel:

- [ ] GitHub repository is public
- [ ] All files committed (`git status` shows nothing)
- [ ] `Dockerfile` is in root directory
- [ ] `frontend/package.json` exists
- [ ] `backend/requirements.txt` exists
- [ ] `backend/app.py` exists
- [ ] `.env.example` shows required variables
- [ ] Environment variables are set in EasyPanel
- [ ] No `.env` file (only `.env.example`)

---

## 🎯 Next Steps

1. **Verify repository**: https://github.com/ranjith8889999/war
2. **Check branch**: Master branch selected
3. **Connect in EasyPanel**: New App → Docker → GitHub
4. **Set variables**: FLASK_ENV, PORT
5. **Deploy**: Click Deploy button
6. **Monitor**: Watch Runtime Logs
7. **Test**: Access health endpoint
8. **Verify**: Check all APIs working

**Estimated deployment time: 5-10 minutes**

---

## 💡 Pro Tips

1. **Live log monitoring**: Leave Runtime Logs open during deployment
2. **Rebuild without code**: Use EasyPanel's "Rebuild" option
3. **Rollback**: EasyPanel keeps image history, can revert if needed
4. **Scale**: Once working, can add replicas/scale instances
5. **Custom domain**: EasyPanel can point custom domain to your app

---

**Last Updated**: March 25, 2026  
**For Issues**: Check logs, then refer to Common Errors section above.
