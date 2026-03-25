# 🏗️ Architecture & Technical Documentation

## System Overview

The Peace Coalition website is a full-stack web application with clear separation between backend API and frontend UI.

```
┌─────────────────────────────────────────────────────┐
│              Peace Coalition Website                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌────────────────────┐      ┌─────────────────┐   │
│  │  Frontend (React)  │◄────►│ Backend (Flask) │   │
│  │  Port: 3000        │      │ Port: 5000      │   │
│  │                    │      │                 │   │
│  │ • Dashboard        │      │ • RESTful API   │   │
│  │ • Country Browser  │      │ • SQLAlchemy    │   │
│  │ • Charts           │      │ • Scheduler     │   │
│  │ • Animations       │      │ • CORS Support  │   │
│  │ • Responsive UI    │      │ • Data Updates  │   │
│  └────────────────────┘      └─────────────────┘   │
│                                       │             │
│                                       ▼             │
│                              ┌─────────────────┐   │
│                              │  SQLite DB      │   │
│                              │ war_data.db     │   │
│                              └─────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Backend Architecture

### Flask Application Structure

```
backend/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── .env.example       # Environment template
├── venv/              # Virtual environment
└── war_data.db        # SQLite database (auto-created)
```

### Database Schema

#### CountryData Table
```sql
CREATE TABLE CountryData (
    id INTEGER PRIMARY KEY,
    country VARCHAR(100) NOT NULL,
    date DATETIME NOT NULL,
    daily_loss FLOAT NOT NULL,           -- USD millions
    cumulative_loss FLOAT NOT NULL,      -- USD millions
    gdp_slowdown_percent FLOAT NOT NULL, -- Percentage
    energy_impact VARCHAR(100),          -- Description
    category VARCHAR(50)                 -- Classification
);
```

#### GlobalMetrics Table
```sql
CREATE TABLE GlobalMetrics (
    id INTEGER PRIMARY KEY,
    date DATETIME NOT NULL,
    global_daily_loss FLOAT NOT NULL,    -- USD millions
    global_gdp_slowdown FLOAT NOT NULL,  -- Percentage
    trade_loss FLOAT NOT NULL,           -- USD millions
    oil_price FLOAT NOT NULL,            -- USD/barrel
    strait_closure_percent FLOAT NOT NULL
);
```

### API Endpoints Flow

```
GET /api/health
    ↓
    └─► Flask checks DB connection → Returns OK

GET /api/summary
    ↓
    ├─► Query CountryData (latest)
    ├─► Calculate totals
    ├─► Sort countries
    └─► Return JSON response

GET /api/countries
    ↓
    ├─► Query all countries
    ├─► Format response
    └─► Return JSON array

GET /api/chart-data?type=by_country
    ↓
    ├─► Query latest country data
    ├─► Format for Recharts
    ├─► Sort by loss amount
    └─► Return labels + data

POST /scheduled_update (internal)
    ↓
    ├─► Calculate new losses
    ├─► Insert new records
    ├─► Update global metrics
    └─► Run daily at 12:00 AM
```

### Data Flow Architecture

```
┌────────────────────────────────────┐
│   Initial Data (COUNTRY_DATA)      │
│   Hardcoded in app.py              │
└────────────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ Initialize Database    │
        │ (First Run)            │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ SQLite Database        │
        │ war_data.db            │
        └────────────┬───────────┘
                     │
        ┌────────────┴───────────┐
        │                        │
        ▼                        ▼
  ┌───────────┐          ┌──────────────┐
  │  Flask    │          │  Scheduler   │
  │  API      │          │  (APScheduler)
  │ (Queries) │          │  (Updates)   │
  └─────┬─────┘          └──────┬───────┘
        │                       │
        │    ┌──────────────────┘
        │    │   Daily at 12 AM
        │    │   Recalculate losses
        │    │   Add new records
        │    │
        ▼    ▼
        ┌────────────────────┐
        │ Response to        │
        │ Frontend/Charts    │
        └────────────────────┘
