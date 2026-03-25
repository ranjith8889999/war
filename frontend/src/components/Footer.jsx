import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Globe, Zap } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { icon: Heart, label: 'Mission', text: 'Promote global peace' },
    { icon: Globe, label: 'Coverage', text: '50+ countries' },
    { icon: Zap, label: 'Updates', text: 'Daily' },
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-700 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-xl mb-4">Peace Coalition</h3>
            <p className="text-gray-400 text-sm">
              A data-driven initiative to promote peace between world powers and protect global economy.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4">Information</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-orange-400 transition">Data Sources</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">Methodology</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">Contact</a></li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-orange-400 transition">Reports</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">Analysis</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">API</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">FAQ</a></li>
            </ul>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-semibold mb-4">Key Metrics</h4>
            {links.map((link, idx) => {
              const Icon = link.icon;
              return (
                <div key={idx} className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Icon size={16} className="text-orange-500" />
                  <span>{link.label}: {link.text}</span>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-8 mb-8">
          {/* Call to Action */}
          <motion.div
            className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-500/30 rounded-lg p-6 mb-8 text-center"
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-red-300 mb-2">
              Join the Peace Movement
            </h3>
            <p className="text-gray-300 mb-4">
              Share this data with world leaders. Every share brings us closer to peace.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition">
                Share on Twitter
              </button>
              <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition">
                Share on Facebook
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p className="mb-2">
            © {currentYear} Peace Coalition. All rights reserved.
          </p>
          <div className="flex gap-4 justify-center text-xs">
            <a href="#" className="hover:text-gray-400 transition">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-400 transition">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-400 transition">Cookie Policy</a>
          </div>
          <p className="mt-4 text-red-400 font-semibold">
            "Peace is not just a word, it's our future." 🕊️
          </p>
        </div>
      </div>
    </footer>
  );
}
