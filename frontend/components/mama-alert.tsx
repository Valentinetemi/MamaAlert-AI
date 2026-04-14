'use client';

import React, { useState } from 'react';

const PregnancyApp: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<'home' | 'voice' | 'emergency'>('home');
  const [isMicActive, setIsMicActive] = useState(false);

  const colors = {
    cream: '#fff5f8',
    petal: '#ffe4f0',
    blush: '#ffc1d6',
    rose: '#e88ab0',
    deepRose: '#d46a98',
    terracotta: '#e07a9c',
    babyBlue: '#9bc9d8',
    sageLight: '#d8f0f7',
    gold: '#f4b8c8',
    goldLight: '#ffe9f0',
    textDark: '#2c1a22',
  };

  return (
    <div className="min-h-screen bg-[#fff5f8] flex flex-col font-sans" style={{ background: colors.cream }}>
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-pink-100 py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-blue-400 flex items-center justify-center text-white text-xl font-light">
            🌸
          </div>
          <div>
            <h1 className="text-2xl font-light italic text-[#2c1a22]">Bloom</h1>
            <p className="text-xs text-pink-600 -mt-1">Pregnancy Companion</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#2c1a22] font-medium">Adaeze</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-300 to-blue-300 flex items-center justify-center text-white font-semibold">
            A
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {/* HOME SCREEN */}
        {activeScreen === 'home' && (
          <div className="max-w-2xl mx-auto">
            {/* Hero */}
            <div
              className="relative px-6 pt-12 pb-10 text-white"
              style={{
                background: `linear-gradient(160deg, ${colors.deepRose} 0%, ${colors.terracotta} 100%)`,
              }}
            >
              <p className="uppercase tracking-widest text-xs opacity-75">Good morning, Adaeze</p>
              <h1 className="text-5xl font-light italic mt-2">Week 28</h1>
              <p className="mt-2 opacity-90">Your baby is the size of an eggplant 🍆</p>

              <div className="flex gap-6 mt-10">
                <div className="relative w-24 h-24">
                  <svg className="-rotate-90" width="96" height="96" viewBox="0 0 88 88">
                    <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="8" />
                    <circle cx="44" cy="44" r="38" fill="none" stroke="white" strokeWidth="8" strokeDasharray="168 238" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-medium">28</span>
                    <span className="text-xs -mt-1 opacity-75">of 40</span>
                  </div>
                </div>

                <div className="space-y-4 flex-1 pt-2">
                  <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-3xl p-5">
                    <p className="text-xs uppercase tracking-widest opacity-75">Risk Level</p>
                    <p className="text-2xl font-medium">Low Risk ✦</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-3xl p-5">
                    <p className="text-xs uppercase tracking-widest opacity-75">Next Visit</p>
                    <p className="text-2xl font-medium">April 22</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="px-6 space-y-10 pt-8">
              {/* Status */}
              <div>
                <h2 className="text-2xl italic font-light text-[#2c1a22] mb-4">How you're doing</h2>
                <div className="bg-[#d8f0f7] border border-[#9bc9d8] rounded-3xl p-6 flex gap-5">
                  <div className="w-14 h-14 bg-[#6ba8c2] rounded-2xl flex items-center justify-center">
                    ❤️
                  </div>
                  <div>
                    <p className="uppercase text-xs tracking-widest text-[#3a7a8f]">Live Status</p>
                    <p className="text-3xl font-medium text-[#1e3f4a]">All Clear</p>
                    <p className="text-[#4a7a8f]">All readings are normal</p>
                  </div>
                </div>
              </div>

              {/* Upcoming */}
              <div>
                <h2 className="text-2xl italic font-light text-[#2c1a22] mb-4">Upcoming</h2>
                <div className="bg-[#ffe9f0] border border-[#f4b8c8] rounded-3xl p-6 flex gap-5">
                  <div className="w-16 h-20 bg-[#e88ab0] rounded-2xl flex flex-col items-center justify-center text-white">
                    <span className="text-3xl font-semibold">22</span>
                    <span className="text-xs">APR</span>
                  </div>
                  <div>
                    <p className="uppercase text-xs tracking-widest text-pink-600">Antenatal Visit</p>
                    <p className="text-xl font-medium">Dr. Oluwaseun</p>
                    <p className="text-sm text-gray-600">Lagos Island Maternity • 10:00 AM</p>
                  </div>
                </div>
              </div>

              {/* Wellness Tips */}
              <div>
                <h2 className="text-2xl italic font-light text-[#2c1a22] mb-5">Today's Wellness</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { emoji: "💧", title: "Stay Hydrated", desc: "Drink 8 glasses of water daily" },
                    { emoji: "🌙", title: "Rest Often", desc: "Nap when your body needs it" },
                    { emoji: "👣", title: "Count Kicks", desc: "10 movements in 2 hours" },
                  ].map((tip, i) => (
                    <div key={i} className="bg-white rounded-3xl p-6 border border-pink-100">
                      <div className="text-4xl mb-4">{tip.emoji}</div>
                      <p className="font-medium text-lg">{tip.title}</p>
                      <p className="text-sm text-gray-600 mt-2">{tip.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VOICE SCREEN */}
        {activeScreen === 'voice' && (
          <div className="max-w-md mx-auto pt-12 px-6 text-center">
            <h1 className="text-4xl font-light italic text-[#2c1a22]">Voice Triage</h1>
            <p className="text-pink-600 mt-2">Speak freely — I'm here to listen</p>

            <div
              onClick={() => setIsMicActive(!isMicActive)}
              className={`mx-auto mt-16 w-44 h-44 rounded-full flex items-center justify-center cursor-pointer transition-all border-8 ${isMicActive
                  ? 'border-pink-400 bg-pink-50 scale-110 shadow-2xl'
                  : 'border-pink-200 bg-white'
                }`}
            >
              <div className="w-28 h-28 rounded-full bg-[#d46a98] flex items-center justify-center">
                <span className="text-6xl">🎤</span>
              </div>
            </div>

            <p className="mt-10 text-2xl italic text-[#6b3f4f]">
              {isMicActive ? "I'm listening…" : "Tap microphone to speak"}
            </p>

            <div className={`flex justify-center gap-2 mt-8 ${isMicActive ? 'opacity-100' : 'opacity-0'}`}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 bg-pink-400 rounded-full animate-pulse"
                  style={{ height: isMicActive ? '48px' : '8px', animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>

            <p className="mt-12 text-gray-600 max-w-xs mx-auto">
              Describe any symptoms, concerns, or just ask a question.
            </p>
          </div>
        )}

        {/* EMERGENCY SCREEN */}
        {activeScreen === 'emergency' && (
          <div className="max-w-md mx-auto px-6 pt-10">
            <div className="text-center text-white py-12 rounded-3xl" style={{ background: 'linear-gradient(160deg, #c23a5a, #e05a7a)' }}>
              <span className="text-6xl mb-4 block">🚨</span>
              <h1 className="text-4xl font-light italic">Help is Near</h1>
              <p className="mt-2 opacity-90">Emergency services are ready</p>
            </div>

            <button className="w-full mt-8 bg-red-600 hover:bg-red-700 transition py-7 rounded-3xl text-white text-xl font-medium flex items-center justify-center gap-3 shadow-lg">
              📞 Call Emergency Now
            </button>

            <h2 className="text-2xl italic font-light mt-12 mb-6">Nearby Hospitals</h2>

            {[
              { name: "Lagos Island Maternity", dist: "1.8 km", phone: "(+234) 1-261-4403" },
              { name: "UCH Ibadan", dist: "2.3 km", phone: "(+234) 2-241-0000" },
              { name: "Asokoro Hospital", dist: "3.1 km", phone: "(+234) 8-9900-0000" },
            ].map((h, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 mb-4 border border-pink-100 flex items-center">
                <div className="w-3 h-3 bg-pink-500 rounded-full mr-4" />
                <div className="flex-1">
                  <p className="font-medium">{h.name}</p>
                  <p className="text-sm text-gray-500">{h.dist} away</p>
                </div>
                <p className="text-pink-600 font-medium">{h.phone}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 z-50 md:hidden">
        <div className="flex items-center justify-around py-3 max-w-2xl mx-auto">
          {[
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'voice', label: 'Voice', icon: '🎤' },
            { id: 'emergency', label: 'Emergency', icon: '🚨' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id as any)}
              className={`flex flex-col items-center py-2 px-6 rounded-2xl transition-all ${activeScreen === item.id
                  ? 'text-pink-600 bg-pink-50'
                  : 'text-gray-500'
                }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Side Navigation (visible on larger screens) */}
      <div className="hidden md:flex fixed left-8 top-1/3 flex-col gap-6 bg-white p-4 rounded-3xl shadow-xl border border-pink-100">
        {[
          { id: 'home', label: 'Home', icon: '🏠' },
          { id: 'voice', label: 'Voice Triage', icon: '🎤' },
          { id: 'emergency', label: 'Emergency', icon: '🚨' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id as any)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-left transition-all ${activeScreen === item.id ? 'bg-pink-100 text-pink-600' : 'hover:bg-pink-50'}`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PregnancyApp;