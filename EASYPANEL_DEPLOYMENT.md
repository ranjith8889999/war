# EasyPanel Deployment Guide

## Prerequisites
- EasyPanel account with Docker support
- Git repository configured (GitHub)

## Deployment Steps

### 1. Connect Your Git Repository
1. Log in to your EasyPanel dashboard
2. Click "New App" or "Create Application"
3. Select "Docker" as the deployment method
4. Connect your GitHub repository: `https://github.com/ranjith8889999/war`

### 2. Configure Environment Variables
In the EasyPanel environment settings, add:

```
FLASK_ENV=production
PORT=5000
DATABASE_URL=sqlite:///war_data.db
PYTHONUNBUFFERED=1
```

### 3. Deployment Configuration
EasyPanel will automatically:
- Detect `Dockerfile` in the repository root
- Build the Docker image
- Deploy the container

### 4. Verify Deployment
Once deployed, access your application at:
```
https://your-app-domain.easypanel.io
```

### 5. Check Logs
Monitor deployment through EasyPanel's log viewer to ensure:
- ✓ Docker build completes successfully
- ✓ Container starts without errors
- ✓ Health check passes

## Project Structure
```
.
├── Dockerfile              # Docker build configuration
├── docker-compose.yml      # Docker Compose configuration
├── .dockerignore          # Files to exclude from Docker build
├── .env.example           # Environment variables template
├── backend/
│   ├── app.py             # Flask application
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/               # React source code
│   ├── dist/              # Built frontend (created during build)
│   └── package.json       # Node dependencies
└── .gitignore
```

## Key Features
✓ **Multi-stage Docker build** - Optimizes image size
✓ **Environment-based configuration** - Easy customization
✓ **Health checks** - Automatic monitoring
✓ **Production-ready** - Uses gunicorn with proper settings
✓ **Auto-restart** - Container restarts on failure

## Troubleshooting

### Container won't start
1. Check environment variables are set correctly
2. Review logs in EasyPanel dashboard
3. Ensure `PORT` environment variable is set

### Database issues
1. Ensure `backend/instance/` directory exists
2. Check database file has correct permissions
3. Verify `DATABASE_URL` is correctly set

### Frontend not loading
1. Verify frontend build completed (check Docker build logs)
2. Ensure `frontend/dist/` directory exists
3. Check browser console for errors

## Support
For EasyPanel-specific issues, contact their support team.
For application issues, check the logs and ensure all environment variables are properly configured.
