import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function ChartSection() {
  const [chartData, setChartData] = useState({
    byCountry: null,
    timeline: null,
    byCategory: null,
  });
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('byCountry');

  const COLORS_BAR = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];
  const COLORS_PIE = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6'];

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const [countryRes, timelineRes, categoryRes] = await Promise.all([
        axios.get('/api/chart-data?type=by_country', { timeout: 10000 }),
        axios.get('/api/chart-data?type=timeline', { timeout: 10000 }),
        axios.get('/api/chart-data?type=by_category', { timeout: 10000 }),
      ]);

      // Validate responses before processing
      if (!countryRes.data || !timelineRes.data || !categoryRes.data) {
        console.error('Invalid chart data received');
        setLoading(false);
        return;
      }

      // Process country data for bar chart
      const countryData = countryRes.data.labels.map((label, idx) => ({
        name: label,
        value: countryRes.data.data[idx],
      }));

      // Process timeline data
      const timelineData = timelineRes.data.dates.map((date, idx) => ({
        date: date,
        losses: timelineRes.data.daily_losses[idx],
        gdpSlowdown: timelineRes.data.gdp_slowdown[idx],
      }));

      // Process category data for pie chart
      const categoryData = categoryRes.data.labels.map((label, idx) => ({
        name: label,
        value: categoryRes.data.data[idx],
      }));

      setChartData({
        byCountry: countryData.sort((a, b) => b.value - a.value).slice(0, 10),
        timeline: timelineData,
        byCategory: categoryData,
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-orange-500 p-3 rounded-lg">
          <p className="text-orange-400 font-semibold">{payload[0].payload.name || label}</p>
          <p className="text-white">
            {payload[0].name}: ${payload[0].value.toFixed(0)}M
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 mb-16">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="shimmer h-96 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="mb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Chart Selector */}
      <motion.div
        className="flex flex-wrap gap-3 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {[
          { id: 'byCountry', label: 'Top Countries', icon: '📊' },
          { id: 'timeline', label: 'Timeline', icon: '📈' },
          { id: 'byCategory', label: 'By Category', icon: '🥧' },
        ].map(option => (
          <button
            key={option.id}
            onClick={() => setActiveChart(option.id)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeChart === option.id
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            {option.icon} {option.label}
          </button>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div
        key={activeChart}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 backdrop-blur-sm"
      >
        {activeChart === 'byCountry' && chartData.byCountry && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="text-orange-500" size={28} />
              <h3 className="text-2xl font-bold">Top 10 Countries by Daily Loss</h3>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData.byCountry} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChart === 'timeline' && chartData.timeline && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="text-orange-500" size={28} />
              <h3 className="text-2xl font-bold">Global Economic Impact Over Time</h3>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis yAxisId="left" stroke="#94a3b8" />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="losses"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Daily Losses ($M)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="gdpSlowdown"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: '#f97316', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="GDP Slowdown (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChart === 'byCategory' && chartData.byCategory && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="text-orange-500" size={28} />
              <h3 className="text-2xl font-bold">Losses by Category</h3>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData.byCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name}: $${value.toFixed(0)}M`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.byCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Chart Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Total in Top 10</p>
          <p className="text-2xl font-bold text-red-400">
            ${(chartData.byCountry?.reduce((sum, c) => sum + c.value, 0) || 0).toFixed(0)}M
          </p>
        </div>

        <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Countries Tracked</p>
          <p className="text-2xl font-bold text-orange-400">
            {chartData.byCountry?.length || 0}+
          </p>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Report Updated</p>
          <p className="text-2xl font-bold text-yellow-400">Daily</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
