"""
Peace Coalition Website Backend
Promoting peace between US, Israel, and Iran using data-driven insights
"""

import os
import json
import logging
import logging.config
from datetime import datetime, timedelta
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
import sqlite3
from dotenv import load_dotenv
from logger_config import LogConfig, setup_logger

# Load environment variables
load_dotenv()

# Setup logging
logging.config.dictConfig(LogConfig.LOGGING_CONFIG)
logger = setup_logger(__name__)

logger.info("=" * 80)
logger.info("Starting Peace Coalition Website Backend")
logger.info("=" * 80)

# Initialize Flask app
frontend_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist')
app = Flask(__name__, static_folder=frontend_dir, static_url_path='')
logger.info(f"Flask app initialized. Frontend directory: {frontend_dir}")

# CORS configuration
cors_origins = os.getenv('CORS_ORIGINS', '*')
CORS(app, resources={r"/api/*": {"origins": cors_origins.split(',') if cors_origins != '*' else '*'}})
logger.info(f"CORS enabled for origins: {cors_origins}")

# Database configuration
database_url = os.getenv('DATABASE_URL', 'sqlite:///war_data.db')
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Secret key for sessions
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

db = SQLAlchemy(app)
logger.info(f"Database configured: {database_url}")

# Scheduler setup
scheduler = BackgroundScheduler()
scheduler.start()
logger.info("APScheduler initialized and started")
atexit.register(lambda: scheduler.shutdown())

# ============================================
# DATABASE MODELS
# ============================================

class CountryData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    country = db.Column(db.String(100), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    daily_loss = db.Column(db.Float, nullable=False)
    cumulative_loss = db.Column(db.Float, nullable=False)
    gdp_slowdown_percent = db.Column(db.Float, nullable=False)
    energy_impact = db.Column(db.String(100))
    category = db.Column(db.String(50))  # 'Direct War', 'Energy Importer', 'Energy Exporter'
    
    def to_dict(self):
        return {
            'country': self.country,
            'date': self.date.isoformat(),
            'daily_loss': self.daily_loss,
            'cumulative_loss': self.cumulative_loss,
            'gdp_slowdown_percent': self.gdp_slowdown_percent,
            'energy_impact': self.energy_impact,
            'category': self.category
        }

class GlobalMetrics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    global_daily_loss = db.Column(db.Float, nullable=False)
    global_gdp_slowdown = db.Column(db.Float, nullable=False)
    trade_loss = db.Column(db.Float, nullable=False)
    oil_price = db.Column(db.Float, nullable=False)
    strait_closure_percent = db.Column(db.Float, nullable=False)
    
    def to_dict(self):
        return {
            'date': self.date.isoformat(),
            'global_daily_loss': self.global_daily_loss,
            'global_gdp_slowdown': self.global_gdp_slowdown,
            'trade_loss': self.trade_loss,
            'oil_price': self.oil_price,
            'strait_closure_percent': self.strait_closure_percent
        }

# ============================================
# DATA INITIALIZATION
# ============================================

COUNTRY_DATA = {
    'direct_war': {
        'Israel': {'daily_loss': 414, 'category': 'Direct War'},
        'USA': {'daily_loss': 1000, 'category': 'Direct War'},
        'Iran': {'daily_loss': 300, 'category': 'Direct War'},
    },
    'energy_exporters': {
        'Saudi Arabia': {'daily_loss': 1000, 'category': 'Energy Exporter', 'energy_impact': '+19.1% GDP from oil prices'},
        'UAE': {'daily_loss': 350, 'category': 'Energy Exporter', 'energy_impact': 'High revenue gains'},
        'Qatar': {'daily_loss': 300, 'category': 'Energy Exporter', 'energy_impact': '17% LNG capacity loss'},
        'Kuwait': {'daily_loss': 200, 'category': 'Energy Exporter', 'energy_impact': 'Export constrained'},
        'Oman': {'daily_loss': 150, 'category': 'Energy Exporter', 'energy_impact': 'Refinancing risks'},
        'Iraq': {'daily_loss': 300, 'category': 'Energy Exporter', 'energy_impact': 'Critical exporter'},
    },
    'energy_importers': {
        'South Korea': {'daily_loss': 892, 'category': 'Energy Importer', 'energy_impact': '73% from Gulf - CRITICAL'},
        'Germany': {'daily_loss': 742, 'category': 'Energy Importer', 'energy_impact': '1.5% GDP energy deficit'},
        'India': {'daily_loss': 685, 'category': 'Energy Importer', 'energy_impact': '2.6% GDP energy deficit'},
        'UK': {'daily_loss': 580, 'category': 'Energy Importer', 'energy_impact': '+0.5% inflation expected'},
        'Egypt': {'daily_loss': 550, 'category': 'Energy Importer', 'energy_impact': '+$6.8B annual import'},
        'France': {'daily_loss': 420, 'category': 'Energy Importer', 'energy_impact': 'Industrial slowdown'},
        'Bangladesh': {'daily_loss': 245, 'category': 'Energy Importer', 'energy_impact': 'High vulnerability'},
        'Pakistan': {'daily_loss': 320, 'category': 'Energy Importer', 'energy_impact': 'Energy-dependent'},
        'Sri Lanka': {'daily_loss': 125, 'category': 'Energy Importer', 'energy_impact': 'Economic pressure'},
    },
    'exporters_winners': {
        'Norway': {'daily_loss': -250, 'category': 'Energy Exporter', 'energy_impact': '+19.1% GDP surplus - WINNER'},
    }
}

def initialize_data():
    """Initialize database with war impact data"""
    try:
        logger.info("Starting database initialization...")
        # Check if data already exists
        if CountryData.query.first():
            logger.info("Database already initialized with data, skipping initialization")
            return
        
        logger.info("Database is empty, initializing with war impact data...")
        today = datetime.now()
        cumulative_loss = 0
        
        # Add country-specific data
        all_countries_combined = {}
        for category, countries in COUNTRY_DATA.items():
            all_countries_combined.update(countries)
        
        logger.info(f"Preparing to insert data for {len(all_countries_combined)} countries")
        
        for country, data in all_countries_combined.items():
            daily_loss = data['daily_loss']
            cumulative_loss = daily_loss * 30  # 30 days of losses
            
            # Calculate GDP slowdown
            if 'Energy Importer' in data['category']:
                gdp_slowdown = 0.15  # 0.15% per day for importers
            elif 'Energy Exporter' in data['category']:
                gdp_slowdown = 0.05  # 0.05% gain per day for exporters
            else:
                gdp_slowdown = 0.3  # 0.3% per day for direct war countries
            
            record = CountryData(
                country=country,
                date=today,
                daily_loss=daily_loss,
                cumulative_loss=cumulative_loss,
                gdp_slowdown_percent=gdp_slowdown,
                energy_impact=data.get('energy_impact', ''),
                category=data['category']
            )
            db.session.add(record)
            logger.debug(f"Added {country} ({data['category']}): ${daily_loss}M daily loss")
        
        # Add global metrics
        total_daily_loss = sum([data['daily_loss'] for data in all_countries_combined.values() if data['daily_loss'] > 0])
        
        global_metric = GlobalMetrics(
            date=today,
            global_daily_loss=total_daily_loss,
            global_gdp_slowdown=0.18,  # 0.18% global GDP slowdown per day
            trade_loss=340,  # $340 million in trade losses per day
            oil_price=120,  # $120/barrel
            strait_closure_percent=97
        )
        db.session.add(global_metric)
        db.session.commit()
        logger.info(f"✓ Database initialized successfully with {len(all_countries_combined)} countries and global metrics")
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}", exc_info=True)
        db.session.rollback()

