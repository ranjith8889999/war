import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Header from './components/Header';
import HeroSection from './components/HeroSection';

// Configure axios defaults
axios.defaults.timeout = 10000; // 10 second timeout
import Dashboard from './components/Dashboard';
import CountryBrowser from './components/CountryBrowser';
import ChartSection from './components/ChartSection';
import PeaceMessage from './components/PeaceMessage';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, countriesRes, globalRes] = await Promise.all([
        axios.get('/api/summary'),
        axios.get('/api/countries'),
        axios.get('/api/global-metrics')
      ]);

      // Only update state if we got valid data
      if (summaryRes.data && countriesRes.data && globalRes.data) {
        setData({
          summary: summaryRes.data,
          countries: countriesRes.data,
          global: globalRes.data
        });
        setError(null); // Clear any previous errors on success
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      // Only set error if we don't have any data yet
      if (!data.countries || data.countries.length === 0) {
        setError('Failed to load data. Please check if the backend service is running and accessible.');
      } else {
        // If we already have data, just log the error but keep showing existing data
        console.warn('Failed to refresh data, keeping existing data:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4">
        <HeroSection />
        
        {error && (
          <motion.div 
            className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-semibold">⚠️ {error}</p>
          </motion.div>
        )}

        <PeaceMessage data={data} />

        {/* Navigation Tabs */}
        <motion.div 
          className="flex flex-wrap gap-2 mb-8 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {['dashboard', 'countries', 'charts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Content Sections */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'dashboard' && <Dashboard data={data} loading={loading} />}
          {activeTab === 'countries' && <CountryBrowser data={data} loading={loading} />}
          {activeTab === 'charts' && <ChartSection />}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
