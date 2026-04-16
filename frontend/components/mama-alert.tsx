'use client';

import React, { useState, useEffect, useRef} from 'react';
import Onboarding, { UserData, SvgIcon, ICON_PATHS } from './onboarding'; 
import TriageResultScreen from './TriageResult';
import translationsData from '../translation.json';

const translations = translationsData as Record<string, Record<string, string>>;

function useTranslation(lang: string) {
  const t = (key: string) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };
  return { t };
}

// ─── SPEECH API ───────────────────────────────────────────────────────────────
const SpeechRecognition = typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface PregnancyInfo {
  week: number;
  day: number;
  trimester: 1 | 2 | 3;
  daysLeft: number;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const NUTRITION_TIPS = [
  'Ugu leaves or spinach for natural iron 🌿',
  'Greek yogurt or wara (local cheese) for calcium 🥛',
  'Avocado for healthy fats and folate 🥑',
  'Beans & lentils for plant protein and fiber 🫘',
  'Oranges for Vitamin C and hydration 🍊',
  'Tiger nuts (ofio) for minerals and energy 🌾',
];

const SYMPTOMS = [
  'Headache',
  'Swelling (feet/hands)',
  'Reduced baby movement',
  'Bleeding',
  'Nausea / Vomiting',
  'Back pain',
  'Blurry vision',
  'Fever',
];

const TRIMESTER_COLORS = {
  1: { bg: 'rgba(110,231,183,0.18)', text: '#059669', label: 'First Trimester' },
  2: { bg: 'rgba(147,197,253,0.20)', text: '#2563EB', label: 'Second Trimester' },
  3: { bg: 'rgba(249,168,212,0.20)', text: '#BE185D', label: 'Third Trimester' },
} as const;

// ─── UTILS ────────────────────────────────────────────────────────────────────
export function calcPregnancyInfo(dueDateStr: string): PregnancyInfo {
  if (!dueDateStr) return { week: 28, day: 3, trimester: 2, daysLeft: 84 };
  const dueDate = new Date(dueDateStr);
  //  guard against invalid date string
  if (isNaN(dueDate.getTime())) return { week: 28, day: 3, trimester: 2, daysLeft: 84 };
  const now = new Date();
  const conception = new Date(dueDate);
  conception.setDate(conception.getDate() - 280);
  const diffMs = now.getTime() - conception.getTime();
  const diffDays = diffMs > 0 ? Math.floor(diffMs / 86400000) : 0;
  const week = Math.min(40, Math.floor(diffDays / 7)) as number;
  const day = diffDays % 7;
  const trimester: 1 | 2 | 3 = week <= 12 ? 1 : week <= 28 ? 2 : 3;
  const daysLeft = Math.max(0, Math.floor((dueDate.getTime() - now.getTime()) / 86400000));
  return { week, day, trimester, daysLeft };
}

function calcDaysSince(dateStr: string): number {
  if (!dateStr) return 999;
  //  guard against new Date('') returning Invalid Date
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 999;
  return Math.floor((new Date().getTime() - d.getTime()) / 86400000);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  // guard against invalid date before calling toLocaleDateString
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

// pin tip to calendar date, not Date.now(), stable within a render and within a day
function getDailyTip(): string {
  const today = new Date();
  const dayIndex = today.getFullYear() * 1000 + today.getMonth() * 31 + today.getDate();
  return NUTRITION_TIPS[dayIndex % NUTRITION_TIPS.length];
}

// ─── PREGNANCY CARD ───────────────────────────────────────────────────────────
function PregnancyCard({ dueDate, t }: { dueDate: string; t: (k: string) => string }) {
  const { week, day, trimester, daysLeft } = calcPregnancyInfo(dueDate);
  const tc = TRIMESTER_COLORS[trimester];
  const pct = Math.min(100, (week / 40) * 100);
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(249,168,212,0.25)',
        borderRadius: '2.5rem',
        padding: '24px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        animation: 'float 4s ease-in-out infinite',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <SvgIcon paths={ICON_PATHS.flower} size={26} stroke="#F9A8D4" strokeWidth={1.8} />
          <h3 style={{ fontSize: 16, fontFamily: "'Playfair Display',serif", fontWeight: 300, marginTop: 8 }}>
            {t('journey')}
          </h3>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '5px 12px',
            borderRadius: '2rem',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            background: tc.bg,
            color: tc.text,
          }}
        >
          T{trimester}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <svg width={108} height={108} viewBox="0 0 108 108">
          <defs>
            <linearGradient id="pRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F9A8D4" />
              <stop offset="100%" stopColor="#93C5FD" />
            </linearGradient>
          </defs>
          <circle cx="54" cy="54" r={r} fill="none" stroke="rgba(249,168,212,0.15)" strokeWidth="7" />
          <circle
            cx="54"
            cy="54"
            r={r}
            fill="none"
            stroke="url(#pRing)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circ}
            style={{ 
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: 'drop-shadow(0 0 4px rgba(249,168,212,0.3))'
            }}
            transform="rotate(-90 54 54)"
          />
          <text
            x="54"
            y="49"
            textAnchor="middle"
            fontSize="20"
            fontFamily="Playfair Display, serif"
            fontWeight="300"
            fill="#1C1014"
          >
            {week}
          </text>
          <text x="54" y="64" textAnchor="middle" fontSize="9" fontFamily="DM Sans, sans-serif" fill="#B09099">
            {t('weeks_count')}
          </text>
        </svg>

        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 22, fontFamily: "'Playfair Display',serif", fontWeight: 300, color: '#1C1014', lineHeight: 1.2 }}>
            {t('weeks_count')} {week}
          </p>
          <p style={{ fontSize: 13, color: '#B09099', marginTop: 2 }}>Day {day} of 7</p>
          <p style={{ fontSize: 11, color: tc.text, marginTop: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {tc.label}
          </p>
          <p style={{ fontSize: 12, color: '#B09099', marginTop: 4 }}>{daysLeft} days to go </p>
        </div>
      </div>
    </div>
  );
}

