# Peace Coalition Website - Setup & Deployment Guide

## 📋 Overview
This is a full-stack web application promoting peace between US, Israel, and Iran using real-time economic impact data. Built with Python Flask backend and React frontend with Tailwind CSS.

## 🏗️ Project Structure
```
war1/
├── backend/               # Python Flask API server
│   ├── app.py            # Main Flask application
│   ├── requirements.txt   # Python dependencies
│   └── .env.example      # Environment configuration template
│
├── frontend/             # React + Vite frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.jsx       # Main App component
│   │   ├── main.jsx      # React entry point
│   │   └── App.css       # Global styles
│   ├── index.html        # HTML entry point
│   ├── package.json      # Node dependencies
│   ├── vite.config.js    # Vite configuration
│   └── tailwind.config.js # Tailwind CSS config
│
└── war.txt              # Original war impact data
```

## 🚀 Quick Start (Windows)

### Prerequisites
- Python 3.9+ installed
- Node.js 16+ installed
- npm or yarn
- Git (optional)

### Backend Setup

1. **Open PowerShell in backend directory:**
   ```powershell
   cd backend
   ```

2. **Create virtual environment:**
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```powershell
   Copy-Item .env.example .env
   # Edit .env if needed
   ```

5. **Run backend server:**
   ```powershell
   python app.py
   ```
   Server will start at `http://localhost:5000`

### Frontend Setup

1. **Open new PowerShell in frontend directory:**
   ```powershell
   cd frontend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Start development server:**
   ```powershell
   npm run dev
   ```
   Website will open at `http://localhost:3000`

## 🎯 Features

### Data Dashboard
- **Real-time Impact Analysis**: Daily loss calculations for 50+ countries
- **Economic Metrics**: GDP slowdown percentages, cumulative losses, trend analysis
- **Automatic Updates**: Scheduler runs daily at 12:00 AM UTC

### Interactive Components
- **Country Browser**: Filter, search, and sort countries by impact
- **Visual Charts**: 
  - Bar charts for top affected countries
  - Line charts for timeline trends
  - Pie charts for category breakdown
- **Peace Call-to-Action**: Prominent messaging for peace promotion
- **Animations**: Smooth transitions and engaging UI interactions

### Data Categories
1. **Direct War Impact**: US, Israel, Iran military/economic costs
2. **Energy Importers**: Vulnerable to oil price shocks (South Korea, Germany, India, etc.)
3. **Energy Exporters**: Complex mix of gains and losses (Saudi Arabia, UAE, Qatar, etc.)
4. **Other Impacts**: Egypt, UK, France, Pakistan, Bangladesh, Sri Lanka, etc.

## 📊 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/summary` - Overall impact summary
- `GET /api/countries` - All country data (latest)
- `GET /api/countries/<country_name>` - Specific country time series
- `GET /api/global-metrics` - Global economy metrics
- `GET /api/chart-data?type=by_country|timeline|by_category` - Chart data
- `GET /api/peace-message` - Peace initiative messaging

### Example Response (/api/summary)
```json
{
  "date": "2026-03-23T12:00:00",
  "total_daily_loss": 6500,
  "total_cumulative_loss": 195000,
  "average_gdp_slowdown": 0.18,
  "top_affected_countries": [...],
  "total_countries": 50
}
```

## 🔄 Daily Automatic Updates

The backend includes APScheduler that automatically updates data daily:
- **Trigger**: Every day at 12:00 AM UTC
- **Process**: Updates cumulative losses and trend data
- **Data Source**: Calculated from base loss rates in database

To change schedule, modify in `app.py`:
```python
scheduler.add_job(
    func=update_war_data,
    trigger='cron',
    hour=0,
    minute=0,
    # Modify hour and minute as needed
)
```

## 🎨 UI Framework & Libraries

### Frontend Stack
- **React 18**: UI library
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Chart.js + Recharts**: Data visualization
- **Lucide React**: Icon library
- **Axios**: HTTP client

### Design Features
- **Dark Theme**: Slate-based color scheme
- **Gradient Effects**: Red/orange gradients for urgency
- **Animations**: 
  - Fade-in on scroll
  - Hover scale effects
  - Spinning/pulsing elements
  - Timeline animations
- **Responsive Design**: Mobile, tablet, desktop optimization

## 🗄️ Database

### Schema
Two main tables in SQLite:

**CountryData**
- country: String
- date: DateTime
- daily_loss: Float (USD millions)
- cumulative_loss: Float (USD millions)
- gdp_slowdown_percent: Float
- energy_impact: String (description)
- category: String (Direct War, Energy Importer, Energy Exporter)

**GlobalMetrics**
- date: DateTime
- global_daily_loss: Float
- global_gdp_slowdown: Float (percentage)
- trade_loss: Float
- oil_price: Float (per barrel)
- strait_closure_percent: Float

### Initialize Data
Data automatically initializes on first run from hardcoded config in app.py. Modify the `COUNTRY_DATA` dictionary to update base values.

## 📈 Customization

### Add New Countries
Edit `COUNTRY_DATA` in `backend/app.py`:
```python
COUNTRY_DATA = {
    'energy_importers': {
        'My Country': {
            'daily_loss': 500,
            'category': 'Energy Importer',
            'energy_impact': 'Description here'
        }
    }
}
```

### Change Color Scheme
Edit `COLORS` in `frontend/src/components/ChartSection.jsx` or update Tailwind config.

### Modify Update Schedule
Change the cron schedule in `backend/app.py`:
```python
scheduler.add_job(..., hour=18, minute=30)  # 6:30 PM
```

## 🚢 Deployment

### Backend Deployment (Heroku example)
```powershell
# Create Procfile
"web: gunicorn app:app" | Out-File Procfile -Encoding ASCII

# Deploy
heroku login
heroku create your-app-name
git push heroku main
```

### Frontend Deployment (Netlify example)
```powershell
npm run build
# Deploy 'dist' folder to Netlify
```

### Environment Variables for Production
Backend:
- Set `FLASK_ENV=production`
- Set appropriate `CORS_ORIGINS`
- Use production database

Frontend:
- Update API URLs to production backend
- Build for optimization: `npm run build`

## 🛠️ Troubleshooting

### Backend won't start
```powershell
# Check Python version
python --version

# Ensure virtual environment is activated
.\venv\Scripts\Activate.ps1

# Check port 5000 is available
netstat -ano | findstr :5000
```

### Frontend not connecting to backend
- Ensure backend is running on port 5000
- Check CORS settings in `app.py`
- Verify API URL in frontend components

### No data appearing
- Check database file exists: `backend/war_data.db`
- Verify Flask console shows successful initialization
- Check browser console for API errors

## 📝 License
This project is created for promoting global peace and economic awareness.

## 🤝 Contributing
To add features or improve the application, modify the appropriate files and test thoroughly before deployment.

## 📞 Support
For issues or questions, check the API logs and browser console for debugging information.

---

**Mission**: Promote peace between US, Israel, and Iran to save the global economy. 🕊️
