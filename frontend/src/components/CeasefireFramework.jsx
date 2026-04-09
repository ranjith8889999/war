import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';

const frameworkData = [
  {
    id: 1,
    title: 'Phased De-escalation',
    subtitle: 'No one jumps first',
    emoji: '🕊️',
    color: 'from-emerald-500 to-teal-500',
    timeline: 'Day 0–14',
    actions: [
      { flag: '🇮🇷', text: 'Iran pauses enrichment above 5%' },
      { flag: '🇺🇸', text: 'US pauses new sanctions + allows limited oil exports' },
      { flag: '🇮🇱', text: 'Israel pauses cross-border strikes (incl. Lebanon)' },
    ],
    explanation: 'Full ceasefire by all parties including proxies. All moves happen on the same day — nobody "surrenders" first. Everyone moves together.',
  },
  {
    id: 2,
    title: 'Limited Nuclear Program',
    subtitle: 'The core compromise',
    emoji: '⚛️',
    color: 'from-blue-500 to-cyan-500',
    timeline: 'Ongoing',
    actions: [
      { flag: '🇮🇷', text: 'Keeps civilian nuclear program' },
      { flag: '🔬', text: 'Enrichment capped at 3.67–5% with stockpile limits' },
      { flag: '🔍', text: 'IAEA intrusive inspections with real-time monitoring' },
    ],
    explanation: 'Iran keeps dignity ("right to enrich"). US/Israel get verifiable limits. No new advanced centrifuges permitted.',
  },
  {
    id: 3,
    title: 'Sanctions Relief ↔ Compliance',
    subtitle: 'Step-by-step trust building',
    emoji: '🤝',
    color: 'from-amber-500 to-orange-500',
    timeline: '3 Stages',
    actions: [
      { flag: '1️⃣', text: 'Unfreeze limited Iranian assets + humanitarian trade' },
      { flag: '2️⃣', text: 'Oil export quotas restored' },
      { flag: '3️⃣', text: 'Broader sanctions rollback' },
    ],
    explanation: 'Each step happens only after verified compliance. Prevents cheating and builds trust gradually.',
  },
  {
    id: 4,
    title: 'Missile & Military Restraint',
    subtitle: 'Not total disarmament',
    emoji: '🚀',
    color: 'from-red-500 to-rose-500',
    timeline: 'Permanent',
    actions: [
      { flag: '🇮🇷', text: 'Caps missile range (< 2,000 km), no new long-range systems' },
      { flag: '🇺🇸', text: 'No strikes on Iranian mainland unless violation confirmed' },
      { flag: '🇮🇱', text: 'No preemptive strikes without confirmed breach' },
    ],
    explanation: 'Avoids the unrealistic "complete dismantling" demand. Both sides accept realistic military constraints.',
  },
  {
    id: 5,
    title: 'Proxy Conflict Freeze',
    subtitle: 'The hidden battlefield',
    emoji: '🛑',
    color: 'from-purple-500 to-violet-500',
    timeline: 'Immediate',
    actions: [
      { flag: '🇮🇷', text: 'Freezes new funding/weapons to Hezbollah & Houthis' },
      { flag: '🇮🇱', text: 'Halts deep strikes beyond immediate border defense' },
      { flag: '🌍', text: 'Joint monitoring via neutral states (Oman/Pakistan)' },
    ],
    explanation: 'Critical — otherwise war continues indirectly through proxies even after ceasefire.',
  },
  {
    id: 6,
    title: 'Strait of Hormuz Compromise',
    subtitle: 'Biggest global flashpoint',
    emoji: '🚢',
    color: 'from-sky-500 to-blue-500',
    timeline: 'Day 14+',
    actions: [
      { flag: '❌', text: 'No Iranian "tolls" on shipping' },
      { flag: '❌', text: 'No US military dominance of strait' },
      { flag: '✅', text: 'Joint maritime corridor — UN-backed neutral coalition' },
    ],
    explanation: 'Iran gets an economic compensation fund (not tolls). Saves global trade and gives Iran a face-saving economic angle.',
  },
  {
    id: 7,
    title: 'Regional Security Dialogue',
    subtitle: 'Long-term pressure release',
    emoji: '🏛️',
    color: 'from-teal-500 to-emerald-500',
    timeline: 'Month 2+',
    actions: [
      { flag: '🌐', text: 'Forum: Iran, US, Israel (indirect), GCC states' },
      { flag: '📋', text: 'Agenda: Yemen, Lebanon, Iraq stability' },
      { flag: '✍️', text: 'Non-aggression commitments by all parties' },
    ],
    explanation: 'Turns a war system into a negotiation system. Addresses root causes, not just symptoms.',
  },
  {
    id: 8,
    title: 'No Regime Change Clause',
    subtitle: 'Non-negotiable for Iran',
    emoji: '🛡️',
    color: 'from-indigo-500 to-blue-500',
    timeline: 'Permanent',
    actions: [
      { flag: '🇺🇸', text: 'Formally commits: no regime change efforts' },
      { flag: '🇺🇸', text: 'No assassination campaigns against Iranian officials' },
      { flag: '🇮🇷', text: 'In return: commitment to diplomatic engagement' },
    ],
    explanation: 'This is huge for Iran agreeing to anything. Without this guarantee, no deal holds.',
  },
  {
    id: 9,
    title: 'Prisoner Swap & Humanitarian Aid',
    subtitle: 'Quick goodwill builder',
    emoji: '🕊️',
    color: 'from-green-500 to-emerald-500',
    timeline: 'Day 0–7',
    actions: [
      { flag: '🔄', text: 'Exchange detainees from all sides' },
      { flag: '🏥', text: 'Open humanitarian corridors immediately' },
      { flag: '📊', text: 'War damage assessment (without immediate reparations fight)' },
    ],
    explanation: 'Low cost, high impact. Builds goodwill quickly and demonstrates commitment to peace.',
  },
  {
    id: 10,
    title: 'Snapback Mechanism',
    subtitle: 'Insurance for everyone',
    emoji: '⚖️',
    color: 'from-yellow-500 to-amber-500',
    timeline: 'Permanent',
    actions: [
      { flag: '⚠️', text: 'If Iran violates → sanctions return immediately' },
      { flag: '⚠️', text: 'If US/Israel violate → Iran allowed proportional rollback' },
      { flag: '✅', text: 'Both sides stay accountable with clear consequences' },
    ],
    explanation: 'Keeps both sides honest. No one gets a free pass — violations have immediate, automatic consequences.',
  },
];

