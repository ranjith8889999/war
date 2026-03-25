import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Heart } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-red-500"
          >
            <Heart size={28} fill="currentColor" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Peace Coalition
            </h1>
            <p className="text-xs text-gray-400">Global Economic Impact Report</p>
          </div>
        </motion.div>

        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex items-center gap-2 bg-red-900/30 px-4 py-2 rounded-lg border border-red-500/30"
        >
          <AlertCircle size={20} className="text-red-400" />
          <span className="text-sm font-semibold text-red-300">URGENT: Peace Needed</span>
        </motion.div>
      </div>
    </header>
  );
}
