# 🕊️ Peace Coalition - Global Economic Impact Website

> **Mission**: Promote peace between US, Israel, and Iran to save the global economy through data-driven insights.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-Active-brightgreen.svg)

## 🎯 Overview

Peace Coalition is a sophisticated full-stack web application that visualizes the devastating economic impact of the ongoing conflict. It presents real-time data on how the war between US, Israel, and Iran is harming the global economy and advocates urgently for peace.

**Key Statistics**:
- 📊 Real-time tracking of 50+ countries
- 💰 $1+ Trillion in documented economic losses
- 📉 0.18% daily global GDP slowdown
- ⚠️ 97% closure of Strait of Hormuz

## ✨ Features

### 🏢 Data Analysis
- **Country-by-Country Impact**: Detailed breakdown of economic losses
- **Loss Categories**: Direct war costs, energy shocks, trade disruption
- **Cumulative Tracking**: 30-day and historical loss calculations
- **GDP Impact**: Per-country and global slowdown metrics

### 📊 Visualizations
- **Interactive Bar Charts**: Top 10 most affected countries
- **Timeline Graphs**: Economic trends over time
- **Category Pie Charts**: Loss distribution by impact type
- **Real-time Metrics**: Live impact counters

### ⚙️ Advanced Features
- **Automatic Daily Updates**: Scheduled data refresh at 12:00 AM UTC
- **Advanced Filtering**: Search, sort, and filter by country and category
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Smooth Animations**: Engaging UI with Framer Motion transitions
- **Dark Theme**: Eye-friendly interface with vibrant accent colors

### 📢 Peace Initiative
- **Call-to-Action**: Prominent messaging for peace promotion
- **Social Sharing**: Share data to promote awareness
- **Global Statistics**: Compelling facts about economic impact
- **Urgency Display**: Real-time loss updates emphasizing crisis

## 🏗️ Tech Stack

### Backend
- **Python 3.9+**
- **Flask**: Lightweight web framework
- **SQLAlchemy**: ORM for database operations
- **APScheduler**: Automated daily updates
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: UI library
- **Vite**: Next-generation build tool
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Advanced animations
- **Recharts**: Data visualization
- **Axios**: HTTP client

### Database
- **SQLite**: Lightweight, serverless database

## 🚀 Quick Start

### Local Development

**Backend**:
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate      # Mac/Linux
pip install -r requirements.txt
python app.py
# Server running at http://localhost:5000
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
# Website at http://localhost:3000
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

## 📊 Data Insights

### Top Affected Countries (Daily Loss)
1. **Saudi Arabia**: $1,000M (energy exporter paradox)
2. **USA**: $1,000M (military expenditure)
3. **South Korea**: $892M (73% oil from Gulf)
4. **Germany**: $742M (industrial slowdown)
5. **India**: $685M (2.6% GDP energy deficit)
6. **Israel**: $414M (defense spending surge)
7. **UK**: $580M (inflation shock)
8. **Egypt**: $550M (+$6.8B annual import)
9. **France**: $420M (industrial impact)
10. **Pakistan**: $320M (energy-dependent)

### Global Impact
- **Daily Global Loss**: $6,500+ Million
- **Monthly Loss**: $195,000+ Million
- **GDP Slowdown**: 0.18% per day
- **Trade Disruption**: $2.4B+ per day at Strait of Hormuz

## 📈 API Documentation

### Endpoints
- `GET /api/health` - System health check
- `GET /api/summary` - Summary statistics
- `GET /api/countries` - All country data
- `GET /api/countries/<name>` - Specific country details
- `GET /api/global-metrics` - Global metrics
- `GET /api/chart-data?type=...` - Chart data

## 🎨 UI Components

### Pages
- **Dashboard**: Overview with key metrics
- **Country Browser**: Filterable, searchable country details
- **Charts**: Interactive visualizations
- **Peace Message**: Call-to-action banner

### Design Elements
- Gradient overlays (red to orange)
- Animated counters
- Smooth page transitions
- Responsive grid layouts
- Dark theme with accent colors

## 🔄 Automatic Updates

Data automatically updates daily:
- **Recurrence**: Every day at 12:00 AM UTC
- **Process**: Calculates new daily losses and cumulative totals
- **Duration**: Runs silently in background
- **Configuration**: Edit cron expression in `backend/app.py`

## 🎯 Key Messages

### Homepage
> "The ongoing conflict is devastating the world economy. Every day costs billions. US, Israel, and Iran **must negotiate peace immediately** to save the global economy."

### Impact Messaging
- Direct economic losses
- Energy market disruption
- Trade route closures
- GDP slowdown statistics
- Urgency for resolution

## 📱 Browser Support
- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Mobile browsers: ✅ Responsive design

## 🔐 Security Considerations

- CORS configured for localhost development
- No sensitive API keys stored in frontend
- SQLite database file should be backed up
- Consider password protection for admin endpoints

## 📦 Deployment

### Backend (to Heroku, AWS, etc.)
```bash
# Create Procfile
echo "web: gunicorn app:app" > Procfile
git push heroku main
```

### Frontend (to Netlify, Vercel, etc.)
```bash
npm run build
# Deploy 'dist' folder
```

## 🛠️ Customization

### Add Countries
Edit `COUNTRY_DATA` in `backend/app.py`

### Change Update Schedule
Modify cron expression in scheduler setup

### Customize Theme
Update colors in `frontend/src/App.css` and `tailwind.config.js`

### Add Features
- New chart types in ChartSection
- Additional filters in CountryBrowser
- More detailed country pages

## 🐛 Troubleshooting

**Backend not starting?**
- Ensure Python 3.9+ is installed
- Virtual environment activated
- Port 5000 is available

**Frontend not loading?**
- Check backend is running
- Verify CORS configuration
- Check browser console for errors

**No data?**
- Database will auto-initialize on first run
- Check Flask console for initialization messages

## 📚 References

### Data Sources
- UN ESCWA (Economic losses, trade disruption)
- International Monetary Fund (Inflation/GDP impact)
- BBC/Euronews (Country-specific impacts)
- Reuters / J.P. Morgan (Energy supply data)
- World Trade Organization (Trade impact analysis)

### Technologies
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional countries/regions
- More detailed analytics
- Enhanced visualizations
- Mobile app version
- Multi-language support

## 📜 License

This project is created for the public good to promote awareness and peace.

## 💬 Contact & Support

For questions, suggestions, or reporting issues:
- Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed help
- Review Flask console logs for backend errors
- Check browser console for frontend errors

## 🕊️ Final Message

> **Peace is not just a word. It's our future.**
> 
> Every share of this data brings us closer to peace. Show world leaders the human cost of conflict. Advocate for dialogue. **The world can't afford war.**

---

**Together, we can promote peace and save the global economy.** 🌍💚

**Last Updated**: March 23, 2026  
**Version**: 1.0.0  
**Status**: Active & Growing