def update_war_data():
    """Scheduled task to update war data daily"""
    try:
        today = datetime.now()
        logger.info("Starting scheduled war data update...")
        
        # Rebuild all_countries for this function
        all_countries_combined = {}
        for category, countries in COUNTRY_DATA.items():
            all_countries_combined.update(countries)
        
        logger.info(f"Updating war data for {len(all_countries_combined)} countries on {today}")
        
        # Update each country's data
        for country_name, country_data in all_countries_combined.items():
            daily_loss = country_data['daily_loss']
            
            # Get previous cumulative loss
            last_record = CountryData.query.filter_by(country=country_name).order_by(
                CountryData.date.desc()
            ).first()
            
            if last_record:
                cumulative_loss = last_record.cumulative_loss + daily_loss
            else:
                cumulative_loss = daily_loss
            
            record = CountryData(
                country=country_name,
                date=today,
                daily_loss=daily_loss,
                cumulative_loss=cumulative_loss,
                gdp_slowdown_percent=country_data.get('gdp_slowdown', 0.15),
                energy_impact=country_data.get('energy_impact', ''),
                category=country_data['category']
            )
            db.session.add(record)
            logger.debug(f"Updated {country_name}: cumulative loss ${cumulative_loss:.2f}M")
        
        # Update global metrics
        total_daily_loss = sum([data['daily_loss'] for data in all_countries_combined.values() if data['daily_loss'] > 0])
        
        global_metric = GlobalMetrics(
            date=today,
            global_daily_loss=total_daily_loss,
            global_gdp_slowdown=0.18,
            trade_loss=340,
            oil_price=120 + (0.5 * (today - datetime.now()).days),  # Oil price trend
            strait_closure_percent=97
        )
        db.session.add(global_metric)
        db.session.commit()
        logger.info(f"✓ War data update completed successfully on {today}")
    except Exception as e:
        logger.error(f"Error updating war data: {str(e)}", exc_info=True)
        db.session.rollback()

