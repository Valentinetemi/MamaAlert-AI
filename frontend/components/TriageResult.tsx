'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldAlert, HeartHandshake, Phone, ArrowLeft } from 'lucide-react';
import { UserData } from './onboarding';
import translations from './translations.json';

// Helper to get translation
const t = (key: string, lang: string = 'en') => {
  return (translations as any)[key]?.[lang] || (translations as any)[key]?.['en'] || key;
};

interface TriageData {
  symptom: string;
  analysis: string;
  urgency: 'safe' | 'caution' | 'emergency';
  recommendations: string[];
}

interface TriageResultScreenProps {
  triageData: TriageData;
  userData: UserData;
  onNewTriage: () => void; // Go back to Voice Triage screen
  onBack?: () => void;
}

const urgencyConfig = {
  safe: {
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    badge: 'Safe to Monitor',
    glow: 'shadow-emerald-200/50',
  },
  caution: {
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    badge: 'Caution Advised',
    glow: 'shadow-amber-200/50',
  },
  emergency: {
    color: 'bg-rose-100 text-rose-700 border-rose-200',
    badge: 'Emergency Action Needed',
    glow: 'shadow-rose-300/60',
  },
};

export default function TriageResultScreen({
  triageData,
  userData,
  onNewTriage,
  onBack,
}: TriageResultScreenProps) {
  const lang = userData.language || 'en';
  const { week, trimester } = calcPregnancyStats(userData.dueDate); // Reuse your existing util

  const config = urgencyConfig[triageData.urgency];

  return (
    <div className="min-h-screen bg-[#FFF5F5] pb-20">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-pink-100 px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBack || onNewTriage}
          className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">{t('back', lang)}</span>
        </button>

        <button
          onClick={onNewTriage}
          className="flex items-center gap-2 bg-white hover:bg-pink-50 border border-pink-200 text-pink-600 px-5 py-2.5 rounded-2xl font-medium transition-all active:scale-95"
        >
          <FileText size={18} />
          {t('new_triage', lang)}
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-5 pt-8">
        {/* Header Report Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-8 mb-6 shadow-xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center">
                <FileText size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-light font-serif text-[#1C1014]">
                  {t('triage_report', lang)}
                </h1>
                <p className="text-[#B09099] mt-1">MamaAlert • Garden Sanctuary</p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className={`px-5 py-2 rounded-2xl text-sm font-semibold border ${config.color} ${config.glow}`}>
                {config.badge}
              </div>
              <p className="text-xs text-[#B09099] mt-3">
                Week {week} • {t(`trimester_${trimester}`, lang)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Symptom Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert size={22} className="text-pink-500" />
            <h3 className="font-medium text-lg text-[#1C1014]">{t('reported_symptoms', lang)}</h3>
          </div>
          <p className="text-[#6B5057] text-[15px] leading-relaxed pl-9">
            {triageData.symptom}
          </p>
        </motion.div>

        {/* AI Analysis Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-8 mb-6 shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <HeartHandshake size={20} className="text-white" />
            </div>
            <h3 className="font-medium text-xl text-[#1C1014]">{t('ai_analysis', lang)}</h3>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#1C1014] leading-relaxed text-[15.5px] whitespace-pre-line"
          >
            {triageData.analysis}
          </motion.p>

          <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-pink-100/30 rounded-full blur-3xl" />
        </motion.div>

        {/* Recommendations Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-8 mb-8"
        >
          <h3 className="font-medium text-lg text-[#1C1014] mb-6 flex items-center gap-3">
            <HeartHandshake size={22} className="text-emerald-600" />
            {t('recommendations', lang)}
          </h3>

          <div className="space-y-4">
            {triageData.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex gap-4 bg-white/60 rounded-2xl p-5 border border-emerald-100"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-600 text-sm font-medium">{index + 1}</span>
                </div>
                <p className="text-[#6B5057] leading-relaxed">{rec}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Emergency Action */}
        {triageData.urgency === 'emergency' && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-rose-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl shadow-rose-500/30 mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <ShieldAlert size={42} />
              <div>
                <h3 className="text-2xl font-medium">{t('emergency_action', lang)}</h3>
                <p className="text-rose-100 mt-1">{t('seek_help_now', lang)}</p>
              </div>
            </div>

            <button
              onClick={() => window.open('tel:112', '_self')}
              className="w-full bg-white text-rose-700 hover:bg-rose-50 py-6 rounded-2xl text-xl font-semibold flex items-center justify-center gap-3 active:scale-[0.985] transition-all"
            >
              <Phone size={28} />
              {t('call_emergency_112', lang)}
            </button>

            <p className="text-center text-rose-100 text-sm mt-4">
              {userData.hospital ? `${t('or_call', lang)} ${userData.hospital}` : ''}
            </p>
          </motion.div>
        )}

        {/* New Triage Button (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={onNewTriage}
            className="w-full py-4 bg-white border border-pink-200 text-pink-600 rounded-2xl font-medium text-lg active:bg-pink-50"
          >
            {t('start_new_triage', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function (add to your utils or import from existing file)
function calcPregnancyStats(dueDateStr: string) {
  // Reuse your existing calcPregnancyInfo logic
  const info = calcPregnancyInfo(dueDateStr); // assuming you export it
  return { week: info.week, trimester: info.trimester };
}