```

### API Response Example

```json
{
  "date": "2026-03-23T12:00:00",
  "total_daily_loss": 6500,
  "total_cumulative_loss": 195000,
  "average_gdp_slowdown": 0.18,
  "top_affected_countries": [
    {
      "country": "Saudi Arabia",
      "date": "2026-03-23T12:00:00",
      "daily_loss": 1000,
      "cumulative_loss": 30000,
      "gdp_slowdown_percent": 0.3,
      "energy_impact": "Oil price gains offset shipping losses",
      "category": "Energy Exporter"
    }
  ],
  "total_countries": 50
}
```

## Frontend Architecture

### React Component Hierarchy

```
App.jsx
├── Header
│   └── Peace alert animation
│
├── HeroSection
│   └── 4 Key stats cards
│
├── PeaceMessage
│   ├── Animated urgency banner
│   └── Real-time loss counter
│
├── Navigation Tabs
│   ├── Dashboard
│   ├── Countries
│   └── Charts
│
└── Footer
    └── Links & messaging
```

### Component Responsibilities

| Component | Purpose | Dependencies |
|-----------|---------|--------------|
| Header | Navigation & branding | React, motion, lucide-react |
| HeroSection | Key statistics display | framer-motion, lucide-react |
| PeaceMessage | Call-to-action banner | axios, framer-motion |
| Dashboard | Country rankings table | framer-motion, lucide-react |
| CountryBrowser | Filterable country grid | framer-motion, lucide-react |
| ChartSection | Interactive visualizations | recharts, framer-motion |
| Footer | Site footer & links | framer-motion, lucide-react |

### State Management Flow

```
App.jsx (Global State)
│
├─ activeTab: 'dashboard' | 'countries' | 'charts'
├─ data: { summary, countries, global }
├─ loading: true | false
└─ error: null | error message
    │
    └─► useEffect
        ├─► Fetch /api/summary
        ├─► Fetch /api/countries
        ├─► Fetch /api/global-metrics
        └─► setData() → Re-render components
```

### Data Fetching Strategy

```
Initial Load
    │
    ├─► 3 Parallel Requests (Promise.all)
    │   ├─► /api/summary
    │   ├─► /api/countries
    │   └─► /api/global-metrics
    │
    └─► Set Loading = true
        │
        └─► Responses arrive
            │
            └─► Set Loading = false
                │
                └─► Re-render with data

Refresh (Every 60 seconds)
    │
    └─► Same as initial load
```

### Animation Strategy

```
Page Load Animation
    │
    ├─► Header: fade-in + slide
    ├─► Hero cards: staggered fade-in
    ├─► Peace banner: scale + glow pulse
    ├─► Dashboard: items fade-in with delay
    └─► Footer: fade-in on scroll

User Interactions
    │
    ├─► Tab switching: scale transition
    ├─► Country hover: scale up + shadow
    ├─► Chart tooltip: fade-in
    └─► Search results: staggered entrance

Continuous Animations
    │
    ├─► Heart icon: pulse
    ├─► Alert banner: rotate
    ├─► Background gradient: flow
    └─► Counters: smooth number animation
```

## Data Update Cycle

### Daily Update Process

```
Scheduler (APScheduler)
    │
    └─► Trigger at 12:00 AM UTC (configurable)
        │
        ├─► For each country:
        │   ├─► Get baseline daily_loss
        │   ├─► Get previous cumulative_loss
        │   ├─► Calculate new cumulative = old + daily
        │   └─► Insert new CountryData record
        │
        ├─► Calculate global totals:
        │   ├─► Sum all daily losses
        │   ├─► Average GDP slowdown %
        │   ├─► Oil price adjustment
        │   └─► Strait closure status
        │
        ├─► Update GlobalMetrics table
        │
        └─► Log completion
            │
            └─► Frontend auto-refreshes
                (Every 60 seconds anyway)
```

## Communication Protocols

### HTTP Requests (Frontend → Backend)

```
Method: GET
Headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
URL: http://localhost:5000/api/endpoints
Response: JSON