# ============================================
# API ENDPOINTS
# ============================================

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    logger.info("Health check requested")
    response = {'status': 'ok', 'timestamp': datetime.now().isoformat()}
    logger.debug(f"Health check response: {response}")
    return jsonify(response)

@app.route('/api/countries', methods=['GET'])
def get_countries():
    """Get all countries and their latest data"""
    try:
        logger.info("GET /api/countries - Fetching all countries data")
        countries = CountryData.query.all()
        logger.debug(f"Retrieved {len(countries)} country records")
        return jsonify([country.to_dict() for country in countries])
    except Exception as e:
        logger.error(f"Error fetching countries: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/api/countries/<country_name>', methods=['GET'])
def get_country_data(country_name):
    """Get time series data for a specific country"""
    try:
        logger.info(f"GET /api/countries/{country_name} - Fetching time series data")
        records = CountryData.query.filter_by(country=country_name).order_by(
            CountryData.date
        ).all()
        logger.debug(f"Retrieved {len(records)} records for {country_name}")
        return jsonify([record.to_dict() for record in records])
    except Exception as e:
        logger.error(f"Error fetching country data for {country_name}: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/api/global-metrics', methods=['GET'])
def get_global_metrics():
    """Get global economic impact metrics"""
    try:
        logger.info("GET /api/global-metrics - Fetching global metrics")
        metrics = GlobalMetrics.query.order_by(GlobalMetrics.date.desc()).limit(30).all()
        logger.debug(f"Retrieved {len(metrics)} global metric records")
        return jsonify([metric.to_dict() for metric in reversed(metrics)])
    except Exception as e:
        logger.error(f"Error fetching global metrics: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/api/summary', methods=['GET'])
def get_summary():
    """Get summary statistics"""
    try:
        logger.info("GET /api/summary - Fetching summary statistics")
        latest_date = db.session.query(db.func.max(CountryData.date)).scalar()
        
        if not latest_date:
            logger.warning("No data available for summary")
            return jsonify({'error': 'No data available'}), 404
        
        logger.debug(f"Latest data date: {latest_date}")
        countries = CountryData.query.filter_by(date=latest_date).all()
        logger.debug(f"Retrieved {len(countries)} countries for summary")
        
        total_daily_loss = sum(c.daily_loss for c in countries if c.daily_loss > 0)
        total_cumulative = sum(c.cumulative_loss for c in countries)
        avg_gdp_slowdown = sum(c.gdp_slowdown_percent for c in countries) / len(countries) if countries else 0
        
        # Sort countries by loss
        sorted_countries = sorted([c.to_dict() for c in countries], 
                                 key=lambda x: x['daily_loss'], reverse=True)
        
        response = {
            'date': latest_date.isoformat(),
            'total_daily_loss': total_daily_loss,
            'total_cumulative_loss': total_cumulative,
            'average_gdp_slowdown': avg_gdp_slowdown,
            'top_affected_countries': sorted_countries[:10],
            'total_countries': len(countries)
        }
        logger.info(f"Summary generated: Total daily loss ${total_daily_loss:.2f}M")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error generating summary: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/api/chart-data', methods=['GET'])
def get_chart_data():
    """Get data formatted for charts"""
    try:
        chart_type = request.args.get('type', 'by_country')
        logger.info(f"GET /api/chart-data - Chart type: {chart_type}")
        
        if chart_type == 'by_country':
            latest_date = db.session.query(db.func.max(CountryData.date)).scalar()
            countries = CountryData.query.filter_by(date=latest_date).all()
            logger.debug(f"Retrieved {len(countries)} countries for chart data")
            
            labels = [c.country for c in countries]
            data = [c.daily_loss for c in countries]
            colors = ['#ef4444' if c.daily_loss > 500 else '#f97316' if c.daily_loss > 200 else '#eab308' 
                     for c in countries]
            
            return jsonify({
                'labels': labels,
                'data': data,
                'colors': colors
            })
        
        elif chart_type == 'timeline':
            metrics = GlobalMetrics.query.order_by(GlobalMetrics.date).all()
            logger.debug(f"Retrieved {len(metrics)} timeline metrics")
            dates = [m.date.strftime('%Y-%m-%d') for m in metrics]
            losses = [m.global_daily_loss for m in metrics]
            gdp_slowdown = [m.global_gdp_slowdown for m in metrics]
            
            return jsonify({
                'dates': dates,
                'daily_losses': losses,
                'gdp_slowdown': gdp_slowdown
            })
        
        elif chart_type == 'by_category':
            latest_date = db.session.query(db.func.max(CountryData.date)).scalar()
            countries = CountryData.query.filter_by(date=latest_date).all()
            logger.debug(f"Retrieved {len(countries)} countries for category breakdown")
            
            categories = {}
            for country in countries:
                cat = country.category
                if cat not in categories:
                    categories[cat] = 0
                categories[cat] += country.daily_loss
            
            logger.debug(f"Category breakdown: {categories}")
            return jsonify({
                'labels': list(categories.keys()),
                'data': list(categories.values())
            })
        
    except Exception as e:
        logger.error(f"Error generating chart data: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/api/peace-message', methods=['GET'])
def peace_message():
    """Get peace promotion message with statistics"""
    try:
        logger.info("GET /api/peace-message - Fetching peace message")
        summary = get_summary().get_json()
        
        message = {
            'title': 'Global Peace Initiative - Economic Impact Report',
            'urgent_message': 'The ongoing conflict is causing severe global economic damage.',
            'call_to_action': 'US, Israel, and Iran must negotiate peace immediately!',
            'economic_facts': {
                'daily_global_loss': f"${summary['total_daily_loss']:.0f}M USD",
                'monthly_loss': f"${summary['total_cumulative_loss']/30:.0f}M USD",
                'gdp_impact': f"{summary['average_gdp_slowdown']:.2f}% global slowdown per day",
                'most_affected': summary['top_affected_countries'][0]['country'] if summary['top_affected_countries'] else 'Unknown'
            }
        }
        logger.info("Peace message generated successfully")
        return jsonify(message)
    except Exception as e:
        logger.error(f"Error generating peace message: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

# ============================================
# FRONTEND ROUTES
# ============================================

@app.route('/')
def index():
    """Serve the frontend index.html"""
    logger.info("GET / - Serving frontend index.html")
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files or redirect to index.html for client-side routing"""
    file_path = os.path.join(app.static_folder, path)
    
    # If file exists, serve it
    if os.path.isfile(file_path):
        logger.debug(f"Serving static file: {path}")
        return send_from_directory(app.static_folder, path)
    
    # For all other routes, serve index.html (for React Router)
    logger.debug(f"Route {path} not found, serving index.html for client-side routing")
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(error):
    """Serve index.html for 404s to support client-side routing"""
    # Check if it's an API call
    if request.path.startswith('/api/'):
        logger.warning(f"API endpoint not found: {request.path}")
        return jsonify({'error': 'Endpoint not found'}), 404
    # For non-API routes, serve the frontend
    logger.debug(f"404 on {request.path}, serving frontend")
    return send_from_directory(app.static_folder, 'index.html'), 200

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {str(error)}", exc_info=True)
    return jsonify({'error': 'Internal server error'}), 500

# ============================================
# STARTUP
# ============================================

if __name__ == '__main__':
    logger.info("=" * 80)
    logger.info("Initializing application startup...")
    logger.info("=" * 80)
    
    with app.app_context():
        try:
            logger.info("Creating database tables...")
            db.create_all()
            logger.info("✓ Database tables created successfully")
        except Exception as e:
            logger.error(f"Failed to create database tables: {str(e)}", exc_info=True)
            raise
        
        try:
            logger.info("Initializing database data...")
            initialize_data()
            logger.info("✓ Database initialization complete")
        except Exception as e:
            logger.error(f"Failed to initialize database: {str(e)}", exc_info=True)
            raise
        
        # Schedule daily update at 12:00 AM
        try:
            scheduler.add_job(
                func=update_war_data,
                trigger='cron',
                hour=0,
                minute=0,
                id='daily_war_update',
                name='Update war impact data daily',
                replace_existing=True
            )
            logger.info("✓ Scheduled task configured: War data update at 12:00 AM")
        except Exception as e:
            logger.error(f"Failed to configure scheduled task: {str(e)}", exc_info=True)
    
    # Get port from environment or use default
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    
    logger.info("=" * 80)
    logger.info("✓ Backend server starting...")
    logger.info(f"✓ API available at http://localhost:{port}")
    logger.info(f"✓ Environment: {'Development' if debug else 'Production'}")
    logger.info(f"✓ Logs directory: {LogConfig.LOGS_DIR}")
    logger.info("✓ Scheduler activated - daily updates at 12:00 AM")
    logger.info("=" * 80)
    
    app.run(debug=debug, host='0.0.0.0', port=port)
