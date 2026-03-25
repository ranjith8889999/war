# 🚀 Production Deployment Guide

This guide covers deploying the Peace Coalition website to production environments.

## 📋 Pre-Deployment Checklist

- [ ] Backend requirements.txt is complete
- [ ] Frontend build works without errors (`npm run build`)
- [ ] Database backup created
- [ ] Environment variables configured
- [ ] CORS settings updated for production domain
- [ ] API endpoints tested
- [ ] Analytics configured (optional)
- [ ] SSL certificates obtained (HTTPS)

## 🌐 Backend Deployment

### Option 1: Heroku (Recommended for Beginners)

1. **Install Heroku CLI** and login:
```powershell
# Download from https://devcenter.heroku.com/articles/heroku-cli
heroku login
```

2. **Create Procfile in backend:**
```
web: gunicorn app:app
```

3. **Create requirements.txt** (already done):
```
Flask==2.3.0
Flask-CORS==4.0.0
Flask-SQLAlchemy==3.0.5
SQLAlchemy==2.0.0
APScheduler==3.10.1
python-dotenv==1.0.0
gunicorn==20.1.0
```

4. **Create .env for Heroku:**
```
FLASK_ENV=production
DATABASE_URL=postgresql://...  # Use Heroku Postgres if needed
CORS_ORIGINS=https://yourdomain.com
```

5. **Deploy:**
```powershell
cd backend
heroku create peace-coalition-api
git push heroku main
heroku logs --tail  # Monitor logs
```

### Option 2: AWS EC2

1. **Launch EC2 Instance** (Ubuntu 20.04+)

2. **SSH into instance:**
```bash
ssh -i key.pem ubuntu@your-instance-ip
```

3. **Setup Python environment:**
```bash
sudo apt update && sudo apt install python3-pip python3-venv nginx
git clone your-repo-url
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
```

4. **Create systemd service** (`/etc/systemd/system/peace-coalition.service`):
```ini
[Unit]
Description=Peace Coalition API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/war1/backend
Environment="PATH=/home/ubuntu/war1/backend/venv/bin"
ExecStart=/home/ubuntu/war1/backend/venv/bin/gunicorn app:app -w 4 -b 0.0.0.0:5000
Restart=always

[Install]
WantedBy=multi-user.target
```

5. **Start service:**
```bash
sudo systemctl enable peace-coalition
sudo systemctl start peace-coalition
```

6. **Configure Nginx reverse proxy** (`/etc/nginx/sites-available/peace-coalition`):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

7. **Enable and restart Nginx:**
```bash
sudo ln -s /etc/nginx/sites-available/peace-coalition /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 3: DigitalOcean App Platform

1. **Connect Git repository** to DigitalOcean
2. **Create new App** from DigitalOcean Dashboard
3. **Configure**:
   - Add `backend` directory as service
   - Set Python as runtime
   - Add environment variables
4. **Deploy** - DigitalOcean handles everything

## 🎨 Frontend Deployment

### Option 1: Netlify

1. **Build frontend:**
```powershell
cd frontend
npm run build
```

2. **Connect to Netlify:**
   - Go to netlify.com and login
   - Click "New site from Git"
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Public directory: `dist`

3. **Configure environment:**
   - Add environment variables in Netlify Dashboard
   - Set API URL to your backend domain

4. **Custom domain:**
   - In Netlify Dashboard → Domain settings
   - Update to yourdomain.com

### Option 2: Vercel

1. **Build frontend:**
```powershell
npm run build
```

2. **Deploy to Vercel:**
```powershell
npm i -g vercel
vercel
# Follow prompts, connect Git repo
```

3. **Configure API URL** in environment variables

### Option 3: AWS S3 + CloudFront

1. **Build frontend:**
```powershell
npm run build
```

2. **Upload to S3:**
```powershell
aws s3 cp dist s3://your-bucket-name --recursive
```

3. **Setup CloudFront** distribution for CDN

## 🔒 SSL/HTTPS Setup

### Certbot (Free SSL via Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
sudo certbot renew --dry-run  # Test auto-renewal
```

### Update Nginx:
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # Rest of config...
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## 🗄️ Database Management

### PostgreSQL (Production Recommended)

1. **Heroku Postgres:**
```powershell
heroku addons:create heroku-postgresql:standard-0 -a peace-coalition-api
heroku config -a peace-coalition-api  # Get DATABASE_URL
```

2. **AWS RDS:**
   - Create RDS instance
   - Note connection string
   - Add to environment variables