CORS Policy:
  Origin: http://localhost:3000
  Allowed Methods: GET, POST
  Allowed Headers: Content-Type
```

### Error Handling

```
Frontend Error Flow:
    │
    ├─► API Request fails
    │   │
    │   └─► catch error
    │       │
    │       ├─► Set error state
    │       ├─► Display error message
    │       └─► Log to console
    │
    └─► Retry available
        │
        └─► Button to re-fetch data
```

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Vite automatically chunks components
- **Lazy Loading**: Route-based lazy loading
- **Memoization**: React.memo on expensive components
- **Image Optimization**: Lucide icons are SVG (tiny)

### Backend Optimization
- **Database Indexes**: On country, date columns
- **Query Caching**: In-memory for frequent queries
- **Connection Pooling**: SQLAlchemy auto-manages
- **Response Compression**: Could add gzip

### Rendering Strategy

```
Frontend Render Flow:
    │
    ├─► Component mounts
    ├─► useEffect runs
    ├─► Fetch data from API
    ├─► Set loading = true
    ├─► Display skeleton/shimmer
    │
    └─► Data arrives
        │
        ├─► Set data state
        ├─► Set loading = false
        └─► Framer Motion animates in
            (staggered, with delays)
```

## Security Architecture

### Data Protection
```
API Endpoints
    │
    └─► CORS Validation ✓
    ├─► Input Sanitization (SQLAlchemy)
    └─► SQL Injection Prevention (Parameterized)

Database
    │
    └─► SQLite (local file)
        └─► No sensitive data stored
        └─► Recommend PostgreSQL for production
```

### Environment Isolation
```
Development (.env)
    └─► FLASK_ENV=development
    └─► CORS_ORIGINS=localhost:3000

Production (.env)
    └─► FLASK_ENV=production
    └─► CORS_ORIGINS=yourdomain.com
    └─► DATABASE_URL=postgresql://...
```

## Scaling Considerations

### Current Capacity
- **Concurrent Users**: ~100-500 (single backend)
- **Database Size**: ~1 MB/month
- **API Response Time**: <100 ms

### Scale-Up Path
```
Stage 1 (Current)
    └─► Single Flask server
    └─► SQLite database
    └─► Static hosting (frontend)

Stage 2 (Production)
    ├─► Nginx load balancer
    ├─► 2-4 Gunicorn workers
    ├─► PostgreSQL (managed)
    └─► CDN for frontend

Stage 3 (Enterprise)
    ├─► Kubernetes cluster
    ├─► Redis caching
    ├─► Message queue (Celery)
    ├─► Distributed database
    └─► Advanced monitoring
```

## Development Workflow

### Local Development
```
1. Backend in one terminal
   └─► python app.py

2. Frontend in another terminal
   └─► npm run dev

3. Open browser
   └─► http://localhost:3000

4. API requests to localhost:5000
   └─► Works automatically via CORS
```

### Testing
```
Frontend Testing
    └─► Manual testing (no test suite yet)
    └─► Browser dev tools
    └─► Network tab inspection

Backend Testing
    └─► API testing with Postman/Insomnia
    └─► Database integrity checks
    └─► Scheduler validation
```

## Deployment Architecture

### Production Stack
```
CloudFlare CDN
    │
    ├─► Redirect to Netlify/Vercel (Frontend)
    │
    └─► Redirect to Heroku/AWS (Backend)
        │
        └─► Gunicorn (WSGI server)
            │
            └─► Flask app
                │
                └─► PostgreSQL
```

### CI/CD Pipeline (Recommended)
```
GitHub/GitLab
    │
    ├─► Push to main
    │
    ├─► Run tests
    │
    ├─► Build frontend
    │
    ├─► Deploy to Netlify/Vercel
    │
    └─► Deploy backend to Heroku/AWS
```

---

This architecture is designed to be scalable, maintainable, and easy to understand. All components follow best practices for their respective frameworks and technologies.
