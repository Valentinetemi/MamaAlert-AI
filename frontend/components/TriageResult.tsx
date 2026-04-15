'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldAlert, HeartHandshake, Phone, ArrowLeft } from 'lucide-react';
import { UserData } from './onboarding';
import { calcPregnancyInfo } from './mama-alert';

interface TriageData {
  symptom: string;
  analysis: string;
  urgency: 'safe' | 'caution' | 'emergency';
  recommendations: string[];
}

interface TriageResultScreenProps {
  triageData: TriageData;
  userData: UserData;
  onNewTriage: () => void;
  onBack: () => void;
}

const urgencyConfig = {
  safe: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Safe to Monitor', glow: 'shadow-emerald-200/50' },
  caution: { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Caution Advised', glow: 'shadow-amber-200/50' },
  emergency: { color: 'bg-rose-100 text-rose-700 border-rose-200', label: 'Emergency Action Needed', glow: 'shadow-rose-300/60' },
};

export default function TriageResultScreen({ triageData, userData, onNewTriage, onBack }: TriageResultScreenProps) {
  const { week, trimester } = calcPregnancyInfo(userData.dueDate);
  const config = urgencyConfig[triageData.urgency];

  return (
    <div className="min-h-screen bg-[#FFF5F5] pb-20">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-pink-100 px-6 py-4 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-pink-600 hover:text-pink-700">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <button
          onClick={onNewTriage}
          className="flex items-center gap-2 bg-white border border-pink-200 text-pink-600 px-5 py-2.5 rounded-2xl font-medium hover:bg-pink-50"
        >
          <FileText size={18} /> New Triage
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-5 pt-8 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center">
                <FileText size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-light font-serif">Triage Report</h1>
                <p className="text-[#B09099]">MamaAlert Garden Sanctuary</p>
              </div>
            </div>
            <div className={`px-6 py-3 rounded-2xl text-sm font-semibold border ${config.color} ${config.glow}`}>
              {config.label}
            </div>
          </div>
          <p className="mt-4 text-[#B09099]">Week {week} • Trimester {trimester}</p>
        </motion.div>

        {/* Symptom */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-7">
          <h3 className="font-medium text-lg mb-3 flex items-center gap-3">
            <ShieldAlert className="text-pink-500" /> Reported Symptoms
          </h3>
          <p className="text-[#6B5057] text-[15.5px]">{triageData.symptom}</p>
        </motion.div>

        {/* AI Analysis */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-8">
          <h3 className="font-medium text-xl mb-5 flex items-center gap-3">
            <HeartHandshake className="text-purple-600" /> AI Analysis
          </h3>
          <p className="text-[#1C1014] leading-relaxed text-[15.5px] whitespace-pre-line">
            {triageData.analysis}
          </p>
        </motion.div>

        {/* Recommendations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-8">
          <h3 className="font-medium text-lg mb-6">Recommended Actions</h3>
          <div className="space-y-4">
            {triageData.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-4 bg-white/60 rounded-2xl p-5 border border-emerald-100">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-[#6B5057] leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Emergency CTA */}
        {triageData.urgency === 'emergency' && (
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-gradient-to-br from-rose-600 to-pink-600 rounded-3xl p-10 text-white text-center">
            <ShieldAlert size={48} className="mx-auto mb-4" />
            <h3 className="text-3xl font-medium mb-2">Emergency Action Required</h3>
            <p className="text-rose-100 mb-8">Please seek immediate medical help</p>
            <button
              onClick={() => window.open('tel:112')}
              className="w-full bg-white text-rose-700 py-6 rounded-2xl text-xl font-semibold flex items-center justify-center gap-3 hover:bg-rose-50"
            >
              <Phone size={28} /> Call Emergency — 112
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}