# ⚡ Quick Reference Guide

## 🚀 Common Commands

### Backend (Python)

```powershell
# Setup
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Run
python app.py

# Deactivate venv
deactivate

# Install new package
pip install package-name
pip freeze > requirements.txt
```

### Frontend (JavaScript)

```powershell
# Setup
cd frontend
npm install

# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Install new package
npm install package-name
npm install -D dev-package-name
```

### Database

```powershell
# Run Flask shell (if needed)
python
>>> from app import app, db
>>> app.app_context().push()
>>> db.create_all()

# Clear database
rm war_data.db  # Then restart app to reinitialize
```

## 📋 File Locations

| What | Where | Type |
|------|-------|------|
| Backend web server | `backend/app.py` | Python |
| Frontend app | `frontend/src/App.jsx` | React |
| Database | `backend/war_data.db` | SQLite |
| Countries data | `backend/app.py:COUNTRY_DATA` | Python dict |
| Styling | `frontend/src/App.css` | CSS |
| Tailwind config | `frontend/tailwind.config.js` | JS |
| API options | `.env` files | Text |

## 🔧 Quick Edits

### Add a Country

Edit `backend/app.py`, find `COUNTRY_DATA`:

```python
COUNTRY_DATA = {
    'energy_importers': {
        'MyCountry': {
            'daily_loss': 500,
            'category': 'Energy Importer',
            'energy_impact': 'Description here'
        }
    }
}
```

### Change Update Time

Edit `backend/app.py`, find scheduler setup:

```python
scheduler.add_job(
    func=update_war_data,
    trigger='cron',
    hour=2,        # Change this (0-23)
    minute=30,     # Change this (0-59)
    id='daily_war_update',
)
```

### Change Colors

**For glowing effects:**
Edit `frontend/src/App.css`:
```css
--primary: #ef4444;      /* Red */
--secondary: #f97316;    /* Orange */
--accent: #06b6d4;       /* Cyan */
```

**For Tailwind:**
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  slate: { 900: '#0f172a' },
  red: { 500: '#ef4444' },
  // etc
}
```

### Change Port Numbers

**Backend (Flask):**
At bottom of `backend/app.py`:
```python
app.run(debug=True, port=5000)  # Change 5000
```

**Frontend (Vite):**
Edit `frontend/vite.config.js`:
```javascript
server: {
  port: 3000,  // Change this
}
```

Then update API URL in frontend components:
```javascript
axios.get('http://localhost:5000/api/...')
```

## 🐛 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Port already in use | `netstat -ano \| findstr :5000` → kill process |
| Python not found | Add Python to PATH or use full path |
| npm not found | Install Node.js from nodejs.org |
| Database errors | Delete `war_data.db`, restart app |
| CORS errors | Check backend CORS settings |
| Animations lag | Reduce animation in `framer-motion` components |
| No data appearing | Check Flask console for errors |
| Frontend can't connect | Verify backend is running on :5000 |
| Build errors | `npm run build` then check output |

## 📊 API Testing

### Using Postman/Insomnia

```
Endpoint: http://localhost:5000/api/summary
Method: GET
Headers: Content-Type: application/json
Response: JSON with all metrics
```

### Using curl (PowerShell)

```powershell
# Test backend is running
curl http://localhost:5000/api/health

# Get summary
curl http://localhost:5000/api/summary

# Get all countries
curl http://localhost:5000/api/countries
```

## 🎨 Design Tweaks

### Increase Animation Speed

Edit `frontend/src/components/HeroSection.jsx`:
```javascript
animate={{ y: [0, 30, 0] }}
transition={{ duration: 2, repeat: Infinity }}  // Reduce from 2 to 1
```

### Change Theme to Light

In `frontend/index.html`:
```html
<body class="bg-white text-black">  <!-- Change from dark -->
```

Then update all `text-*` and `bg-*` classes.

### Disable Animations (Performance)

In component files, remove `motion.div` and use regular `div`:
```javascript
// Before
<motion.div animate={{ opacity: 1 }}>

// After
<div style={{ opacity: 1 }}>
```

## 📱 Responsive Testing

### Chrome DevTools
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Test at different breakpoints

### Breakpoints in Tailwind
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px

## 🔄 Git Workflow (if using Git)

```bash
git init
git add .
git commit -m "Initial Peace Coalition website"
git branch -M main
git remote add origin https://github.com/your-repo
git push -u origin main
```

## 🚢 Deploy Commands

### Netlify (Frontend)
```bash
npm run build
# Deploy 'dist' folder to Netlify
```

### Heroku (Backend)
```bash
git push heroku main
heroku logs --tail
```

## 📈 Performance Monitoring

### Frontend
- Lighthouse: Chrome DevTools → Lighthouse
- Network tab: See load times
- Performance tab: Recording page load

### Backend
- Check response times in Network tab
- Monitor CPU/RAM in system
- View Flask logs in terminal

## 🎯 Common Tasks

### Update All Dependencies
```powershell
# Backend
pip list --outdated
pip install --upgrade package-name

# Frontend
npm outdated
npm update package-name
```

### Create Production Build
```powershell
# Frontend
cd frontend
npm run build
# Creates 'dist' folder ready to deploy

# Backend
# Already production-ready, just ensure FLASK_ENV=production
```

### Backup Database
```powershell
# Copy database file
copy backend\war_data.db backend\war_data.backup.sql

# Or compress
Compress-Archive backend\war_data.db backup.zip
```

### Reset Data
```powershell
# Delete database (creates new on restart)
cd backend
rm war_data.db

# Or delete and manually recreate:
python
>>> from app import db
>>> db.drop_all()
>>> db.create_all()
```

## 📞 Debug Checklist

When something breaks:

- [ ] Check browser console for errors (F12)
- [ ] Check Flask terminal for error messages
- [ ] Verify both servers are running
- [ ] Check network tab for failed requests
- [ ] Confirm localhost:5000 responds to /api/health
- [ ] Verify .env files are correctly set
- [ ] Check that ports aren't blocked
- [ ] Try hard refresh (Ctrl+Shift+R)
- [ ] Restart both servers
- [ ] Check file permissions if accessing files

## 🎓 Learning Resources

- **Python Flask**: https://flask.palletsprojects.com/
- **React**: https://react.dev/
- **SQLAlchemy**: https://docs.sqlalchemy.org/
- **Tailwind CSS**: https://tailwindcss.com/
- **Framer Motion**: https://www.framer.com/motion/
- **Recharts**: https://recharts.org/

## 💡 Pro Tips

1. **Use VS Code Remote Development** for easier server management
2. **Install Python extension** in VS Code for better debugging
3. **Use Prettier** for auto-formatting JavaScript
4. **Use Black** for auto-formatting Python
5. **Enable Flask debug mode** for hot reloading during development
6. **Use virtual environments** to isolate dependencies
7. **Commit to Git** frequently for version control
8. **Use .gitignore** to exclude venv, node_modules
9. **Monitor logs** with tail/grep for debugging
10. **Test on mobile** early and often

## 🎯 Performance Goals

| Metric | Target |
|--------|--------|
| Page Load | <2s |
| API Response | <100ms |
| First Paint | <1s |
| Lighthouse Score | >90 |
| Mobile Score | >85 |
| Animations | 60 FPS |

---

**Save this guide and reference it during development!** 🚀
