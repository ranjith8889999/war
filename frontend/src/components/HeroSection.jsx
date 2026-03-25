import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, DollarSign, Globe, AlertTriangle } from 'lucide-react';

export default function HeroSection() {
  const stats = [
    { icon: DollarSign, label: '$1+ Trillion Lost', value: 'Economic damage', color: 'from-red-500 to-orange-500' },
    { icon: TrendingDown, label: '-0.18% Daily', value: 'Global GDP Slowdown', color: 'from-orange-500 to-yellow-500' },
    { icon: Globe, label: '97% Closed', value: 'Strait of Hormuz', color: 'from-yellow-500 to-red-500' },
    { icon: AlertTriangle, label: '50+ Countries', value: 'Economically Affected', color: 'from-red-500 to-pink-500' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.section 
      className="py-16 mb-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="text-center mb-12">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-4"
          variants={itemVariants}
        >
          <span className="bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Global Economic Crisis
          </span>
        </motion.h2>
        <motion.p 
          className="text-xl text-gray-400 max-w-3xl mx-auto"
          variants={itemVariants}
        >
          The ongoing conflict between US, Israel, and Iran is devastating the world economy. 
          Every day that passes brings greater suffering to billions of people worldwide.
        </motion.p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-br ${stat.color} p-0.5 rounded-lg cursor-pointer group`}
            >
              <div className="bg-slate-800 p-6 rounded-lg h-full">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mb-3 text-4xl"
                >
                  <Icon className="text-orange-400" size={40} />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">{stat.label}</h3>
                <p className="text-gray-400">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
