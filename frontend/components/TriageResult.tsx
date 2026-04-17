'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldAlert, HeartHandshake, Phone, ArrowLeft, Sparkles, Activity } from 'lucide-react';
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

// ── Urgency palette ──────────────────────────────────────────────────────────
const urgencyConfig = {
  safe: {
    badge: 'Safe to Monitor',
    badgeBg: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
    badgeText: '#065F46',
    badgeBorder: 'rgba(16,185,129,0.25)',
    accent: '#059669',
    accentSoft: 'rgba(16,185,129,0.08)',
    dot: '#34D399',
    icon: '🌿',
  },
  caution: {
    badge: 'Caution Advised',
    badgeBg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
    badgeText: '#92400E',
    badgeBorder: 'rgba(245,158,11,0.3)',
    accent: '#D97706',
    accentSoft: 'rgba(245,158,11,0.07)',
    dot: '#FBBF24',
    icon: '⚠️',
  },
  emergency: {
    badge: 'Emergency Action Needed',
    badgeBg: 'linear-gradient(135deg, #FFE4E6, #FECDD3)',
    badgeText: '#9F1239',
    badgeBorder: 'rgba(244,63,94,0.3)',
    accent: '#BE123C',
    accentSoft: 'rgba(244,63,94,0.07)',
    dot: '#FB7185',
    icon: '🚨',
  },
};

// ── Stagger helpers ──────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut', delay },
});

