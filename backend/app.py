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
# from apscheduler.schedulers.background import BackgroundScheduler
import atexit
import sqlite3
from dotenv import load_dotenv
from backend.logger_config import LogConfig, setup_logger

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

# Scheduler setup (commented out)
# scheduler = BackgroundScheduler()
# scheduler.start()
# logger.info("APScheduler initialized and started")
# atexit.register(lambda: scheduler.shutdown())

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
# Updated as of April 9, 2026 (Day 41) - Source: war_latest.txt

COUNTRY_DATA = {
    'direct_war': {
        'United States': {
            'daily_loss': 695.5,  # Direct war: $500-891M avg; Oil consumer cost: $290M/day
            'cumulative_war': 31500,  # ~$31.5B direct war losses
            'cumulative_oil': 11800,  # ~$11.8B consumer oil cost
            'cumulative_gas': 0,  # N/A (Net Exporter)
            'daily_war': 695.5,  # $500M - $891M midpoint
            'daily_oil': 290,  # $290M consumer
            'daily_gas': 0,
            'gdp_impact': 'Growth cut to 2.5%',
            'opportunity_cost': 'Cancel all medical debt or fund community college for 10 years',
            'category': 'Direct War',
            'energy_impact': 'Combat costs $500-891M/day; consumer gas prices +33%; Growth cut to 2.5%'
        },
        'Israel': {
            'daily_loss': 435,  # Direct war: $320-550M midpoint
            'cumulative_war': 16200,  # ~$16.2B direct war losses
            'cumulative_oil': 650,  # ~$650M oil costs
            'cumulative_gas': 180,  # ~$180M gas costs
            'daily_war': 435,  # $320M - $550M midpoint
            'daily_oil': 18,
            'daily_gas': 6,
            'gdp_impact': '1.0% Q2 Contraction',
            'opportunity_cost': 'Fund $50B Tel Aviv Metro or tech-capital infrastructure',
            'category': 'Direct War',
            'energy_impact': 'Daily military burn: $320-550M; 1.0% Q2 contraction'
        },
        'Iran': {
            'daily_loss': 460,  # Direct war: $150-200M + stranded oil: $210M + gas: $75M
            'cumulative_war': 22500,  # ~$22.5B damage
            'cumulative_oil': 8400,  # ~$8.4B lost oil revenue
            'cumulative_gas': 2800,  # ~$2.8B lost gas revenue
            'daily_war': 175,  # $150M - $200M midpoint
            'daily_oil': 210,  # $210M stranded
            'daily_gas': 75,
            'gdp_impact': '10%+ Contraction',
            'opportunity_cost': 'Stabilize the Rial or fund domestic food security',
            'category': 'Direct War',
            'energy_impact': '10%+ GDP contraction; food inflation 70%; $210M/day stranded oil'
        },
        'Saudi Arabia': {
            'daily_loss': 562,  # Revenue: $180M + stranded oil: $360M + gas: $22M
            'cumulative_war': 6800,  # ~$6.8B damage/loss
            'cumulative_oil': 13500,  # ~$13.5B food/logistics
            'cumulative_gas': 610,  # ~$610M gas
            'daily_war': 180,
            'daily_oil': 360,  # $360M stranded
            'daily_gas': 22,
            'gdp_impact': '3.0% GDP Contraction',
            'opportunity_cost': 'Vision 2030 flagship projects like NEOM and Mukaab',
            'category': 'Energy Exporter',
            'energy_impact': '3.0% GDP contraction; Vision 2030 projects halted; $360M/day stranded oil'
        },
        'Kuwait': {
            'daily_loss': 296,  # Direct: $12-15M + stranded oil: $275M + gas: $9M
            'cumulative_war': 9800,  # ~$9.8B revenue loss
            'cumulative_oil': 880,  # ~$880M non-oil
            'cumulative_gas': 240,  # ~$240M gas
            'daily_war': 13.5,  # $12-15M midpoint
            'daily_oil': 275,  # $275M stranded
            'daily_gas': 9,
            'gdp_impact': '14.0% GDP Contraction',
            'opportunity_cost': 'Diversify sovereign wealth fund assets',
            'category': 'Energy Exporter',
            'energy_impact': '14.0% GDP contraction; output cut from 3M to 500k bpd'
        },
        'Oman': {
            'daily_loss': 65,  # Direct: $4-6M + stranded oil: $55M + gas: $5M
            'cumulative_war': 1900,  # ~$1.9B
            'cumulative_oil': 640,  # ~$640M
            'cumulative_gas': 160,  # ~$160M
            'daily_war': 5,  # $4-6M midpoint
            'daily_oil': 55,  # $55M stranded
            'daily_gas': 5,
            'gdp_impact': '1.8% Growth Downgrade',
            'opportunity_cost': 'Green hydrogen and digital tax infrastructure',
            'category': 'Energy Exporter',
            'energy_impact': '1.8% growth downgrade; Green hydrogen projects delayed'
        },
    },
    'energy_importers': {
        'India': {
            'daily_loss': 265,  # Oil: $220M + Gas: $45M
            'cumulative_war': 7400,  # ~$7.4B CAD
            'cumulative_oil': 8100,  # ~$8.1B import bill
            'cumulative_gas': 2100,  # ~$2.1B gas
            'daily_war': 0,
            'daily_oil': 220,
            'daily_gas': 45,
            'gdp_impact': 'Growth cut to 5.9%',
            'opportunity_cost': 'IMEC corridor and "Atmanirbhar" infrastructure',
            'category': 'Energy Importer',
            'energy_impact': '55% oil from Middle East; 9.3M workers in Gulf; Growth cut to 5.9%'
        },
        'Germany': {
            'daily_loss': 250,  # Oil: $115M + Gas: $135M
            'category': 'Energy Importer',
            'energy_impact': 'Dutch TTF gas doubled; chemical/steel surcharges +30%'
        },
        'Japan': {
            'daily_loss': 195,  # Oil: $110M + Gas: $85M
            'category': 'Energy Importer',
            'energy_impact': 'Critical LNG dependence; supply chain disruption'
        },
        'Pakistan': {
            'daily_loss': 43,  # Oil: $19M + Gas: $24M
            'cumulative_war': 2600,  # ~$2.6B
            'cumulative_oil': 1900,  # ~$1.9B
            'cumulative_gas': 740,  # ~$740M
            'daily_war': 0,
            'daily_oil': 19,
            'daily_gas': 24,
            'gdp_impact': '1.5% GDP Slowdown',
            'opportunity_cost': 'Roll over $1B eurobonds or stabilize currency',
            'category': 'Energy Importer',
            'energy_impact': '100% crude from Saudi/UAE; 99% LNG from Qatar; 1.5% GDP Slowdown'
        },
        'Bangladesh': {
            'daily_loss': 27,  # Oil: $13M + Gas: $14M
            'cumulative_war': 1600,  # ~$1.6B
            'cumulative_oil': 1200,  # ~$1.2B
            'cumulative_gas': 390,  # ~$390M
            'daily_war': 0,
            'daily_oil': 13,
            'daily_gas': 14,
            'gdp_impact': '1.2% - 3.0% GDP Contraction',
            'opportunity_cost': 'Power garment factories or secure food imports',
            'category': 'Energy Importer',
            'energy_impact': '80% energy from Middle East; fuel rationing; 1.2-3.0% GDP contraction'
        },
        'Sri Lanka': {
            'daily_loss': 14,  # Oil: $6M + Gas: $8M
            'cumulative_war': 890,  # ~$890M
            'cumulative_oil': 710,  # ~$710M
            'cumulative_gas': 245,  # ~$245M
            'daily_war': 0,
            'daily_oil': 6,
            'daily_gas': 8,
            'gdp_impact': '2.0% GDP Slowdown',
            'opportunity_cost': 'Recover from debt default and end fuel rationing',
            'category': 'Energy Importer',
            'energy_impact': '15L weekly fuel limit; tourism collapse; 2.0% GDP Slowdown'
        },
    },
    'energy_exporters': {
        'UAE': {
            'daily_loss': 300,  # Part of GCC collective loss
            'category': 'Energy Exporter',
            'energy_impact': 'Shipping paralysis; aviation hub collapse'
        },
        'Qatar': {
            'daily_loss': 250,  # Part of GCC collective loss
            'category': 'Energy Exporter',
            'energy_impact': '17% LNG capacity loss; world\'s largest facility damaged'
        },
        'Iraq': {
            'daily_loss': 140,  # Based on oil export halt
            'category': 'Energy Exporter',
            'energy_impact': '90% govt revenue from oil; exports halted'
        },
    },
    'other_affected': {
        'South Korea': {
            'daily_loss': 800,  # Estimated from 73% Gulf dependence
            'category': 'Energy Importer',
            'energy_impact': '73% energy from Gulf; returning to coal power'
        },
        'UK': {
            'daily_loss': 450,  # Estimated based on EU patterns
            'category': 'Energy Importer',
            'energy_impact': '+0.5% inflation; market development risks'
        },
        'Egypt': {
            'daily_loss': 500,  # UN estimates $6.8B combined with Tunisia
            'category': 'Energy Importer',
            'energy_impact': 'Suez Canal revenue loss; food/fuel inflation spiraling'
        },
        'France': {
            'daily_loss': 380,  # Estimated EU industrial impact
            'category': 'Energy Importer',
            'energy_impact': 'Industrial slowdown; Air France-KLM disruption'
        },
        'China': {
            'daily_loss': 400,  # Moderate impact, buffered by reserves
            'category': 'Energy Importer',
            'energy_impact': 'Strategic reserves buffer; increased Iranian imports'
        },
        'Philippines': {
            'daily_loss': 180,  # 4-day work week impact
            'category': 'Energy Importer',
            'energy_impact': '4-day work week for fuel conservation'
        },
    },
    'exporters_winners': {
        'Russia': {
            'daily_loss': -180,  # $5B gain by end of March / ~28 days
            'category': 'Energy Exporter',
            'energy_impact': 'Sanctions relaxed; crude to India +50%; biggest revenue year since 2022'
        },
        'Norway': {
            'daily_loss': -200,  # Estimated gains from increased exports
            'category': 'Energy Exporter',
            'energy_impact': 'Positioned as stable supplier; record demand'
        },
        'Canada': {
            'daily_loss': -150,  # Estimated gains from oil exports
            'category': 'Energy Exporter',
            'energy_impact': 'Values-based energy source; increased market share'
        },
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
            # Use actual cumulative data if available, otherwise estimate from daily * 41 days
            cumulative_war = data.get('cumulative_war', 0)
            cumulative_oil = data.get('cumulative_oil', 0)
            cumulative_gas = data.get('cumulative_gas', 0)
            cumulative_loss = cumulative_war + cumulative_oil + cumulative_gas
            if cumulative_loss == 0:
                cumulative_loss = daily_loss * 41  # 41 days of conflict (Day 41)
            
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
            global_gdp_slowdown=0.0014,  # Updated: 0.0014% of annual output per day (growth revised down 0.3pp)
            trade_loss=2400,  # Updated: $2.4 billion in stuck goods per day through Hormuz
            oil_price=110,  # Updated: $110/barrel baseline (range $95-119)
            strait_closure_percent=97  # Maintained: 97% traffic reduction
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
            global_gdp_slowdown=0.0014,  # 0.0014% of annual output per day
            trade_loss=2400,  # $2.4 billion per day
            oil_price=110 + (0.3 * (today - datetime.now()).days),  # Oil price trend from $110 baseline
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

# Initialize database on module import (runs with both Flask dev server and Gunicorn)
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
    
    # Schedule daily update at 12:00 AM (commented out)
    # try:
    #     scheduler.add_job(
    #         func=update_war_data,
    #         trigger='cron',
    #         hour=0,
    #         minute=0,
    #         id='daily_war_update',
    #         name='Update war impact data daily',
    #         replace_existing=True
    #     )
    #     logger.info("✓ Scheduled task configured: War data update at 12:00 AM")
    # except Exception as e:
    #     logger.error(f"Failed to configure scheduled task: {str(e)}", exc_info=True)

logger.info("=" * 80)
logger.info("✓ Backend initialized and ready")
logger.info("=" * 80)

# Run with Flask dev server (only when executed directly)
if __name__ == '__main__':
    # Get port from environment or use default
    port = int(os.getenv('PORT', 80))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    
    logger.info("=" * 80)
    logger.info("✓ Starting Flask development server...")
    logger.info(f"✓ API available at http://localhost:{port}")
    logger.info(f"✓ Environment: {'Development' if debug else 'Production'}")
    logger.info(f"✓ Logs directory: {LogConfig.LOGS_DIR}")
    # logger.info("✓ Scheduler activated - daily updates at 12:00 AM")
    logger.info("=" * 80)
    
    app.run(debug=debug, host='0.0.0.0', port=port)
