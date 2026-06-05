'use client';

import React, { useEffect, useState } from 'react';
import translationsData from '../translation.json';

const translations = translationsData as Record<string, Record<string, string>>;

function useTranslation(lang: string) {
  const t = (key: string) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };
  return { t };
}

// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface UserData {
    name: string;
    phone: string;
    lang: 'en' | 'yo' | 'ig' | 'ha' | 'pcm';
    dueDate: string;
    hospital: string;
    location: string;
    city: string;
    state: string;
    lastVisit: string;
    nextAppointment: string;
    waterCount: number;
    onboardingComplete: boolean;
  }

export interface IconProps {
  paths: string | string[];
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
export const HOSPITALS = [
  'Lagos University Teaching Hospital',
  'National Hospital Abuja',
  'UCH Ibadan',
  'UNTH Enugu',
  'Aminu Kano Teaching Hospital',
  'Federal Medical Centre',
  'Other',
];

const REGION_HOSPITALS: Record<string, string[]> = {
  Lagos: ['Lagos University Teaching Hospital', 'Federal Medical Centre'],
  Abuja: ['National Hospital Abuja', 'Federal Medical Centre'],
  FCT: ['National Hospital Abuja', 'Federal Medical Centre'],
  Ibadan: ['UCH Ibadan', 'Federal Medical Centre'],
  Oyo: ['UCH Ibadan', 'Federal Medical Centre'],
  Enugu: ['UNTH Enugu', 'Federal Medical Centre'],
  Kano: ['Aminu Kano Teaching Hospital', 'Federal Medical Centre'],
};

const LAST_VISIT_OPTIONS = [
  { id: 'this_week', label: 'This week', sub: 'Had a check-up recently', daysAgo: 4 },
  { id: 'two_weeks', label: 'About 2 weeks ago', sub: 'Typical antenatal gap', daysAgo: 14 },
  { id: 'last_month', label: 'About a month ago', sub: 'Due for another visit soon', daysAgo: 30 },
  { id: 'over_month', label: 'Over a month ago', sub: 'We\'ll remind you to book', daysAgo: 45 },
  { id: 'first_visit', label: 'Not yet / first visit', sub: 'We\'ll help you get started', daysAgo: null },
] as const;

const NEXT_APPOINTMENT_OPTIONS = [
  { id: 'next_week', label: 'Next week', sub: 'Coming up soon', daysAhead: 7 },
  { id: 'two_weeks', label: 'In 2 weeks', sub: 'Standard follow-up', daysAhead: 14 },
  { id: 'four_weeks', label: 'In 4 weeks', sub: 'Monthly check-in', daysAhead: 28 },
  { id: 'six_weeks', label: 'In 6 weeks', sub: 'Plenty of time', daysAhead: 42 },
  { id: 'not_scheduled', label: 'Not scheduled yet', sub: 'We\'ll nudge you to book', daysAhead: null },
] as const;

function toDateString(date: Date) {
  return date.toISOString().split('T')[0];
}

function daysAgoToDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return toDateString(d);
}

function daysAheadToDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toDateString(d);
}

function hospitalsForArea(city: string, state: string) {
  const matches = new Set<string>();
  for (const key of [city, state]) {
    if (!key) continue;
    for (const [region, list] of Object.entries(REGION_HOSPITALS)) {
      if (region.toLowerCase() === key.toLowerCase()) {
        list.forEach((h) => matches.add(h));
      }
    }
  }
  const suggested = matches.size ? [...matches] : [...HOSPITALS.filter((h) => h !== 'Other')];
  return [...suggested, 'Other'];
}

async function reverseGeocode(lat: number, lon: number) {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
  );
  if (!res.ok) throw new Error('Geocode failed');
  const data = await res.json();
  const city = data.city || data.locality || '';
  const state = data.principalSubdivision || '';
  const country = data.countryName || '';
  const location = [city, state !== city ? state : '', country !== 'Nigeria' ? country : '']
    .filter(Boolean)
    .join(', ');
  return { city, state, location: location || 'Nigeria' };
}

export const LANGS = [
  { id: 'en' as const, label: 'English', sub: 'Default language' },
  { id: 'yo' as const, label: 'Yorùbá', sub: 'Yoruba language' },
  { id: 'ig' as const, label: 'Igbo', sub: 'Igbo language' },
  { id: 'ha' as const, label: 'Hausa', sub: 'Hausa language' },
  { id: 'pcm' as const, label: 'Nigerian Pidgin', sub: 'Pidgin English' },
];