// ── Decorative SVG blob ──────────────────────────────────────────────────────
function Blob({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      <path
        fill="currentColor"
        d="M44.6,-62.3C56.5,-53.1,63.7,-37.7,67.2,-22C70.7,-6.3,70.4,9.7,64.3,23.2C58.2,36.7,46.3,47.7,32.6,55.9C18.9,64.1,3.4,69.4,-12.4,68.1C-28.2,66.8,-44.3,58.8,-55.4,46.5C-66.5,34.2,-72.6,17.6,-72.2,1.1C-71.8,-15.3,-65,-30.5,-54.5,-40.8C-44,-51.1,-29.9,-56.4,-15.4,-60.5C-0.9,-64.7,13.9,-67.6,28,-66.1C42.1,-64.5,32.8,-71.5,44.6,-62.3Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

export default function TriageResultScreen({ triageData, userData, onNewTriage, onBack }: TriageResultScreenProps) {
    const { week, trimester } = calcPregnancyInfo(userData.dueDate);

    // Safe urgency config with fallback
    const getUrgencyConfig = (urgency?: string) => {
      const configs = urgencyConfig as any;
    
      if (urgency === 'safe' || urgency === 'Safe') return configs.safe;
      if (urgency === 'caution' || urgency === 'Caution') return configs.caution;
      if (urgency === 'emergency' || urgency === 'Emergency') return configs.emergency;
    
      // Default fallback
      return configs.caution;
    };
    
    const cfg = getUrgencyConfig(triageData?.urgency);
    const isEmergency = triageData?.urgency?.toLowerCase() === 'emergency';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #FFFBF5 0%, #FFF0F3 40%, #F5F0FF 100%)',
        fontFamily: "'DM Sans', sans-serif",
        paddingBottom: 80,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* ── Ambient background blobs ── */}
      <Blob style={{ width: 520, top: -180, right: -160, color: 'rgba(249,168,212,0.09)', zIndex: 0 }} />
      <Blob style={{ width: 400, bottom: 200, left: -140, color: 'rgba(167,243,208,0.10)', zIndex: 0 }} />
      <div style={{
        position: 'fixed', top: '35%', right: '-5%', width: 320, height: 320,
        background: 'radial-gradient(circle, rgba(216,180,254,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Top navigation bar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,251,245,0.82)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(249,168,212,0.18)',
        padding: '14px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#BE185D', fontSize: 14, fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500, padding: '8px 14px', borderRadius: 100,
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(249,168,212,0.12)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #F9A8D4, #93C5FD)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 14 }}>🌸</span>
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 400, color: '#1C1014' }}>
            MamaAlert
          </span>
        </div>

        <button
          onClick={onNewTriage}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'rgba(255,255,255,0.8)',
            border: '1.5px solid rgba(249,168,212,0.4)',
            color: '#BE185D', padding: '9px 18px', borderRadius: 100,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(249,168,212,0.12)';
            e.currentTarget.style.borderColor = '#F9A8D4';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
            e.currentTarget.style.borderColor = 'rgba(249,168,212,0.4)';
          }}
        >
          <Sparkles size={15} /> New Triage
        </button>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px', position: 'relative', zIndex: 1 }}>

        {/* ── Hero header card ── */}
        <motion.div {...fadeUp(0)} style={{
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255,255,255,0.7)',
          borderRadius: 32,
          padding: '36px 36px 28px',
          marginBottom: 20,
          boxShadow: '0 8px 48px rgba(249,168,212,0.10)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative inner blob */}
          <div style={{
            position: 'absolute', top: -60, right: -60, width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(249,168,212,0.15) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{
                width: 62, height: 62, borderRadius: 20,
                background: 'linear-gradient(135deg, #F9A8D4 0%, #C4B5FD 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(249,168,212,0.35)',
                flexShrink: 0,
              }}>
                <FileText size={28} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B09099', marginBottom: 4 }}>
                  Triage Report
                </p>
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 34, fontWeight: 400, lineHeight: 1.1,
                  color: '#1C1014', letterSpacing: '-0.02em',
                }}>
                  {userData.name?.split(' ')[0] || 'Mama'}&apos;s Garden Assessment
                </h1>
              </div>
            </div>

            {/* Urgency badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 100,
              background: cfg.badgeBg,
              border: `1.5px solid ${cfg.badgeBorder}`,
              color: cfg.badgeText,
              fontSize: 12, fontWeight: 600, letterSpacing: '0.03em',
              flexShrink: 0,
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: cfg.dot,
                boxShadow: `0 0 6px ${cfg.dot}`,
              }} />
              {cfg.badge}
            </div>
          </div>

          {/* Meta row */}
          <div style={{
            display: 'flex', gap: 20, marginTop: 24, flexWrap: 'wrap',
          }}>
            {[
              { label: 'Pregnancy Week', value: `Week ${week}` },
              { label: 'Trimester', value: `Trimester ${trimester}` },
              { label: 'Urgency Level', value: cfg.badge },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '10px 16px', borderRadius: 14,
                background: 'rgba(249,168,212,0.07)',
                border: '1px solid rgba(249,168,212,0.15)',
              }}>
                <p style={{ fontSize: 10, color: '#B09099', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#1C1014' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Symptoms card ── */}
        <motion.div {...fadeUp(0.1)} style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.65)',
          borderRadius: 28,
          padding: '28px 32px',
          marginBottom: 20,
          boxShadow: '0 4px 32px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 14,
              background: 'rgba(249,168,212,0.14)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShieldAlert size={20} color="#BE185D" />
            </div>
            <div>
              <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B09099' }}>Reported</p>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: '#1C1014' }}>
                Symptoms
              </h3>
            </div>
          </div>

          <div style={{
            padding: '18px 22px', borderRadius: 18,
            background: 'rgba(249,168,212,0.06)',
            border: '1px solid rgba(249,168,212,0.18)',
          }}>
            <p style={{ fontSize: 15.5, color: '#6B5057', lineHeight: 1.75 }}>{triageData.symptom}</p>
          </div>
        </motion.div>

        {/* ── AI Analysis card ── */}
        <motion.div {...fadeUp(0.18)} style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.65)',
          borderRadius: 28,
          padding: '28px 32px',
          marginBottom: 20,
          boxShadow: '0 4px 32px rgba(0,0,0,0.04)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Subtle accent line */}
          <div style={{
            position: 'absolute', left: 0, top: '15%', bottom: '15%',
            width: 3, borderRadius: 4,
            background: `linear-gradient(180deg, transparent, ${cfg.accent}, transparent)`,
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 14,
              background: cfg.accentSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Activity size={20} color={cfg.accent} />
            </div>
            <div>
              <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B09099' }}>Garden Guide</p>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: '#1C1014' }}>
                AI Analysis
              </h3>
            </div>
            <div style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 100,
              background: cfg.accentSoft,
              border: `1px solid ${cfg.badgeBorder}`,
            }}>
              <span style={{ fontSize: 14 }}>{cfg.icon}</span>
              <span style={{ fontSize: 12, color: cfg.accent, fontWeight: 500 }}>{cfg.badge}</span>
            </div>
          </div>

          <p style={{ fontSize: 15.5, color: '#1C1014', lineHeight: 1.85, whiteSpace: 'pre-line' }}>
            {triageData.analysis}
          </p>
        </motion.div>

        {/* ── Recommendations card ── */}
        <motion.div {...fadeUp(0.26)} style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.65)',
          borderRadius: 28,
          padding: '28px 32px',
          marginBottom: 20,
          boxShadow: '0 4px 32px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 14,
              background: 'rgba(16,185,129,0.09)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <HeartHandshake size={20} color="#059669" />
            </div>
            <div>
              <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B09099' }}>What to do</p>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: '#1C1014' }}>
                Recommended Actions
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(triageData.recommendations ?? []).map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.32 + i * 0.07, duration: 0.45, ease: 'easeOut' }}
                style={{
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                  padding: '16px 20px', borderRadius: 18,
                  background: 'rgba(16,185,129,0.05)',
                  border: '1px solid rgba(16,185,129,0.14)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateX(4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(16,185,129,0.10)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 10, flexShrink: 0,
                  background: 'linear-gradient(135deg, #34D399, #059669)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 12, fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: 14.5, color: '#374151', lineHeight: 1.7 }}>{rec}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Emergency CTA (only shown when urgency === 'emergency') ── */}
        {isEmergency && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
            style={{
              borderRadius: 32,
              overflow: 'hidden',
              marginBottom: 20,
              boxShadow: '0 24px 64px rgba(190,18,60,0.25)',
            }}
          >
            {/* Background with texture-like gradient */}
            <div style={{
              background: 'linear-gradient(135deg, #9F1239 0%, #BE123C 35%, #E11D48 70%, #F43F5E 100%)',
              padding: '44px 36px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Decorative radial glow */}
              <div style={{
                position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)',
                width: 400, height: 300,
                background: 'radial-gradient(ellipse, rgba(255,255,255,0.12) 0%, transparent 60%)',
                pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute', bottom: '-20%', right: '-5%',
                width: 200, height: 200,
                background: 'radial-gradient(circle, rgba(255,200,200,0.1) 0%, transparent 60%)',
                pointerEvents: 'none',
              }} />

              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'inline-block', marginBottom: 16 }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                }}>
                  <ShieldAlert size={36} color="#fff" />
                </div>
              </motion.div>

              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 36, fontWeight: 400,
                color: '#fff', marginBottom: 8,
                lineHeight: 1.15,
              }}>
                Emergency Action Required
              </h3>
              <p style={{ color: 'rgba(255,228,230,0.9)', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
                Your safety is our first priority, mama.<br />Please seek immediate medical help right now.
              </p>

              <button
                onClick={() => window.open('tel:112')}
                style={{
                  width: '100%',
                  padding: '20px 24px',
                  background: 'rgba(255,255,255,0.97)',
                  color: '#9F1239',
                  border: 'none',
                  borderRadius: 20,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 17,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.25)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
                }}
              >
                <Phone size={22} /> Call Emergency — 112
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Footer note ── */}
        <motion.p {...fadeUp(0.48)} style={{
          textAlign: 'center', fontSize: 12, color: '#C4A8B0', lineHeight: 1.7,
        }}>
          This assessment is for guidance only and does not replace professional medical advice.<br />
          Always consult your healthcare provider for medical decisions.
        </motion.p>
      </div>
    </div>
  );
}