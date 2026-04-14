'use client';

import React, { useState, useRef, useEffect } from 'react';

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type Screen = 'home' | 'voice' | 'emergency';

interface Hospital {
  name: string;
  distance: string;
  phone: string;
}

const HOSPITALS: Hospital[] = [
  { name: 'Lagos Island Maternity', distance: '1.8 km away', phone: '(+234) 1-261-4403' },
  { name: 'UCH Ibadan',             distance: '2.3 km away', phone: '(+234) 2-241-0000' },
  { name: 'Asokoro Hospital',       distance: '3.1 km away', phone: '(+234) 8-9900-0000' },
];

/* ─────────────────────────────────────────
   Inline styles (no Tailwind dependency)
───────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --rose: #e8687a;
    --rose-light: #fce8ec;
    --rose-mid: #f4c0c8;
    --rose-dark: #c04058;
    --cream: #fdf6f0;
    --petal: #f9d4db;
    --text: #3d1f28;
    --muted: #a07080;
    --hint: #c0a0b0;
    --green: #6aaa78;
    --green-bg: #dcf0e0;
    --green-dark: #2d5438;
    --serif: 'Cormorant Garamond', serif;
    --sans: 'DM Sans', sans-serif;
  }

  .ma-root { font-family: var(--sans); background: var(--cream); }

  /* ── DESKTOP LAYOUT ── */
  .ma-desktop {
    display: grid;
    grid-template-columns: 220px 1fr 300px;
    grid-template-rows: auto 1fr;
    min-height: 100vh;
  }

  /* Topbar */
  .ma-topbar {
    grid-column: 1 / -1;
    background: #fff;
    border-bottom: 1px solid rgba(232,104,122,0.15);
    display: flex;
    align-items: center;
    padding: 0 1.25rem;
    gap: 10px;
    min-height: 56px;
  }
  .ma-logo {
    font-family: var(--serif);
    font-size: 19px;
    font-weight: 600;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 7px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .ma-logo-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--rose);
    display: inline-block;
  }
  .ma-topnav {
    display: flex;
    gap: 3px;
    background: rgba(253,246,240,0.9);
    border: 1px solid rgba(232,104,122,0.15);
    border-radius: 50px;
    padding: 4px;
    margin: 0 auto;
    flex-shrink: 1;
    min-width: 0;
  }
  .ma-topnav-btn {
    padding: 6px 14px;
    border: none;
    border-radius: 50px;
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 400;
    color: var(--muted);
    background: transparent;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .ma-topnav-btn.active { background: var(--rose); color: #fff; font-weight: 500; }
  .ma-topbar-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .ma-week-badge {
    background: var(--rose-light);
    border-radius: 50px;
    padding: 4px 10px;
    font-size: 11px;
    color: var(--rose-dark);
    font-weight: 500;
    white-space: nowrap;
  }
  .ma-avatar {
    width: 30px; height: 30px;
    border-radius: 50%;
    background: var(--petal);
    border: 1.5px solid var(--rose-mid);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 500;
    color: var(--rose-dark);
    flex-shrink: 0;
  }

  /* Sidebar */
  .ma-sidebar {
    background: #fff;
    border-right: 1px solid rgba(232,104,122,0.12);
    padding: 1.25rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .ma-slabel {
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--hint);
    font-weight: 500;
    margin-bottom: 3px;
  }
  .ma-sitem {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px 9px;
    border-radius: 9px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .ma-sitem:hover, .ma-sitem.active { background: var(--rose-light); }
  .ma-sitem span { font-size: 12px; color: var(--text); font-weight: 400; }
  .ma-sitem.active span { color: var(--rose-dark); font-weight: 500; }
  .ma-sidebar-profile {
    margin-top: auto;
    background: var(--petal);
    border-radius: 12px;
    padding: 0.9rem;
    text-align: center;
  }
  .ma-profile-av {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: var(--rose-light);
    border: 2px solid var(--rose-mid);
    margin: 0 auto 7px;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--serif);
    font-size: 15px;
    color: var(--rose-dark);
  }
  .ma-sidebar-profile h4 { font-family: var(--serif); font-size: 14px; color: var(--text); }
  .ma-sidebar-profile p  { font-size: 11px; color: var(--muted); font-weight: 300; margin-top: 1px; }

  /* Main content */
  .ma-main {
    padding: 1.5rem 1.75rem;
    overflow-y: auto;
    background: var(--cream);
  }
  .ma-page-title { font-family: var(--serif); font-size: 26px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
  .ma-page-sub   { font-size: 12px; color: var(--muted); font-weight: 300; margin-bottom: 1.25rem; }

  .ma-stats-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 1.1rem; }
  .ma-stat-card  { background: #fff; border: 1px solid rgba(232,104,122,0.15); border-radius: 14px; padding: 1rem; }
  .ma-stat-lbl   { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--hint); margin-bottom: 5px; font-weight: 500; }
  .ma-stat-val   { font-family: var(--serif); font-size: 24px; font-weight: 600; color: var(--text); }
  .ma-stat-sub   { font-size: 11px; color: var(--muted); font-weight: 300; margin-top: 2px; }

  .ma-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 1.1rem; }
  .ma-card    { background: #fff; border: 1px solid rgba(232,104,122,0.15); border-radius: 14px; padding: 1.1rem; }
  .ma-clabel  { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--hint); margin-bottom: 8px; font-weight: 500; }

  .ma-prw       { display: flex; align-items: center; gap: 0.85rem; }
  .ma-prt h3    { font-family: var(--serif); font-size: 26px; font-weight: 600; color: var(--text); }
  .ma-prt p     { font-size: 11px; color: var(--muted); font-weight: 300; }
  .ma-badge     { display: inline-block; background: var(--rose-light); color: var(--rose-dark); font-size: 10px; font-weight: 500; padding: 2px 9px; border-radius: 50px; margin-top: 4px; }

  .ma-rkrow     { display: flex; align-items: center; gap: 10px; }
  .ma-orb       { width: 40px; height: 40px; border-radius: 50%; background: var(--green-bg); border: 2px solid var(--green); display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; }
  .ma-orb::before { content: ''; position: absolute; inset: 6px; background: rgba(106,170,120,0.5); border-radius: 50%; }
  .ma-rktxt h4  { font-family: var(--serif); font-size: 17px; color: var(--green-dark); }
  .ma-rktxt p   { font-size: 11px; color: var(--green); font-weight: 300; }

  .ma-tips-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 9px; margin-bottom: 1.1rem; }
  .ma-tip-card  { background: #fff; border: 1px solid rgba(232,104,122,0.12); border-radius: 12px; padding: 0.9rem; }
  .ma-tip-icon  { width: 28px; height: 28px; border-radius: 50%; background: var(--rose-light); display: flex; align-items: center; justify-content: center; margin-bottom: 7px; }
  .ma-tip-card h5 { font-size: 12px; font-weight: 500; color: var(--text); margin-bottom: 2px; }
  .ma-tip-card p  { font-size: 11px; color: var(--muted); font-weight: 300; line-height: 1.5; }

  /* Voice desktop */
  .ma-voice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  .ma-mic-area   { display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fff; border: 1px solid rgba(232,104,122,0.15); border-radius: 18px; padding: 2rem 1.25rem; gap: 1rem; }
  .ma-mic-btn    { border-radius: 50%; border: 2px solid rgba(232,104,122,0.3); background: var(--rose-light); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
  .ma-mic-btn.on { border-color: var(--rose); box-shadow: 0 0 0 10px rgba(232,104,122,0.1); }
  .ma-waveform   { display: flex; align-items: center; gap: 3px; }
  .ma-wv-bar     { border-radius: 2px; background: var(--rose-mid); transition: height 0.08s; }
  .ma-vinfo      { background: #fff; border: 1px solid rgba(232,104,122,0.15); border-radius: 18px; padding: 1.5rem; }
  .ma-vinfo h3   { font-family: var(--serif); font-size: 20px; color: var(--text); margin-bottom: 7px; }
  .ma-vinfo p    { font-size: 12px; color: var(--muted); font-weight: 300; line-height: 1.6; margin-bottom: 0.9rem; }
  .ma-chips      { display: flex; gap: 7px; flex-wrap: wrap; }
  .ma-chip       { padding: 4px 11px; border-radius: 50px; background: var(--rose-light); color: var(--rose-dark); font-size: 10px; font-weight: 500; }

  /* Emergency desktop */
  .ma-emg-top  { background: linear-gradient(135deg,#f9d4db,#fce8dd); border-radius: 18px; padding: 1.5rem; margin-bottom: 1.1rem; display: flex; align-items: center; gap: 1.25rem; }
  .ma-emg-top h2 { font-family: var(--serif); font-size: 23px; font-weight: 600; color: var(--text); }
  .ma-emg-top p  { font-size: 12px; color: var(--muted); font-weight: 300; margin-top: 3px; }
  .ma-hosp-grid  { display: grid; grid-template-columns: repeat(3,1fr); gap: 9px; }
  .ma-hcard      { background: #fff; border: 1px solid rgba(232,104,122,0.15); border-radius: 13px; padding: 0.9rem; cursor: pointer; transition: all 0.15s; }
  .ma-hcard:hover { background: var(--rose-light); }
  .ma-hcard .hn  { font-size: 12px; font-weight: 500; color: var(--text); margin-bottom: 2px; }
  .ma-hcard .hd  { font-size: 11px; color: var(--muted); font-weight: 300; }
  .ma-hcard .hp  { font-size: 11px; color: var(--rose); font-weight: 500; margin-top: 5px; }

  /* Right panel */
  .ma-right-panel { background: #fff; border-left: 1px solid rgba(232,104,122,0.12); padding: 1.25rem 1rem; display: flex; flex-direction: column; gap: 0.85rem; }
  .ma-rp-title    { font-family: var(--serif); font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 7px; }
  .ma-hrow        { display: flex; align-items: flex-start; gap: 9px; background: var(--cream); border-radius: 10px; padding: 9px 10px; cursor: pointer; transition: all 0.15s; }
  .ma-hrow:hover  { background: var(--rose-light); }
  .ma-hpin        { width: 27px; height: 27px; border-radius: 50%; background: var(--rose-light); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .ma-hrow .hn    { font-size: 12px; font-weight: 500; color: var(--text); }
  .ma-hrow .hd    { font-size: 11px; color: var(--muted); font-weight: 300; }
  .ma-hrow .hp    { font-size: 11px; color: var(--rose); font-weight: 500; margin-top: 2px; }
  .ma-rem-card    { background: var(--petal); border-radius: 12px; padding: 0.9rem; }
  .ma-rem-card h5 { font-family: var(--serif); font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
  .ma-rem-card p  { font-size: 11px; color: var(--muted); font-weight: 300; line-height: 1.5; }
  .ma-rem-date    { font-size: 11px; font-weight: 500; color: var(--rose-dark); margin-top: 5px; }

  /* Shared buttons */
  .ma-btn-rose {
    padding: 10px 20px;
    background: var(--rose);
    color: #fff;
    border: none;
    border-radius: 50px;
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .ma-btn-rose:hover { background: var(--rose-dark); }
  .ma-btn-ghost {
    padding: 9px 18px;
    border: 1px solid rgba(232,104,122,0.3);
    background: transparent;
    border-radius: 50px;
    font-family: var(--sans);
    font-size: 12px;
    color: var(--muted);
    cursor: pointer;
  }
  .ma-btn-emg {
    width: 100%;
    padding: 13px;
    background: var(--rose-dark);
    color: #fff;
    border: none;
    border-radius: 50px;
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 1rem;
  }

  /* ── MOBILE LAYOUT ── */
  .ma-mobile { background: var(--cream); min-height: 100vh; padding: 0.9rem; }

  .ma-mob-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.1rem;
  }
  .ma-mob-logo {
    font-family: var(--serif);
    font-size: 17px;
    font-weight: 600;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .ma-mob-tabs {
    display: flex;
    gap: 4px;
    background: rgba(255,255,255,0.7);
    border: 1px solid rgba(232,104,122,0.2);
    border-radius: 50px;
    padding: 3px;
  }
  .ma-mob-tab {
    flex: 1;
    padding: 5px 12px;
    border: none;
    background: transparent;
    border-radius: 50px;
    font-family: var(--sans);
    font-size: 11px;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .ma-mob-tab.active { background: var(--rose); color: #fff; font-weight: 500; }

  /* Hero band */
  .ma-hero {
    background: linear-gradient(135deg,#f9d4db,#fce8dd);
    border-radius: 17px;
    padding: 1.1rem;
    margin-bottom: 0.8rem;
    position: relative;
    overflow: hidden;
  }
  .ma-hero::after {
    content: '';
    position: absolute;
    right: -12px; top: -12px;
    width: 90px; height: 90px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cg opacity='0.2'%3E%3Ccircle cx='50' cy='50' r='10' fill='%23e8687a'/%3E%3Cellipse cx='50' cy='36' rx='6' ry='12' fill='%23e8687a'/%3E%3Cellipse cx='64' cy='43' rx='6' ry='12' transform='rotate(60 64 43)' fill='%23e8687a'/%3E%3Cellipse cx='64' cy='57' rx='6' ry='12' transform='rotate(120 64 57)' fill='%23e8687a'/%3E%3Cellipse cx='50' cy='64' rx='6' ry='12' fill='%23e8687a'/%3E%3Cellipse cx='36' cy='57' rx='6' ry='12' transform='rotate(60 36 57)' fill='%23e8687a'/%3E%3Cellipse cx='36' cy='43' rx='6' ry='12' transform='rotate(120 36 43)' fill='%23e8687a'/%3E%3C/g%3E%3C/svg%3E") no-repeat center;
    pointer-events: none;
  }
  .ma-greet  { font-family: var(--serif); font-style: italic; font-size: 11px; color: var(--rose-dark); margin-bottom: 2px; }
  .ma-htitle { font-family: var(--serif); font-size: 21px; font-weight: 600; color: var(--text); line-height: 1.2; }
  .ma-hsub   { font-size: 11px; color: var(--muted); font-weight: 300; margin-top: 3px; }
  .ma-wpill  { display: inline-flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.7); border: 1px solid rgba(232,104,122,0.2); border-radius: 50px; padding: 3px 9px; margin-top: 8px; font-size: 10px; color: var(--rose-dark); font-weight: 500; }
  .ma-wdot   { width: 5px; height: 5px; border-radius: 50%; background: var(--rose); display: inline-block; }

  .ma-card-m    { background: rgba(255,255,255,0.8); border: 1px solid rgba(255,200,210,0.4); border-radius: 14px; padding: 0.9rem; margin-bottom: 0.75rem; }
  .ma-prw-m     { display: flex; align-items: center; gap: 0.8rem; }
  .ma-prt-m h3  { font-family: var(--serif); font-size: 22px; font-weight: 600; color: var(--text); }
  .ma-prt-m p   { font-size: 11px; color: var(--muted); font-weight: 300; }
  .ma-tbdg      { display: inline-block; background: var(--rose-light); color: var(--rose-dark); font-size: 10px; font-weight: 500; padding: 2px 8px; border-radius: 50px; margin-top: 3px; }
  .ma-rkrow-m   { display: flex; align-items: center; gap: 9px; }
  .ma-orb-m     { width: 36px; height: 36px; border-radius: 50%; background: var(--green-bg); border: 2px solid var(--green); display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; }
  .ma-orb-m::before { content: ''; position: absolute; inset: 5px; background: rgba(106,170,120,0.5); border-radius: 50%; }
  .ma-rktxt-m h4 { font-family: var(--serif); font-size: 15px; color: var(--green-dark); }
  .ma-rktxt-m p  { font-size: 11px; color: var(--green); font-weight: 300; }
  .ma-btn-full   { width: 100%; padding: 12px; background: var(--rose); color: #fff; border: none; border-radius: 50px; font-family: var(--sans); font-size: 13px; font-weight: 500; cursor: pointer; margin-bottom: 0.65rem; transition: all 0.15s; }
  .ma-footer-note { text-align: center; font-size: 10px; color: var(--hint); font-weight: 300; letter-spacing: 0.03em; }

  /* Mobile voice */
  .ma-mc       { display: flex; flex-direction: column; align-items: center; text-align: center; }
  .ma-mbtn     { border-radius: 50%; border: 2px solid rgba(232,104,122,0.3); background: rgba(255,255,255,0.85); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; margin-bottom: 0.9rem; }
  .ma-mbtn.on  { border-color: var(--rose); background: var(--rose-light); box-shadow: 0 0 0 9px rgba(232,104,122,0.1); }
  .ma-vcap     { background: rgba(255,255,255,0.8); border: 1px solid rgba(255,200,210,0.4); border-radius: 14px; padding: 0.9rem 1rem; width: 100%; margin-bottom: 0.9rem; }
  .ma-vcap p   { font-family: var(--serif); font-size: 14px; color: var(--text); line-height: 1.4; }
  .ma-vcap small { display: block; margin-top: 4px; font-size: 11px; color: var(--muted); font-weight: 300; }
  .ma-brow     { display: flex; gap: 7px; width: 100%; }
  .ma-bsoft    { flex: 1; padding: 9px; border-radius: 50px; background: var(--rose-light); color: var(--rose-dark); border: 1px solid rgba(232,104,122,0.25); font-family: var(--sans); font-size: 12px; font-weight: 500; cursor: pointer; }
  .ma-bghost   { flex: 1; padding: 9px; border-radius: 50px; background: rgba(255,255,255,0.8); color: var(--muted); border: 1px solid rgba(200,160,170,0.25); font-family: var(--sans); font-size: 12px; cursor: pointer; }

  /* Mobile emergency */
  .ma-emg-hdr    { text-align: center; margin-bottom: 0.9rem; }
  .ma-emg-ico    { width: 42px; height: 42px; background: var(--rose-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 7px; border: 1px solid var(--rose-mid); }
  .ma-emg-hdr h2 { font-family: var(--serif); font-size: 21px; color: var(--text); }
  .ma-emg-hdr p  { font-size: 11px; color: var(--muted); font-weight: 300; margin-top: 2px; }
  .ma-hlbl       { font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--hint); font-weight: 500; margin-bottom: 6px; }
  .ma-hrow-m     { background: rgba(255,255,255,0.8); border: 1px solid rgba(255,200,210,0.35); border-radius: 12px; padding: 0.8rem 0.9rem; margin-bottom: 6px; display: flex; align-items: flex-start; gap: 8px; cursor: pointer; }
  .ma-hpin-m     { width: 25px; height: 25px; border-radius: 50%; background: var(--rose-light); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }

  /* Responsive */
  @media (min-width: 700px) {
    .ma-mobile  { display: none !important; }
    .ma-desktop { display: grid !important; }
  }
  @media (max-width: 699px) {
    .ma-desktop { display: none !important; }
    .ma-mobile  { display: block !important; }
  }
`;

/* ─────────────────────────────────────────
   SVG Icons
───────────────────────────────────────── */
const IconMic = ({ size = 24, color = '#e8687a' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 10a7 7 0 0 0 14 0" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="8" y1="22" x2="16" y2="22" />
  </svg>
);

const IconPin = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#e8687a" strokeWidth="2.2" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconPhone = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
  </svg>
);

const IconShield = ({ size = 18, color = '#e8687a' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

/* Waveform base heights */
const BASE_HEIGHTS = [8, 16, 10, 24, 14, 20, 9, 18, 12, 22, 10, 15];

/* ─────────────────────────────────────────
   Progress Ring
───────────────────────────────────────── */
const ProgressRing = ({ size, weeks, total }: { size: number; weeks: number; total: number }) => {
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const pct = weeks / total;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f4dde2" strokeWidth="5" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e8687a" strokeWidth="5"
        strokeDasharray={`${circ}`}
        strokeDashoffset={`${circ * (1 - pct)}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      <text x={size/2} y={size/2 + 5} textAnchor="middle"
        fontFamily="Cormorant Garamond, serif" fontSize={size > 75 ? 14 : 12}
        fill="#3d1f28" fontWeight="600">
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
};

/* ─────────────────────────────────────────
   Waveform
───────────────────────────────────────── */
const Waveform = ({ listening, barWidth = 4, height = 36 }: { listening: boolean; barWidth?: number; height?: number }) => {
  const [heights, setHeights] = useState(BASE_HEIGHTS);
  useEffect(() => {
    if (!listening) { setHeights(BASE_HEIGHTS); return; }
    const id = setInterval(() => {
      setHeights(BASE_HEIGHTS.map(() => 6 + Math.random() * 22));
    }, 80);
    return () => clearInterval(id);
  }, [listening]);
  return (
    <div className="ma-waveform" style={{ height }}>
      {heights.map((h, i) => (
        <div key={i} className="ma-wv-bar" style={{ width: barWidth, height: h }} />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────
   Hospital Row (shared)
───────────────────────────────────────── */
const HospRow = ({ h, mobile }: { h: Hospital; mobile?: boolean }) =>
  mobile ? (
    <div className="ma-hrow-m">
      <div className="ma-hpin-m"><IconPin size={10} /></div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{h.name}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 300 }}>{h.distance}</div>
        <div style={{ fontSize: 11, color: 'var(--rose)', fontWeight: 500, marginTop: 2 }}>{h.phone}</div>
      </div>
    </div>
  ) : (
    <div className="ma-hrow">
      <div className="ma-hpin"><IconPin size={11} /></div>
      <div>
        <div className="hn">{h.name}</div>
        <div className="hd">{h.distance}</div>
        <div className="hp">{h.phone}</div>
      </div>
    </div>
  );

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
export default function MamaAlert() {
  const [screen, setScreen] = useState<Screen>('home');
  const [listening, setListening] = useState(false);

  const go = (s: Screen) => { setScreen(s); setListening(false); };

  /* ── DESKTOP ── */
  const Desktop = () => (
    <div className="ma-desktop">

      {/* Topbar */}
      <div className="ma-topbar">
        <div className="ma-logo"><span className="ma-logo-dot" />MamaAlert</div>
        <div className="ma-topnav">
          {(['home','voice','emergency'] as Screen[]).map(s => (
            <button key={s} className={`ma-topnav-btn${screen === s ? ' active' : ''}`} onClick={() => go(s)}>
              {s === 'home' ? 'Home' : s === 'voice' ? 'Voice Check' : 'Emergency'}
            </button>
          ))}
        </div>
        <div className="ma-topbar-right">
          <span className="ma-week-badge">Week 28</span>
          <div className="ma-avatar">AA</div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="ma-sidebar">
        <div>
          <div className="ma-slabel">Dashboard</div>
          {[
            { id: 'home' as Screen,      label: 'Overview' },
            { id: 'voice' as Screen,     label: 'Voice Triage' },
            { id: 'emergency' as Screen, label: 'Emergency' },
          ].map(item => (
            <div key={item.id} className={`ma-sitem${screen === item.id ? ' active' : ''}`} onClick={() => go(item.id)}>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '0.4rem' }}>
          <div className="ma-slabel">Wellness</div>
          <div className="ma-sitem"><span>Wellness Log</span></div>
          <div className="ma-sitem"><span>Appointments</span></div>
        </div>
        <div className="ma-sidebar-profile">
          <div className="ma-profile-av">A</div>
          <h4>Adaeze</h4>
          <p>28 weeks · Low risk</p>
        </div>
      </div>

      {/* Main */}
      <div className="ma-main">

        {/* Home */}
        {screen === 'home' && (
          <div>
            <div className="ma-page-title">Good morning, Adaeze</div>
            <div className="ma-page-sub">Week 28 · Your baby is the size of an eggplant today</div>
            <div className="ma-stats-grid">
              <div className="ma-stat-card"><div className="ma-stat-lbl">Weeks Along</div><div className="ma-stat-val">28</div><div className="ma-stat-sub">of 40 total</div></div>
              <div className="ma-stat-card"><div className="ma-stat-lbl">Risk Level</div><div className="ma-stat-val" style={{ color: 'var(--green-dark)', fontSize: 20 }}>Low</div><div className="ma-stat-sub">All readings normal</div></div>
              <div className="ma-stat-card"><div className="ma-stat-lbl">Next Appointment</div><div className="ma-stat-val" style={{ fontSize: 17 }}>Apr 22</div><div className="ma-stat-sub">Dr. Oluwaseun</div></div>
            </div>
            <div className="ma-two-col">
              <div className="ma-card">
                <div className="ma-clabel">Pregnancy Progress</div>
                <div className="ma-prw">
                  <ProgressRing size={80} weeks={28} total={40} />
                  <div className="ma-prt"><h3>28/40</h3><p>weeks along</p><span className="ma-badge">3rd Trimester</span></div>
                </div>
              </div>
              <div className="ma-card">
                <div className="ma-clabel">Live Risk Status</div>
                <div className="ma-rkrow">
                  <div className="ma-orb" />
                  <div className="ma-rktxt"><h4>Low Risk</h4><p>All readings calm</p></div>
                </div>
                <div style={{ marginTop: '0.9rem' }}>
                  <button className="ma-btn-rose" onClick={() => go('voice')}>
                    <IconMic size={13} color="white" /> Start Emergency Check
                  </button>
                </div>
              </div>
            </div>
            <div className="ma-tips-grid">
              {[
                { title: 'Stay Hydrated', body: 'Drink at least 8 glasses of water daily in your third trimester.' },
                { title: 'Rest Often',    body: 'Nap when you can. Your body is doing incredible work right now.' },
                { title: 'Count Kicks',   body: 'Track fetal movements — aim for 10 kicks within 2 hours each day.' },
              ].map(t => (
                <div key={t.title} className="ma-tip-card">
                  <div className="ma-tip-icon" />
                  <h5>{t.title}</h5>
                  <p>{t.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Voice */}
        {screen === 'voice' && (
          <div>
            <div className="ma-page-title">Voice Triage</div>
            <div className="ma-page-sub">Speak naturally — I understand English and Pidgin</div>
            <div className="ma-voice-grid">
              <div className="ma-mic-area">
                <div style={{ fontFamily: 'var(--serif)', fontSize: 14, color: 'var(--muted)', fontStyle: 'italic' }}>tap to speak</div>
                <div className={`ma-mic-btn${listening ? ' on' : ''}`} style={{ width: 110, height: 110 }} onClick={() => setListening(l => !l)}>
                  <IconMic size={38} />
                </div>
                <Waveform listening={listening} barWidth={4} height={36} />
                <div style={{ fontSize: 11, color: 'var(--hint)', fontWeight: 300 }}>Click mic to start or stop</div>
              </div>
              <div className="ma-vinfo">
                <h3>Tell me how you feel</h3>
                <p>Describe any symptoms — pain, discomfort, unusual feelings, or anything that worries you. I will assess your risk and guide you to the right care.</p>
                <div className="ma-chips">
                  <span className="ma-chip">English</span>
                  <span className="ma-chip">Pidgin</span>
                  <span className="ma-chip">Yoruba soon</span>
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: 9 }}>
                  <button className="ma-btn-rose" onClick={() => go('emergency')}>Next →</button>
                  <button className="ma-btn-ghost" onClick={() => go('home')}>Back</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emergency */}
        {screen === 'emergency' && (
          <div>
            <div className="ma-page-title">Emergency Panel</div>
            <div className="ma-page-sub">Help is close — act quickly and calmly</div>
            <div className="ma-emg-top">
              <div><h2>Help is Near</h2><p>Emergency services are ready to assist you right now</p></div>
              <button className="ma-btn-emg" style={{ marginLeft: 'auto', width: 'auto', marginBottom: 0 }}>
                <IconPhone size={14} /> Call Emergency Now
              </button>
            </div>
            <div className="ma-clabel" style={{ marginBottom: 9 }}>Nearby Hospitals</div>
            <div className="ma-hosp-grid">
              {HOSPITALS.map(h => (
                <div key={h.name} className="ma-hcard">
                  <div className="hn">{h.name}</div>
                  <div className="hd">{h.distance}</div>
                  <div className="hp">{h.phone}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 9, marginTop: '1.1rem' }}>
              <button className="ma-btn-rose" onClick={() => go('voice')}>← Back</button>
              <button className="ma-btn-ghost" onClick={() => go('home')}>Home</button>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="ma-right-panel">
        <div>
          <div className="ma-rp-title">Nearby Hospitals</div>
          {HOSPITALS.map(h => <HospRow key={h.name} h={h} />)}
        </div>
        <div className="ma-rem-card">
          <h5>Next Appointment</h5>
          <p>Antenatal checkup with Dr. Oluwaseun. Bring your maternity card and previous results.</p>
          <div className="ma-rem-date">April 22, 2026 · 10:00 AM</div>
        </div>
        <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: 10, color: 'var(--hint)', fontWeight: 300, lineHeight: 1.7 }}>
          24/7 Support · Licensed Professionals<br />Multiple Language Support
        </div>
      </div>
    </div>
  );

  /* ── MOBILE ── */
  const Mobile = () => (
    <div className="ma-mobile">
      <div className="ma-mob-top">
        <div className="ma-mob-logo"><span className="ma-logo-dot" />MamaAlert</div>
        <div className="ma-mob-tabs">
          {([['home','Home'],['voice','Voice'],['emergency','SOS']] as [Screen,string][]).map(([s, label]) => (
            <button key={s} className={`ma-mob-tab${screen === s ? ' active' : ''}`} onClick={() => go(s)}>{label}</button>
          ))}
        </div>
      </div>

      {/* Mobile Home */}
      {screen === 'home' && (
        <>
          <div className="ma-hero">
            <div className="ma-greet">good morning, Adaeze</div>
            <div className="ma-htitle">You are doing<br />beautifully</div>
            <div className="ma-hsub">Week 28 · Baby is the size of an eggplant</div>
            <div className="ma-wpill"><span className="ma-wdot" />28 of 40 weeks</div>
          </div>
          <div className="ma-card-m">
            <div className="ma-clabel">Pregnancy Progress</div>
            <div className="ma-prw-m">
              <ProgressRing size={68} weeks={28} total={40} />
              <div className="ma-prt-m"><h3>28/40</h3><p>weeks along</p><span className="ma-tbdg">3rd Trimester</span></div>
            </div>
          </div>
          <div className="ma-card-m">
            <div className="ma-clabel">Live Risk Status</div>
            <div className="ma-rkrow-m">
              <div className="ma-orb-m" />
              <div className="ma-rktxt-m"><h4>Low Risk</h4><p>All readings calm today</p></div>
            </div>
          </div>
          <button className="ma-btn-full" onClick={() => go('voice')}>Begin Emergency Check</button>
          <div className="ma-footer-note">available 24/7 · no cost · confidential</div>
        </>
      )}

      {/* Mobile Voice */}
      {screen === 'voice' && (
        <>
          <div className="ma-hero" style={{ marginBottom: '0.8rem' }}>
            <div className="ma-greet">voice triage</div>
            <div className="ma-htitle" style={{ fontSize: 19 }}>Tell me how you feel</div>
            <div className="ma-hsub">Speak in English or Pidgin</div>
          </div>
          <div className="ma-mc">
            <div className={`ma-mbtn${listening ? ' on' : ''}`} style={{ width: 96, height: 96 }} onClick={() => setListening(l => !l)}>
              <IconMic size={32} />
            </div>
            <Waveform listening={listening} barWidth={3} height={32} />
            <div className="ma-vcap">
              <p>Describe your symptoms and how you have been feeling.</p>
              <small>Tap the mic to start</small>
            </div>
            <div className="ma-brow">
              <button className="ma-bsoft" onClick={() => go('emergency')}>Next →</button>
              <button className="ma-bghost" onClick={() => go('home')}>Back</button>
            </div>
          </div>
        </>
      )}

      {/* Mobile Emergency */}
      {screen === 'emergency' && (
        <>
          <div className="ma-emg-hdr">
            <div className="ma-emg-ico"><IconShield size={17} /></div>
            <h2>Help is Near</h2>
            <p>Emergency services are ready for you</p>
          </div>
          <button className="ma-btn-emg"><IconPhone size={13} />Call Emergency Now</button>
          <div className="ma-hlbl">Nearby Hospitals</div>
          {HOSPITALS.map(h => <HospRow key={h.name} h={h} mobile />)}
          <div className="ma-brow" style={{ marginTop: '0.85rem' }}>
            <button className="ma-bsoft" onClick={() => go('voice')}>← Back</button>
            <button className="ma-bghost" onClick={() => go('home')}>Home</button>
          </div>
          <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--hint)', fontWeight: 300, marginTop: '0.85rem', lineHeight: 1.6 }}>
            24/7 Support · Licensed Professionals · Multiple Languages
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="ma-root">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Desktop />
      <Mobile />
    </div>
  );
}