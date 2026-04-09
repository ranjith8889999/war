import sys
sys.path.insert(0, '.')

from backend.app import db, CountryData, GlobalMetrics, app

with app.app_context():
    country_count = CountryData.query.count()
    global_count = GlobalMetrics.query.count()
    
    print(f"\n=== Database Verification ===")
    print(f"Total Countries: {country_count}")
    print(f"Global Metrics: {global_count}")
    
    if country_count > 0:
        print(f"\n=== Sample Countries ===")
        countries = CountryData.query.limit(5).all()
        for c in countries:
            print(f"  {c.country:20s} | Daily Loss: ${c.daily_loss:,.2f}M | Category: {c.category}")
    
    if global_count > 0:
        print(f"\n=== Global Metrics ===")
        metrics = GlobalMetrics.query.first()
        print(f"  Total Daily Loss: ${metrics.global_daily_loss:,.2f}M")
        print(f"  GDP Slowdown: {metrics.global_gdp_slowdown}%")
        print(f"  Trade Loss: ${metrics.trade_loss:,.2f}M/day")
        print(f"  Oil Price: ${metrics.oil_price:.2f}/barrel")
        print(f"  Strait Closure: {metrics.strait_closure_percent}%")
    
    print(f"\n=== All Countries ===")
    all_countries = CountryData.query.all()
    total_loss = 0
    for c in all_countries:
        print(f"  {c.country:20s} | ${c.daily_loss:8,.2f}M/day | {c.category:20s} | {c.energy_impact[:50]}...")
        if c.daily_loss > 0:
            total_loss += c.daily_loss
    
    print(f"\nTotal Calculated Daily Loss: ${total_loss:,.2f}M")