3. **DigitalOcean Managed Database:**
   - Create from control panel
   - Connection details in environment

### Backup Routine

```bash
# Backup PostgreSQL
pg_dump DATABASE_URL > backup.sql

# Or for SQLite
cp war_data.db war_data.backup.sql

# Schedule weekly backup with cron
0 2 * * 0 /path/to/backup-script.sh  # Sunday 2 AM
```

## 📊 Environment Variables

### Backend (.env)
```
FLASK_ENV=production
FLASK_APP=app.py
DATABASE_URL=postgresql://user:pass@host:5432/db
CORS_ORIGINS=https://yourdomain.com
SECRET_KEY=your-secret-key-here
UPDATE_SCHEDULE_HOUR=0
UPDATE_SCHEDULE_MINUTE=0
```

### Frontend (.env)
```
VITE_API_URL=https://api.yourdomain.com
VITE_ENVIRONMENT=production
```

## 🔍 Monitoring & Logging

### Backend Logs
```powershell
# Heroku
heroku logs --tail -a peace-coalition-api

# EC2/Linux
tail -f /var/log/peace-coalition.log

# Docker (if using)
docker logs -f container-name
```

### Frontend Monitoring
- Netlify/Vercel built-in analytics
- Google Analytics integration
- Error tracking (Sentry recommended)

### Performance Monitoring
```python
# Add to app.py for Flask logging
import logging
logging.basicConfig(level=logging.INFO)
```

## 🚨 Error Handling & Recovery

### Common Issues & Solutions

**502 Bad Gateway:**
```bash
# Check if backend is running
systemctl status peace-coalition
sudo systemctl restart peace-coalition

# Check logs
sudo tail -f /var/log/syslog
```

**Database Connection Error:**
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

**CORS Issues:**
```python
# Update CORS in app.py
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com"],
        "methods": ["GET", "POST"],
    }
})
```

## 📈 Performance Optimization

### Backend
```python
# Enable caching
from flask_caching import Cache
cache = Cache(app, config={'CACHE_TYPE': 'redis'})

# Add gzip compression
from flask_compress import Compress
Compress(app)
```

### Frontend
```javascript
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Image optimization
import { Image } from 'react-lazy-images';

// Code splitting already handled by Vite
```

### Database
```sql
-- Add indexes for common queries
CREATE INDEX idx_country_date ON CountryData(country, date);
CREATE INDEX idx_date ON GlobalMetrics(date);
```

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit secrets
2. **HTTPS Only**: Force SSL in production
3. **CORS Whitelist**: Restrict to known domains
4. **Input Validation**: Sanitize all user input
5. **Rate Limiting**: Add to backend
```python
from flask_limiter import Limiter
limiter = Limiter(app, key_func=lambda: request.remote_addr)

@app.route('/api/summary')
@limiter.limit("100 per hour")
def get_summary():
    # ...
```

6. **Database Security**: Use strong passwords, backup regularly
7. **API Keys**: Rotate regularly, use environment variables
8. **HTTPS Certificates**: Auto-renew with Certbot

## 📊 Analytics & Monitoring

### Google Analytics
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Sentry (Error Tracking)
```python
import sentry_sdk
sentry_sdk.init("https://key@sentry.io/project-id", traces_sample_rate=1.0)
```

## 🎯 Post-Deployment Tasks

1. **Test all endpoints:**
```bash
curl https://api.yourdomain.com/api/health
curl https://yourdomain.com  # Frontend
```

2. **Verify automatic updates working:**
```bash
# Check scheduler in logs
heroku logs --tail | grep "update"
```

3. **Monitor performance:**
   - Check page load times
   - Monitor API response times
   - Review error logs daily

4. **User testing:**
   - Test on mobile devices
   - Verify all interactive features
   - Check animations performance

5. **Promote awareness:**
   - Share on social media
   - Submit to directories
   - Email stakeholders

## ✅ Deployment Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] SSL certificates active
- [ ] Database backup strategy in place
- [ ] Environment variables configured
- [ ] Automatic updates scheduled
- [ ] Monitoring setup complete
- [ ] Error logging active
- [ ] Performance optimized
- [ ] Security audit passed
- [ ] All tests passing
- [ ] Documentation updated

## 📞 Support & Troubleshooting

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test API endpoints directly
4. Review firewall/networking rules
5. Consult hosting provider documentation

---

**Happy deploying!** 🚀🕊️

For questions or updates to this guide, refer to the main README.md
