import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { MessageCircle, Zap } from 'lucide-react';

export default function PeaceMessage({ data }) {
  const [peaceData, setPeaceData] = useState(null);

  useEffect(() => {
    const fetchPeaceMessage = async () => {
      try {
        const res = await axios.get('/api/peace-message');
        setPeaceData(res.data);
      } catch (err) {
        console.error('Error fetching peace message:', err);
      }
    };
    fetchPeaceMessage();
  }, []);

  if (!peaceData || !data?.summary) return null;

  return (
    <motion.div
      className="mb-16 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-2xl"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
      />

      <div className="relative z-10 bg-slate-800/80 backdrop-blur-sm border-2 border-red-500/50 rounded-2xl p-8 md:p-12">
        <div className="flex gap-4 mb-6">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex-shrink-0 text-3xl"
          >
            <Zap className="text-red-500" size={40} />
          </motion.div>
          <div>
            <h3 className="text-3xl font-bold text-red-400 mb-2">
              {peaceData.call_to_action}
            </h3>
            <p className="text-gray-300">{peaceData.urgent_message}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 bg-slate-900/50 p-6 rounded-xl border border-slate-700">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-gray-400 text-sm mb-1">Daily Global Loss</p>
            <p className="text-2xl font-bold text-red-400">
              {peaceData.economic_facts.daily_global_loss}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-400 text-sm mb-1">Monthly Loss</p>
            <p className="text-2xl font-bold text-orange-400">
              {peaceData.economic_facts.monthly_loss}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-400 text-sm mb-1">Global GDP Impact</p>
            <p className="text-2xl font-bold text-yellow-400">
              {peaceData.economic_facts.gdp_impact}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-gray-400 text-sm mb-1">Most Affected</p>
            <p className="text-2xl font-bold text-pink-400">
              {peaceData.economic_facts.most_affected}
            </p>
          </motion.div>
        </div>

        <motion.div
          className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg"
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-red-200 font-semibold flex items-center gap-2">
            <MessageCircle size={20} />
            This data updates daily based on real-world impact calculations.
          </p>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </motion.div>
  );
}
