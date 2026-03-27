import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Award } from 'lucide-react';

export default function Dashboard({ data, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="shimmer h-40 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!data?.summary ||typeof data.summary !== 'object') {
    return (
      <div className="bg-red-900/30 border border-red-500 text-red-200 p-6 rounded-lg mb-16">
        No data available
      </div>
    );
  }

  const { summary } = data;

  // Ensure all required fields exist with default values
  const safeSummary = {
    total_daily_loss: summary.total_daily_loss || 0,
    total_cumulative_loss: summary.total_cumulative_loss || 0,
    average_gdp_slowdown: summary.average_gdp_slowdown || 0,
    top_affected_countries: Array.isArray(summary.top_affected_countries) ? summary.top_affected_countries : [],
    total_countries: summary.total_countries || 0,
    last_update: summary.date || new Date().toISOString()
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      className="mb-16"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 border border-red-500/30"
        >
          <p className="text-red-200 text-sm mb-2">Total Daily Loss</p>
          <p className="text-4xl font-bold text-white mb-2">
            ${(safeSummary.total_daily_loss / 1000).toFixed(1)}B
          </p>
          <p className="text-red-100 text-xs">USD</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl p-6 border border-orange-500/30"
        >
          <p className="text-orange-200 text-sm mb-2">Cumulative Loss (30 days)</p>
          <p className="text-4xl font-bold text-white mb-2">
            ${(safeSummary.total_cumulative_loss / 1000).toFixed(1)}B
          </p>
          <p className="text-orange-100 text-xs">USD</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6 border border-yellow-500/30"
        >
          <p className="text-yellow-200 text-sm mb-2">Avg GDP Slowdown</p>
          <p className="text-4xl font-bold text-white mb-2">
            {safeSummary.average_gdp_slowdown.toFixed(3)}%
          </p>
          <p className="text-yellow-100 text-xs">Per Day, Global</p>
        </motion.div>
      </div>

      {/* Top Affected Countries */}
      <motion.div
        variants={itemVariants}
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <Award className="text-orange-500" size={28} />
          <h3 className="text-2xl font-bold">Top 10 Most Affected Countries</h3>
        </div>

        <div className="space-y-3">
          {(safeSummary.top_affected_countries || []).map((country, idx) => {
            if (!country || typeof country !== 'object') return null;
            const name = String(country.country || 'Unknown');
            const category = String(country.category || 'Unknown');
            const dailyLoss = Number(country.daily_loss) || 0;
            const gdpSlowdown = Number(country.gdp_slowdown_percent) || 0;

            return (
            <motion.div
              key={name + '-' + idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg hover:bg-slate-900 transition-colors group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center font-bold text-white">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white group-hover:text-orange-400 transition-colors">
                    {name}
                  </p>
                  <p className="text-xs text-gray-400">{category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-orange-400">
                  ${dailyLoss.toFixed(0)}M
                </p>
                <p className="text-xs text-red-400">{gdpSlowdown.toFixed(3)}%/day</p>
              </div>
              <ChevronRight className="text-gray-600 group-hover:text-orange-500 transition-colors ml-2" />
            </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg"
        >
          <p className="text-blue-200 text-sm">
            <strong>Total Countries Tracked:</strong> {safeSummary.total_countries || 0}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