// ─── HYDRATION CARD ───────────────────────────────────────────────────────────
function HydrationCard({ count, onAdd, t }: { count: number; onAdd: () => void; t: (k: string) => string }) {
  const pct = (count / 10) * 100;
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(147,197,253,0.25)',
        borderRadius: '2.5rem',
        padding: '24px',
        animation: 'float 5s ease-in-out 0.7s infinite',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <SvgIcon paths={ICON_PATHS.droplet} size={26} stroke="#60A5FA" strokeWidth={1.8} />
          <h3 style={{ fontSize: 16, fontFamily: "'Playfair Display',serif", fontWeight: 300, marginTop: 8 }}>
            {t('water_tracker')}
          </h3>
          <p style={{ fontSize: 12, color: '#B09099' }}>Stay watered, mama</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 38, fontFamily: "'Playfair Display',serif", fontWeight: 300, color: '#2563EB' }}>
            {count}
          </span>
          <span style={{ fontSize: 13, color: '#B09099' }}>/10</span>
        </div>
      </div>

      {/* Wave */}
      <div
        style={{
          position: 'relative',
          height: 110,
          borderRadius: '1.4rem',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #EBF8FF 0%, #BFDBFE 100%)',
          margin: '12px 0',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(180deg, #60A5FA, #3B82F6)',
            borderRadius: '1.4rem 1.4rem 0 0',
            transition: 'height 0.8s cubic-bezier(0.4,0,0.2,1)',
            height: `${pct}%`,
            animation: 'wave 3s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 500, color: pct > 50 ? '#fff' : '#3B82F6' }}>
            {Math.round(pct)}%
          </span>
        </div>
      </div>

      <button
        onClick={onAdd}
        disabled={count >= 10}
        style={{
          cursor: count >= 10 ? 'not-allowed' : 'pointer',
          width: '100%',
          padding: '12px 20px',
          background: count >= 10 ? '#E5E7EB' : 'linear-gradient(135deg,#60A5FA,#3B82F6)',
          color: count >= 10 ? '#9CA3AF' : '#fff',
          border: 'none',
          borderRadius: '1.4rem',
          fontFamily: "'DM Sans',sans-serif",
          fontWeight: 500,
          fontSize: 14,
          transition: 'all 0.2s',
        }}
      >
        + {t('drink_btn')}
      </button>
    </div>
  );
}

// ─── NUTRITION CARD ───────────────────────────────────────────────────────────
function NutritionCard({ t }: { t: (k: string) => string }) {
  const todayTip = getDailyTip();
  const others = NUTRITION_TIPS.filter((t) => t !== todayTip).slice(0, 3);

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(110,231,183,0.25)',
        borderRadius: '2.5rem',
        padding: '24px',
        animation: 'float 6s ease-in-out 1.4s infinite',
      }}
    >
      <SvgIcon paths={ICON_PATHS.leaf} size={26} stroke="#059669" strokeWidth={1.8} />
      <h3 style={{ fontSize: 16, fontFamily: "'Playfair Display',serif", fontWeight: 300, marginTop: 8, marginBottom: 4 }}>
        {t('nutrition')}
      </h3>
      <p style={{ fontSize: 12, color: '#B09099', marginBottom: 14 }}>Local superfoods for you &amp; baby</p>

      <div
        style={{
          padding: '14px',
          background: 'rgba(110,231,183,0.09)',
          borderRadius: '1.2rem',
          border: '1px solid rgba(110,231,183,0.2)',
          marginBottom: 12,
        }}
      >
        <p style={{ fontSize: 11, color: '#B09099', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Today&apos;s focus
        </p>
        <p style={{ fontSize: 14, color: '#1C1014', marginTop: 4 }}>{todayTip}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {others.map((tip, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(110,231,183,0.6)', flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#6B5057' }}>{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CLINICAL CARD ────────────────────────────────────────────────────────────
function ClinicalCard({ lastVisit, nextAppointment, t }: { lastVisit: string; nextAppointment: string; t: (k: string) => string }) {
  const daysSince = calcDaysSince(lastVisit);
  const isOverdue = daysSince > 28;
  const daysUntilNext = nextAppointment
    ? (() => {
        const d = new Date(nextAppointment);
        // FIX: guard invalid date before computing difference
        if (isNaN(d.getTime())) return null;
        return Math.floor((d.getTime() - new Date().getTime()) / 86400000);
      })()
    : null;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isOverdue ? '1px solid rgba(251,191,36,0.45)' : '1px solid rgba(249,168,212,0.25)',
        borderRadius: '2.5rem',
        padding: '24px',
        boxShadow: isOverdue ? '0 0 0 3px rgba(251,191,36,0.18), 0 12px 40px rgba(251,191,36,0.12)' : undefined,
        transition: 'all 0.5s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <SvgIcon paths={ICON_PATHS.hospital} size={26} stroke={isOverdue ? '#D97706' : '#F9A8D4'} strokeWidth={1.8} />
          <h3 style={{ fontSize: 16, fontFamily: "'Playfair Display',serif", fontWeight: 300, marginTop: 8 }}>
            Clinical Visits
          </h3>
        </div>
        {isOverdue && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#D97706',
              background: 'rgba(251,191,36,0.12)',
              padding: '4px 10px',
              borderRadius: '2rem',
              border: '1px solid rgba(251,191,36,0.3)',
            }}
          >
            Book soon
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div
          style={{
            padding: '12px 14px',
            background: 'rgba(249,168,212,0.06)',
            borderRadius: '1.2rem',
            border: '1px solid rgba(249,168,212,0.15)',
          }}
        >
          <p style={{ fontSize: 11, color: '#B09099', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('last_visit')}</p>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#1C1014', marginTop: 3 }}>{formatDate(lastVisit)}</p>
          <p style={{ fontSize: 12, color: isOverdue ? '#D97706' : '#059669', marginTop: 2 }}>
            {lastVisit
              ? isOverdue
                ? `⚠️ ${daysSince} days ago — schedule soon`
                : `✓ ${daysSince} days ago — on track`
              : 'No visit logged yet'}
          </p>
        </div>

        <div
          style={{
            padding: '12px 14px',
            background: 'rgba(147,197,253,0.08)',
            borderRadius: '1.2rem',
            border: '1px solid rgba(147,197,253,0.2)',
          }}
        >
          <p style={{ fontSize: 11, color: '#B09099', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {t('next_visit')}
          </p>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#1C1014', marginTop: 3 }}>{formatDate(nextAppointment)}</p>
          {daysUntilNext !== null && daysUntilNext >= 0 && (
            <p style={{ fontSize: 12, color: '#2563EB', marginTop: 2 }}>📅 In {daysUntilNext} days</p>
          )}
          {daysUntilNext !== null && daysUntilNext < 0 && (
            <p style={{ fontSize: 12, color: '#D97706', marginTop: 2 }}>⚠️ Overdue — please reschedule</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── VOICE TRIAGE SCREEN ──────────────────────────────────────────────────────
function VoiceScreen({ onTriageComplete, t, lang }: { onTriageComplete: (data: any) => void; t: (k: string) => string; lang: string }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState(''); // live typing effect
  const [paused, setPaused] = useState(false);        // shows "Continue" button
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = lang === 'en' ? 'en-US' : lang === 'yo' ? 'yo-NG' : lang === 'ig' ? 'ig-NG' : lang === 'ha' ? 'ha-NG' : 'en-US';

    recog.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (final) {
        setTranscript(prev => (prev ? prev + ' ' + final : final));
        setInterimText(''); // clear interim once finalised
      } else {
        setInterimText(interim); // show live typing
      }
    };

    recog.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      isListeningRef.current = false;
      setIsListening(false);
      setInterimText('');
      setPaused(false);
    };

    recog.onend = () => {
      setInterimText('');
      if (isListeningRef.current) {
        // paused due to silence — show "Continue" button instead of auto-restarting
        setIsListening(false);
        setPaused(true);
      }
    };

    setRecognition(recog);

    return () => {
      recog.onend = null;
      recog.stop();
    };
  }, [lang]);

  const startListening = () => {
    if (!recognition) return;
    isListeningRef.current = true;
    setIsListening(true);
    setPaused(false);
    try { recognition.start(); } catch {}
  };

  const stopListening = () => {
    isListeningRef.current = false;
    setPaused(false);
    recognition?.stop();
    setIsListening(false);
    setInterimText('');
  };

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (isListening || paused) {
      stopListening();
    } else {
      startListening();
    }
  };

  const toggleSymptom = (s: string) =>
    setSelected((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const handleSend = async () => {
    const finalInput = transcript.trim() || selected.join(', ');
    if (!finalInput) return;

    stopListening();
    setLoading(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: finalInput, lang }),
      });

      if (!res.ok) throw new Error('Backend error');
      const triageResult = await res.json();
      onTriageComplete(triageResult);
    } catch (err) {
      console.error(err);
      onTriageComplete({
        symptom: finalInput,
        analysis: 'Unable to connect to triage server. Please call your doctor or visit your hospital immediately.',
        urgency: 'caution',
        recommendations: ['Contact your healthcare provider', 'Rest and monitor symptoms'],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      {/* Mic Card */}
      <div
        style={{
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.45)',
          borderRadius: '2.5rem',
          padding: '32px 24px',
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        <h2 style={{ fontSize: 20, fontFamily: "'Playfair Display',serif", fontWeight: 300, marginBottom: 4 }}>
          Voice Triage
        </h2>
        <p style={{ fontSize: 13, color: '#B09099', marginBottom: 28 }}>Tell your garden guide how you feel</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 170, position: 'relative' }}>
          {isListening && (
            <>
              <div
                style={{
                  position: 'absolute',
                  width: 155,
                  height: 155,
                  borderRadius: '50%',
                  border: '2px solid rgba(249,168,212,0.4)',
                  animation: 'pulseRing 1.8s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: 185,
                  height: 185,
                  borderRadius: '50%',
                  border: '1.5px solid rgba(249,168,212,0.2)',
                  animation: 'pulseRing 1.8s ease-in-out 0.4s infinite',
                }}
              />
            </>
          )}
          <button
            onClick={toggleListening}
            style={{
              width: 130,
              height: 130,
              borderRadius: '50%',
              background: isListening ? 'linear-gradient(135deg,#EF4444,#F9A8D4)' : 'linear-gradient(135deg,#F9A8D4,#93C5FD)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s',
              transform: isListening ? 'scale(1.08)' : 'scale(1)',
              animation: isListening ? 'micPulse 1.5s ease-in-out infinite' : 'none',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <SvgIcon paths={ICON_PATHS.mic} size={48} stroke="#fff" strokeWidth={1.5} />
          </button>
        </div>
       </div>
       <p style={{ fontSize: 15, fontStyle: 'italic', color: '#6B5057', marginTop: 12 }}>
  {isListening
    ? "I'm listening...."
    : paused
    ? 'Paused — tap to continue'
    : 'Tap to speak'}
</p>

{/* Continue Speaking button — only shows on pause */}
{paused && (
  <button
    onClick={startListening}
    style={{
      marginTop: 12,
      padding: '10px 24px',
      background: 'linear-gradient(135deg,#F9A8D4,#93C5FD)',
      color: '#fff',
      border: 'none',
      borderRadius: '2rem',
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 13,
      fontWeight: 500,
      cursor: 'pointer',
    }}
  >
    🎙️ Continue Speaking
  </button>
)}

      {/* Transcript Input */}
      <div
        style={{
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.45)',
          borderRadius: '2rem',
          padding: '20px',
          marginBottom: 16,
        }}
      >
        <label style={{ fontSize: 13, fontWeight: 500, color: '#6B5057', display: 'block', marginBottom: 10 }}>
          Your message (click to edit)
        </label>
        <textarea
  value={transcript + (interimText ? ' ' + interimText : '')}
  onChange={(e) => setTranscript(e.target.value)}
  placeholder="Speak or type your symptoms here..."
  style={{
    width: '100%',
    height: 100,
    padding: '12px',
    borderRadius: '1.2rem',
    border: '1.5px solid rgba(252,165,165,0.2)',
    background: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    resize: 'none',
    outline: 'none',
    color: interimText ? '#B09099' : '#1C1014', // grey while interim, dark when final
  }}
/>
      {/* Symptom chips */}
      <div
        style={{
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.45)',
          borderRadius: '2.5rem',
          padding: '24px',
          marginBottom: 16,
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 500, color: '#1C1014', marginBottom: 14 }}>
          Or select your symptoms
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {SYMPTOMS.map((s) => (
            <button
              key={s}
              onClick={() => toggleSymptom(s)}
              style={{
                padding: '8px 14px',
                borderRadius: '2rem',
                fontSize: 13,
                fontFamily: "'DM Sans',sans-serif",
                cursor: 'pointer',
                border: selected.includes(s) ? '1.5px solid #F9A8D4' : '1.5px solid rgba(180,160,170,0.25)',
                background: selected.includes(s) ? 'rgba(249,168,212,0.14)' : 'transparent',
                color: selected.includes(s) ? '#BE185D' : '#6B5057',
                transition: 'all 0.2s',
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={handleSend}
          disabled={(!selected.length && !transcript.trim()) || loading}
          style={{
            width: '100%',
            padding: '13px 20px',
            background: (!selected.length && !transcript.trim()) || loading ? '#E5E7EB' : 'linear-gradient(135deg,#F9A8D4,#93C5FD)',
            color: (!selected.length && !transcript.trim()) || loading ? '#9CA3AF' : '#fff',
            border: 'none',
            borderRadius: '1.4rem',
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 500,
            fontSize: 14,
            cursor: (!selected.length && !transcript.trim()) || loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: (!selected.length && !transcript.trim()) || loading ? 'none' : '0 8px 20px rgba(249,168,212,0.3)',
          }}
        >
          {loading ? 'Assessing…' : 'Get AI Assessment'}
        </button>
      </div>
    </div>
    </div>
  );
  }

// ─── EMERGENCY SCREEN ─────────────────────────────────────────────────────────
function EmergencyScreen({ userData, t }: { userData: UserData; t: (k: string) => string }) {
  const warnings = [
    'Heavy or continuous bleeding',
    'Severe headache with vision changes',
    'Baby not moving for 12+ hours',
    'Severe abdominal pain or cramps',
    'High fever (above 38°C)',
    'Difficulty breathing or chest pain',
  ];

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <div
        style={{
          background: 'linear-gradient(135deg,#BE185D,#EF4444)',
          borderRadius: '2.5rem',
          padding: '36px',
          textAlign: 'center',
          marginBottom: 20,
          color: '#fff',
        }}
      >
        <SvgIcon paths={ICON_PATHS.alert} size={44} stroke="#fff" strokeWidth={1.8} />
        <h2 style={{ fontSize: 26, fontFamily: "'Playfair Display',serif", fontWeight: 300, marginTop: 12 }}>
          Help is near, mama
        </h2>
        <p style={{ opacity: 0.85, fontSize: 14, marginTop: 6 }}>Emergency support is ready for you</p>
      </div>

      <button
        style={{
          width: '100%',
          padding: '18px 24px',
          background: 'linear-gradient(135deg,#EF4444,#EC4899)',
          color: '#fff',
          border: 'none',
          borderRadius: '1.5rem',
          fontFamily: "'DM Sans',sans-serif",
          fontWeight: 600,
          fontSize: 16,
          cursor: 'pointer',
          marginBottom: 12,
          boxShadow: '0 8px 28px rgba(239,68,68,0.35)',
        }}
      >
        📞 {t('emergency_btn')} — 112
      </button>

      <button
        style={{
          width: '100%',
          padding: '16px 24px',
          background: 'linear-gradient(135deg,#7C3AED,#BE185D)',
          color: '#fff',
          border: 'none',
          borderRadius: '1.5rem',
          fontFamily: "'DM Sans',sans-serif",
          fontWeight: 600,
          fontSize: 15,
          cursor: 'pointer',
          marginBottom: 20,
        }}
      >
        🏥 {t('hospital')} — {userData.hospital || 'Your Hospital'}
      </button>

      <div
        style={{
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.45)',
          borderRadius: '2rem',
          padding: '22px',
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 500, color: '#1C1014', marginBottom: 12 }}>
          Warning signs — act now if you have:
        </h3>
        {warnings.map((w, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: i < warnings.length - 1 ? '1px solid rgba(252,165,165,0.1)' : 'none',
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#6B5057' }}>{w}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

type ScreenType = 'home' | 'voice' | 'emergency' | 'triage_result';

function Dashboard({ userData, onUpdate }: { userData: UserData; onUpdate: (patch: Partial<UserData>) => void }) {
  const [screen, setScreen] = useState<ScreenType>('home');
  const [triageData, setTriageData] = useState<any>(null);
  const { t } = useTranslation(userData.lang || 'en');

  const { week } = calcPregnancyInfo(userData.dueDate);

  const addWater = () => {
    const newCount = Math.min((userData.waterCount || 0) + 1, 10);
    onUpdate({ waterCount: newCount });
  };

  const handleNewTriage = () => {
    setTriageData(null);
    setScreen('voice');
  };

  const navItems: { id: ScreenType; label: string; paths: string[] }[] = [
    { id: 'home', label: t('home') || 'Home', paths: ICON_PATHS.home },
    { id: 'voice', label: t('voice') || 'Triage', paths: ICON_PATHS.mic },
    { id: 'emergency', label: t('emergency') || 'Emergency', paths: ICON_PATHS.alert },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans',sans-serif" }}>
      {/* CSS animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes wave { 0%,100%{transform:scaleX(1) translateY(0)} 50%{transform:scaleX(1.04) translateY(-4px)} }
        @keyframes pulseRing { 0%,100%{box-shadow:0 0 0 0 rgba(249,168,212,0.35)} 50%{box-shadow:0 0 0 18px rgba(249,168,212,0)} }
        @keyframes micPulse { 0%,100%{box-shadow:0 0 0 0 rgba(249,168,212,0.4)} 50%{box-shadow:0 0 0 16px rgba(249,168,212,0)} }
        .card-hover:hover { transform:translateY(-4px); box-shadow:0 20px 60px rgba(252,165,165,0.12); }
        .nav-active { background:rgba(255,255,255,0.9); box-shadow:0 4px 20px rgba(252,165,165,0.18); color:#BE185D; }
        
        @media(max-width:767px){
          .sidebar { display:none !important; }
          .bottom-nav { display:flex !important; }
          .content-pad { padding: 20px 16px 90px !important; }
        }
        @media(min-width:768px){
          .sidebar { display:flex !important; width:80px !important; }
          .sidebar-label { display:none !important; }
          .bottom-nav { display:none !important; }
          .bento-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media(min-width:1024px){
          .sidebar { width:256px !important; }
          .sidebar-label { display:block !important; }
          .affirmation { display:block !important; }
          .bento-grid { grid-template-columns: 1fr 1fr 1fr !important; }
        }
      `}</style>

      {/* Decorative blobs */}
      <div style={{ position: 'fixed', width: 480, height: 480, borderRadius: '50%', background: 'rgba(249,168,212,0.08)', filter: 'blur(80px)', top: -100, right: -80, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: 380, height: 380, borderRadius: '50%', background: 'rgba(147,197,253,0.08)', filter: 'blur(80px)', bottom: -60, left: -60, pointerEvents: 'none', zIndex: 0 }} />

      {/* Sidebar */}
      <aside className="sidebar" style={{
        display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(249,168,212,0.15)', position: 'sticky', top: 0, height: '100vh',
        overflowY: 'auto', zIndex: 50, transition: 'width 0.3s ease'
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 16px 16px', borderBottom: '1px solid rgba(249,168,212,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: '1rem', background: 'linear-gradient(135deg,#F9A8D4,#93C5FD)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SvgIcon paths={ICON_PATHS.flower} size={24} stroke="#fff" strokeWidth={2} />
          </div>
          <div className="sidebar-label" style={{ textAlign: 'center', marginTop: 10 }}>
            <h1 style={{ fontSize: 20, fontFamily: "'Playfair Display',serif", fontWeight: 300, color: '#1C1014' }}>MamaAlert</h1>
            <p style={{ fontSize: 10, color: '#F9A8D4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Garden Sanctuary</p>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={screen === item.id ? 'nav-active' : ''}
              onClick={() => setScreen(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: '1.4rem',
                cursor: 'pointer', border: 'none', background: screen === item.id ? undefined : 'transparent',
                fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500,
                color: screen === item.id ? '#BE185D' : '#6B5057', transition: 'all 0.2s', width: '100%', textAlign: 'left'
              }}
            >
              <SvgIcon paths={item.paths} size={20} stroke={screen === item.id ? '#BE185D' : '#6B5057'} strokeWidth={1.8} />
              <span className="sidebar-label nav-label" style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(249,168,212,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px', background: 'rgba(255,255,255,0.6)', borderRadius: '1.4rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '0.8rem', background: 'linear-gradient(135deg,#F9A8D4,#93C5FD)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 13 }}>
              {(userData.name || 'M')[0].toUpperCase()}
            </div>
            <div className="sidebar-label" style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 500, fontSize: 13, color: '#1C1014' }}>{userData.name}</p>
              <p style={{ fontSize: 11, color: '#B09099' }}>Week {week}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        {/* Topbar */}
        <header style={{
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(249,168,212,0.12)',
          padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40
        }}>
          <div>
            <p style={{ fontSize: 12, color: '#F9A8D4', fontWeight: 500 }}>
              {t('welcome')}, {userData.name?.split(' ')[0] || 'Mama'} 🌸
            </p>
            <p style={{ fontSize: 17, fontFamily: "'Playfair Display',serif", fontWeight: 300, fontStyle: 'italic', color: '#1C1014' }}>
              {t('weeks_count')} {week} · Growing beautifully
            </p>
          </div>
        </header>

        {/* Page Content */}
        <div className="content-pad" style={{ flex: 1, padding: '28px 24px 40px', overflowY: 'auto' }}>
          {screen === 'home' && (
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontFamily: "'Playfair Display',serif", fontWeight: 300, color: '#1C1014' }}>{t('journey')}</h2>
                <p style={{ fontSize: 13, color: '#B09099', marginTop: 2 }}>Everything blooming for you today</p>
              </div>
              <div className="bento-grid" style={{ display: 'grid', gap: 20, gridTemplateColumns: '1fr' }}>
                <PregnancyCard dueDate={userData.dueDate} t={t} />
                <HydrationCard count={userData.waterCount || 0} onAdd={addWater} t={t} />
                <NutritionCard t={t} />
                <ClinicalCard lastVisit={userData.lastVisit} nextAppointment={userData.nextAppointment} t={t} />

                {/* Gentle movement */}
                <div
                  className="card-hover"
                  style={{
                    background: 'rgba(255,255,255,0.72)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(249,168,212,0.2)',
                    borderRadius: '2.5rem',
                    padding: '24px',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                  }}
                >
                  <SvgIcon paths={ICON_PATHS.heart} size={26} stroke="#F9A8D4" strokeWidth={1.8} />
                  <h3 style={{ fontSize: 16, fontFamily: "'Playfair Display',serif", fontWeight: 300, marginTop: 10, marginBottom: 6 }}>
                    Gentle Movement
                  </h3>
                  <p style={{ fontSize: 13, color: '#6B5057', lineHeight: 1.7 }}>
                    A slow 10-minute walk or prenatal stretch keeps your body in bloom. Listen to your body, mama.
                  </p>
                  <button
                    style={{
                      marginTop: 14,
                      width: '100%',
                      padding: '11px 20px',
                      background: 'transparent',
                      border: '1.5px solid rgba(249,168,212,0.4)',
                      color: '#BE185D',
                      borderRadius: '1.4rem',
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    Log Gentle Walk
                  </button>
                </div>

                {/* Hospital card */}
                <div
                  className="card-hover"
                  style={{
                    background: 'rgba(255,255,255,0.72)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(147,197,253,0.25)',
                    borderRadius: '2.5rem',
                    padding: '24px',
                    animation: 'float 4s ease-in-out infinite',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                  }}
                >
                  <SvgIcon paths={ICON_PATHS.hospital} size={26} stroke="#60A5FA" strokeWidth={1.8} />
                  <h3 style={{ fontSize: 16, fontFamily: "'Playfair Display',serif", fontWeight: 300, marginTop: 10, marginBottom: 4 }}>
                    Your Hospital
                  </h3>
                  <p style={{ fontSize: 13, color: '#2563EB', fontWeight: 500, marginBottom: 6 }}>{userData.hospital || '—'}</p>
                  <p style={{ fontSize: 12, color: '#B09099' }}>Keep your antenatal card with you at all times.</p>
                  <button
                    style={{
                      marginTop: 14,
                      width: '100%',
                      padding: '11px 20px',
                      background: 'transparent',
                      border: '1.5px solid rgba(147,197,253,0.45)',
                      color: '#2563EB',
                      borderRadius: '1.4rem',
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    📞 Call Hospital
                  </button>
                </div>
              </div>
            </div>
          );
          }

              {screen === 'voice' && (
                  <VoiceScreen 
                onTriageComplete={(resultData) => {
                  setTriageData(resultData);
                  setScreen('triage_result');
            }} 
            t={t}
            lang={userData.lang}
          />
        )}

        {screen === 'emergency' && <EmergencyScreen userData={userData} t={t} />}

        {screen === 'triage_result' && triageData && (
          <TriageResultScreen
            triageData={triageData}
            userData={userData}
            onNewTriage={handleNewTriage}
            onBack={() => setScreen('voice')}
          />
        )}
      </div>
    </main>

      {/* Bottom nav (mobile) */}
      <nav
        className="bottom-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(249,168,212,0.15)',
          padding: '10px 0 18px',
          zIndex: 50,
          display: 'none',
          justifyContent: 'space-around',
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '4px 20px',
              borderRadius: '1.4rem',
              cursor: 'pointer',
              border: 'none',
              background: screen === item.id ? 'rgba(249,168,212,0.08)' : 'transparent',
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 11,
              fontWeight: 500,
              color: screen === item.id ? '#BE185D' : '#B09099',
              transition: 'all 0.2s',
            }}
          >
            <SvgIcon paths={item.paths} size={22} stroke={screen === item.id ? '#BE185D' : '#B09099'} strokeWidth={1.8} />
            <span>{item.label}</span>
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: screen === item.id ? '#BE185D' : 'transparent',
                marginTop: 1,
              }}
            />
          </button>
        ))}
      </nav>
    </div>
  );
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
export default function MamaAlert() {
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mama_alert_user');
      if (saved) {
        const parsed: UserData = JSON.parse(saved);
        if (parsed.onboardingComplete) setUserData(parsed);
      }
    } catch {
      // localStorage unavailable — user will go through onboarding fresh
    }
    setMounted(true);
  }, []);

  const handleOnboardingComplete = (data: Omit<UserData, 'waterCount' | 'onboardingComplete'>) => {
    const full: UserData = { ...data, waterCount: 0, onboardingComplete: true };
    try {
      localStorage.setItem('mama_alert_user', JSON.stringify(full));
    } catch {}
    setUserData(full);
  };

  const handleUpdate = (patch: Partial<UserData>) => {
    if (!userData) return;
    const updated = { ...userData, ...patch };
    try {
      localStorage.setItem('mama_alert_user', JSON.stringify(updated));
    } catch {}
    setUserData(updated);
  };

  if (!mounted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFF5F5',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '2.5px solid #F9A8D4',
            borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!userData) return <Onboarding onComplete={handleOnboardingComplete} />;

  return <Dashboard userData={userData} onUpdate={handleUpdate} />;
}