export const ICON_PATHS = {
  home: ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'],
  mic: [
    'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z',
    'M19 10v2a7 7 0 0 1-14 0v-2',
    'M12 19v4',
    'M8 23h8',
  ],
  alert: [
    'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
    'M12 9v4',
    'M12 17h.01',
  ],
  flower: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  droplet: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z',
  leaf: [
    'M2 22c1.25-2 2.85-3.5 5-4.5C9.17 16.5 11.44 16 14 16c2.55 0 4.82.5 7 1.5',
    'M2 22C2 12 6 6 12 2c6 4 10 10 10 20',
  ],
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  hospital: ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 14h6', 'M12 11v6'],
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92',
};

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
export function SvgIcon({ paths, size = 20, stroke = '#6B5057', strokeWidth = 1.8, className = '' }: IconProps) {
  const pathArr = Array.isArray(paths) ? paths : [paths];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {pathArr.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
interface OnboardingProps {
  onComplete: (data: Omit<UserData, 'waterCount' | 'onboardingComplete'>) => void;
  initialData?: Partial<Omit<UserData, 'waterCount' | 'onboardingComplete'>>;
}

export default function Onboarding({ onComplete, initialData }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    lang: (initialData?.lang || 'en') as 'en' | 'yo' | 'ig' | 'ha' | 'pcm',
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    dueDate: initialData?.dueDate || '',
    hospital: initialData?.hospital || '',
    location: initialData?.location || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    lastVisit: initialData?.lastVisit || '',
    nextAppointment: initialData?.nextAppointment || '',
  });
  const [lastVisitChoice, setLastVisitChoice] = useState<string | null>(null);
  const [nextAppointmentChoice, setNextAppointmentChoice] = useState<string | null>(null);
  const [customLastVisit, setCustomLastVisit] = useState(false);
  const [customNextAppointment, setCustomNextAppointment] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const { t } = useTranslation(form.lang);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const nearbyHospitals = hospitalsForArea(form.city, form.state);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { city, state, location } = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          setForm((p) => ({
            ...p,
            city,
            state,
            location,
            hospital: p.hospital || hospitalsForArea(city, state)[0] || '',
          }));
          setLocationStatus('done');
        } catch {
          setLocationStatus('error');
        }
      },
      () => setLocationStatus('error'),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (step === 2 && locationStatus === 'idle' && !form.location) {
      detectLocation();
    }
  }, [step]);

  const pickLastVisit = (option: (typeof LAST_VISIT_OPTIONS)[number]) => {
    setLastVisitChoice(option.id);
    setCustomLastVisit(false);
    set('lastVisit', option.daysAgo === null ? '' : daysAgoToDate(option.daysAgo));
  };

  const pickNextAppointment = (option: (typeof NEXT_APPOINTMENT_OPTIONS)[number]) => {
    setNextAppointmentChoice(option.id);
    setCustomNextAppointment(false);
    set('nextAppointment', option.daysAhead === null ? '' : daysAheadToDate(option.daysAhead));
  };

  const canNext = [
    form.lang !== undefined && form.lang !== null,
    form.name.trim().length > 1 && form.phone.trim().length > 7,
    form.dueDate !== '',
  ][step];

  const next = () => {
    if (step < 2) setStep((s) => s + 1);
    else onComplete(form);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'linear-gradient(135deg, #FFF5F5 0%, #EBF8FF 50%, #F0FFF4 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        .input-field { width:100%; padding:14px 18px; border:1.5px solid rgba(252,165,165,0.3); border-radius:1.2rem; font-family:'DM Sans',sans-serif; font-size:14px; background:rgba(255,255,255,0.7); color:#1C1014; outline:none; transition: border-color 0.2s, box-shadow 0.2s; }
        .input-field:focus { border-color:#F9A8D4; box-shadow:0 0 0 4px rgba(249,168,212,0.15); }
        .input-field::placeholder { color:#B09099; }
        .btn-primary { cursor:pointer; font-family:'DM Sans',sans-serif; font-weight:500; width:100%; padding:14px 24px; background:linear-gradient(135deg,#F9A8D4,#93C5FD); color:#fff; border:none; border-radius:1.5rem; font-size:15px; transition:all 0.2s; }
        .btn-primary:hover { opacity:0.9; box-shadow:0 8px 24px rgba(249,168,212,0.4); }
        .btn-primary:active { transform:scale(0.97); }
        .btn-primary:disabled { opacity:0.5; cursor:not-allowed; }
        .btn-outline { cursor:pointer; font-family:'DM Sans',sans-serif; font-weight:400; width:100%; padding:12px 24px; background:transparent; color:#6B5057; border:1.5px solid rgba(252,165,165,0.4); border-radius:1.5rem; font-size:14px; transition:all 0.2s; margin-top:10px; }
        .btn-outline:hover { background:rgba(252,165,165,0.06); }
        .lang-btn { width:100%; padding:16px 20px; border:1.5px solid rgba(252,165,165,0.25); border-radius:1.5rem; background:transparent; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:15px; color:#1C1014; transition:all 0.2s; text-align:left; display:flex; flex-direction:column; gap:3px; }
        .lang-btn:hover { background:rgba(249,168,212,0.07); border-color:#F9A8D4; }
        .lang-btn.selected { background:linear-gradient(135deg,rgba(249,168,212,0.14),rgba(147,197,253,0.14)); border-color:#F9A8D4; box-shadow:0 4px 16px rgba(249,168,212,0.2); }
        .step-dot { width:8px; height:8px; border-radius:999px; background:rgba(252,165,165,0.3); transition:all 0.3s; }
        .step-dot.active { background:#F9A8D4; width:24px; border-radius:4px; }
        .step-dot.done { background:#6EE7B7; }
        .chip-btn { width:100%; padding:14px 16px; border:1.5px solid rgba(252,165,165,0.25); border-radius:1.2rem; background:rgba(255,255,255,0.6); cursor:pointer; font-family:'DM Sans',sans-serif; text-align:left; transition:all 0.2s; display:flex; flex-direction:column; gap:2px; }
        .chip-btn:hover { border-color:#F9A8D4; background:rgba(249,168,212,0.06); }
        .chip-btn.selected { border-color:#F9A8D4; background:linear-gradient(135deg,rgba(249,168,212,0.14),rgba(147,197,253,0.12)); box-shadow:0 4px 16px rgba(249,168,212,0.15); }
        .chip-btn span:first-child { font-size:14px; font-weight:500; color:#1C1014; }
        .chip-btn span:last-child { font-size:12px; color:#B09099; }
        .location-banner { display:flex; align-items:center; gap:12px; padding:14px 16px; border-radius:1.2rem; border:1.5px solid rgba(147,197,253,0.35); background:linear-gradient(135deg,rgba(249,168,212,0.1),rgba(147,197,253,0.12)); margin-bottom:16px; }
        .visit-card { padding:16px; border-radius:1.4rem; border:1.5px solid rgba(252,165,165,0.2); background:rgba(255,255,255,0.55); }
        .visit-card h3 { font-size:14px; font-weight:500; color:#6B5057; margin:0 0 4px; display:flex; align-items:center; gap:8px; }
        .visit-card p.hint { font-size:12px; color:#B09099; margin:0 0 12px; }
        .link-btn { background:none; border:none; padding:0; font-family:'DM Sans',sans-serif; font-size:12px; color:#BE185D; cursor:pointer; text-decoration:underline; margin-top:8px; }
      `}</style>

      <div
        style={{
          width: '100%',
          maxWidth: step === 2 ? 500 : 460,
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255,255,255,0.6)',
          borderRadius: '3rem',
          padding: '44px 36px',
          boxShadow: '0 32px 80px rgba(252,165,165,0.14)',
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '1.2rem',
              background: 'linear-gradient(135deg,#F9A8D4,#93C5FD)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <SvgIcon paths={ICON_PATHS.flower} size={28} stroke="#fff" strokeWidth={2} />
          </div>
          <h1
            style={{
              fontSize: 28,
              fontFamily: "'Playfair Display', serif",
              fontWeight: 300,
              color: '#1C1014',
              letterSpacing: '-0.02em',
            }}
          >
            MamaAlert
          </h1>
          <p style={{ color: '#B09099', fontSize: 13, marginTop: 4 }}>Your garden of care begins here</p>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 32 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
          ))}
        </div>

        {/* Step 0 */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 22, fontFamily: "'Playfair Display',serif", fontWeight: 300, marginBottom: 6 }}>
              Choose your language
            </h2>
            <p style={{ color: '#B09099', fontSize: 13, marginBottom: 20 }}>We&apos;ll personalise your experience</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  className={`lang-btn ${form.lang === l.id ? 'selected' : ''}`}
                  onClick={() => set('lang', l.id)}
                >
                  <span style={{ fontWeight: 500 }}>{l.label}</span>
                  <span style={{ fontSize: 12, color: '#B09099' }}>{l.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 22, fontFamily: "'Playfair Display',serif", fontWeight: 300, marginBottom: 6 }}>
              Your profile
            </h2>
            <p style={{ color: '#B09099', fontSize: 13, marginBottom: 20 }}>Just the basics, beautiful mama</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#6B5057', display: 'block', marginBottom: 6 }}>
                  Your name
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. Adaeze"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#6B5057', display: 'block', marginBottom: 6 }}>
                  Phone number
                </label>
                <input
                  className="input-field"
                  type="tel"
                  placeholder="08012345678"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 22, fontFamily: "'Playfair Display',serif", fontWeight: 300, marginBottom: 6 }}>
              Pregnancy details
            </h2>
            <p style={{ color: '#B09099', fontSize: 13, marginBottom: 20 }}>Help us track your beautiful journey</p>

            <div className="location-banner">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '1rem',
                  background: 'linear-gradient(135deg,#F9A8D4,#93C5FD)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <SvgIcon paths={ICON_PATHS.hospital} size={20} stroke="#fff" strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, color: '#B09099', margin: 0 }}>Your area</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#1C1014', margin: '2px 0 0' }}>
                  {locationStatus === 'loading' && 'Finding your location…'}
                  {locationStatus === 'done' && form.location && `📍 ${form.location}`}
                  {locationStatus === 'error' && 'Could not detect location'}
                  {locationStatus === 'idle' && !form.location && 'Tap to share your location'}
                </p>
              </div>
              {(locationStatus === 'error' || (locationStatus === 'done' && form.location)) && (
                <button
                  type="button"
                  onClick={detectLocation}
                  className="link-btn"
                  style={{ marginTop: 0, flexShrink: 0 }}
                >
                  {locationStatus === 'error' ? 'Retry' : 'Refresh'}
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#6B5057', display: 'block', marginBottom: 6 }}>
                  Estimated due date
                </label>
                <input
                  className="input-field"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => set('dueDate', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#6B5057', display: 'block', marginBottom: 6 }}>
                  {form.location ? 'Hospitals near you' : t('hospital')}
                </label>
                <select
                  className="input-field"
                  value={form.hospital}
                  onChange={(e) => set('hospital', e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Select hospital…</option>
                  {nearbyHospitals.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div className="visit-card">
                <h3>
                  <SvgIcon paths={ICON_PATHS.hospital} size={16} stroke="#F9A8D4" />
                  {t('last_visit')}
                </h3>
                <p className="hint">When did you last see your doctor or midwife?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {LAST_VISIT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`chip-btn ${lastVisitChoice === option.id ? 'selected' : ''}`}
                      onClick={() => pickLastVisit(option)}
                    >
                      <span>{option.label}</span>
                      <span>{option.sub}</span>
                    </button>
                  ))}
                </div>
                {!customLastVisit ? (
                  <button type="button" className="link-btn" onClick={() => setCustomLastVisit(true)}>
                    I know the exact date
                  </button>
                ) : (
                  <div style={{ marginTop: 10 }}>
                    <input
                      className="input-field"
                      type="date"
                      value={form.lastVisit}
                      onChange={(e) => {
                        setLastVisitChoice(null);
                        set('lastVisit', e.target.value);
                      }}
                    />
                    <button type="button" className="link-btn" onClick={() => setCustomLastVisit(false)}>
                      Use quick options instead
                    </button>
                  </div>
                )}
              </div>

              <div className="visit-card">
                <h3>
                  <SvgIcon paths={ICON_PATHS.hospital} size={16} stroke="#93C5FD" />
                  {t('next_visit')}
                </h3>
                <p className="hint">When is your next antenatal appointment?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {NEXT_APPOINTMENT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`chip-btn ${nextAppointmentChoice === option.id ? 'selected' : ''}`}
                      onClick={() => pickNextAppointment(option)}
                    >
                      <span>{option.label}</span>
                      <span>{option.sub}</span>
                    </button>
                  ))}
                </div>
                {!customNextAppointment ? (
                  <button type="button" className="link-btn" onClick={() => setCustomNextAppointment(true)}>
                    I have a specific date
                  </button>
                ) : (
                  <div style={{ marginTop: 10 }}>
                    <input
                      className="input-field"
                      type="date"
                      value={form.nextAppointment}
                      onChange={(e) => {
                        setNextAppointmentChoice(null);
                        set('nextAppointment', e.target.value);
                      }}
                    />
                    <button type="button" className="link-btn" onClick={() => setCustomNextAppointment(false)}>
                      Use quick options instead
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <button className="btn-primary" onClick={next} disabled={!canNext}>
            {step < 2 ? 'Continue →' : 'Enter My Garden 🌸'}
          </button>
          {step > 0 && (
            <button className="btn-outline" onClick={() => setStep((s) => s - 1)}>
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}