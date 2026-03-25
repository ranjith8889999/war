#!/bin/sh
# Docker startup script for Peace Coalition Website

# Create logs directory if it doesn't exist
mkdir -p /app/logs
chmod 777 /app/logs

# Log startup info
echo "=========================================="
echo "Starting Peace Coalition Website"
echo "=========================================="
echo "Python: $(python --version)"
echo "Flask Environment: $FLASK_ENV"
echo "Port: $PORT"
echo "Working Directory: $(pwd)"
echo "=========================================="

# Run the application
exec python -u backend/app.py