export default function CeasefireFramework() {
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.section
      className="mb-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div className="text-center mb-8" variants={rowVariants}>
        <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-6 py-2 mb-4">
          <Shield className="text-emerald-400" size={20} />
          <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">
            Peace Framework Proposal
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            10-Point Ceasefire Framework
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          A balanced, face-saving framework where no side surrenders — both can sell it at home. 
          Every point is designed so all parties move together.
        </p>
      </motion.div>

      {/* Table */}
      <motion.div
        className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden"
        variants={rowVariants}
      >
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 bg-slate-700/50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-3">Condition</div>
          <div className="col-span-1 text-center">Timeline</div>
          <div className="col-span-7">Key Actions</div>
        </div>

        {/* Rows */}
        {frameworkData.map((item) => (
          <motion.div
            key={item.id}
            variants={rowVariants}
            className="border-b border-slate-700/50 last:border-b-0"
          >
            {/* Main Row */}
            <div
              className="grid grid-cols-1 md:grid-cols-12 gap-2 px-4 py-4 cursor-pointer hover:bg-slate-700/30 transition-colors"
              onClick={() => toggle(item.id)}
            >
              {/* Number + Emoji */}
              <div className="col-span-1 flex items-center justify-center">
                <span className="text-2xl">{item.emoji}</span>
              </div>

              {/* Title */}
              <div className="col-span-3 flex flex-col justify-center">
                <span className="text-white font-semibold text-sm md:text-base">{item.title}</span>
                <span className="text-gray-500 text-xs">{item.subtitle}</span>
              </div>

              {/* Timeline */}
              <div className="col-span-1 flex items-center justify-center">
                <span className={`inline-block bg-gradient-to-r ${item.color} text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap`}>
                  {item.timeline}
                </span>
              </div>

              {/* Actions Summary */}
              <div className="col-span-6 flex flex-col justify-center gap-1">
                {item.actions.map((action, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="flex-shrink-0">{action.flag}</span>
                    <span className="text-gray-300">{action.text}</span>
                  </div>
                ))}
              </div>

              {/* Expand Toggle */}
              <div className="col-span-1 flex items-center justify-center">
                {expandedId === item.id ? (
                  <ChevronUp className="text-gray-400" size={18} />
                ) : (
                  <ChevronDown className="text-gray-400" size={18} />
                )}
              </div>
            </div>

            {/* Expanded Explanation */}
            <AnimatePresence>
              {expandedId === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className={`mx-4 mb-4 p-4 rounded-lg bg-gradient-to-r ${item.color} bg-opacity-10 border border-slate-600`}
                    style={{ background: 'rgba(30,41,59,0.8)' }}
                  >
                    <p className="text-gray-300 text-sm leading-relaxed">
                      <span className="text-emerald-400 font-semibold">Why this matters: </span>
                      {item.explanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer Note */}
      <motion.p
        className="text-center text-gray-500 text-xs mt-4"
        variants={rowVariants}
      >
        This framework is designed as a common-ground proposal. Click any row to see why each condition matters.
      </motion.p>
    </motion.section>
  );
}
