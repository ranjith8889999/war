import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

export default function CountryBrowser({ data, loading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('loss');

  if (loading) {
    return <div className="shimmer h-96 rounded-lg mb-16" />;
  }

  if (!data?.countries || !Array.isArray(data.countries) || data.countries.length === 0) {
    return (
      <div className="bg-red-900/30 border border-red-500 text-red-200 p-6 rounded-lg mb-16">
        No countries data available
      </div>
    );
  }

  const countries = data.countries;

  // Get unique categories safely
  const categories = ['all', ...new Set(countries.map(c => String(c?.category || 'Unknown')))];

  // Filter and sort data - ALWAYS spread to avoid mutating state
  const filteredCountries = useMemo(() => {
    let result = [...countries];

    // Filter by search
    if (searchTerm) {
      result = result.filter(c =>
        String(c?.country || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      result = result.filter(c => String(c?.category || '') === categoryFilter);
    }

    // Sort
    if (sortBy === 'loss') {
      result.sort((a, b) => Math.abs(Number(b?.daily_loss) || 0) - Math.abs(Number(a?.daily_loss) || 0));
    } else if (sortBy === 'gdp') {
      result.sort((a, b) => (Number(b?.gdp_slowdown_percent) || 0) - (Number(a?.gdp_slowdown_percent) || 0));
    } else if (sortBy === 'alphabetical') {
      result.sort((a, b) => String(a?.country || '').localeCompare(String(b?.country || '')));
    }

    return result;
  }, [countries, searchTerm, categoryFilter, sortBy]);

  const getCountryColor = (category) => {
    const cat = String(category || '');
    if (cat.includes('Direct')) return 'from-red-500 to-red-600';
    if (cat.includes('Importer')) return 'from-orange-500 to-orange-600';
    if (cat.includes('Exporter')) return 'from-green-500 to-green-600';
    return 'from-blue-500 to-blue-600';
  };

  const getCategoryBadge = (category) => {
    const cat = String(category || '');
    if (cat.includes('Direct')) return 'bg-red-900 text-red-200 border-red-500';
    if (cat.includes('Importer')) return 'bg-orange-900 text-orange-200 border-orange-500';
    if (cat.includes('Exporter')) return 'bg-green-900 text-green-200 border-green-500';
    return 'bg-blue-900 text-blue-200 border-blue-500';
  };

  const getCategoryLabel = (category) => {
    const parts = String(category || '').split(' ');
    return parts[parts.length - 1] || 'Unknown';
  };

  return (
    <motion.div
      className="mb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Search */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative"
        >
          <Search className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Filter className="absolute left-3 top-3 text-gray-500" size={20} />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Sort */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="loss">Sort by Daily Loss</option>
            <option value="gdp">Sort by GDP Impact</option>
            <option value="alphabetical">Sort Alphabetically</option>
          </select>
        </motion.div>
      </div>

      {/* Country Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCountries.map((country, idx) => {
            if (!country || typeof country !== 'object') return null;
            const name = String(country.country || 'Unknown');
            const category = String(country.category || 'Unknown');
            const dailyLoss = Number(country.daily_loss) || 0;
            const cumulativeLoss = Number(country.cumulative_loss) || 0;
            const gdpSlowdown = Number(country.gdp_slowdown_percent) || 0;
            const energyImpact = String(country.energy_impact || 'N/A');

            return (
            <motion.div
              key={name + '-' + idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className={`bg-gradient-to-br ${getCountryColor(category)} p-0.5 rounded-lg cursor-pointer group hover:shadow-lg hover:shadow-orange-500/50 transition-all`}
            >
              <div className="bg-slate-800 p-6 h-full rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors">
                    {name}
                  </h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded border ${getCategoryBadge(category)}`}>
                    {getCategoryLabel(category)}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Daily Economic Loss</p>
                    <p className="text-2xl font-bold text-orange-400">
                      ${Math.abs(dailyLoss).toFixed(0)}M
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Cumulative Loss (30d)</p>
                    <p className="text-lg font-bold text-red-400">
                      ${(cumulativeLoss / 1000).toFixed(1)}B
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">GDP Impact per Day</p>
                    <p className={`text-lg font-bold ${gdpSlowdown > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {gdpSlowdown > 0 ? '-' : '+'}{Math.abs(gdpSlowdown).toFixed(3)}%
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <p className="text-xs text-gray-400 line-clamp-2">
                    <strong>Impact:</strong> {energyImpact}
                  </p>
                </div>
              </div>
            </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredCountries.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-gray-400 text-lg">No countries found matching your filters</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-lg"
      >
        <p className="text-gray-300">
          <strong>Total Results:</strong> {filteredCountries.length} countries
        </p>
      </motion.div>
    </motion.div>
  );
}
