'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Phone, MapPin, AlertCircle, Heart, Volume2 } from 'lucide-react';

interface HospitalInfo {
  name: string;
  distance: string;
  phone: string;
}

export default function MamaAlert() {
  const [activeScreen, setActiveScreen] = useState<'home' | 'voice' | 'emergency'>('home');
  const [isListening, setIsListening] = useState(false);
  const [waveformPhase, setWaveformPhase] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const hospitals: HospitalInfo[] = [
    { name: 'UCH Ibadan', distance: '2.3 km away', phone: '(+234) 2-241-0000' },
    { name: 'Lagos Island Maternity', distance: '1.8 km away', phone: '(+234) 1-261-4403' },
    { name: 'Asokoro Hospital', distance: '3.1 km away', phone: '(+234) 8-9900-0000' },
  ];

  // Animate waveform
  useEffect(() => {
    if (!isListening) return;
    const interval = setInterval(() => {
      setWaveformPhase((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, [isListening]);

  const handleMicClick = () => {
    setIsListening(!isListening);
    if (!isListening && !audioContextRef.current) {
      initializeAudioContext();
    }
  };

  const initializeAudioContext = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyserRef.current = analyser;
      }).catch(() => {
        console.log('Microphone access denied');
      });
    } catch (error) {
      console.log('Audio context not supported');
    }
  };

  // Waveform visualization
  const waveHeight = (index: number) => {
    const baseHeight = 20;
    const amplitude = Math.sin((waveformPhase + index * 12) / 10) * 15 + 15;
    return baseHeight + amplitude;
  };

  // Home Screen
  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#f5ede3] via-[#faf7f1] to-[#f5ede3] overflow-hidden">
      {/* Subtle Ankara-inspired pattern overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(168, 197, 163, 0.1) 35px, rgba(168, 197, 163, 0.1) 70px)',
      }} />

      <div className="relative z-10 max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl">
          <img
            src="/mama-hero.jpg"
            alt="Pregnant woman smiling"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Pregnancy Progress Card */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-white/40">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[#8b7b6f] font-medium">Pregnancy Progress</p>
              <h3 className="text-3xl font-bold text-[#3d3d3d] mt-1">28/40 Weeks</h3>
            </div>
            <Heart className="w-8 h-8 text-[#f4c2c6]" />
          </div>

          {/* Circular Progress Bar */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#e8e0d6"
                strokeWidth="6"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="6"
                strokeDasharray={`${(28 / 40) * 339.29} 339.29`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f4c2c6" />
                  <stop offset="100%" stopColor="#a8c5a3" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-[#8b7b6f]">3rd Trimester</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Risk Status Card */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-white/40">
          <p className="text-sm text-[#8b7b6f] font-medium mb-3">Live Risk Status</p>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#a8c5a3]/30 rounded-full blur-lg animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-[#a8c5a3]/20 border-2 border-[#a8c5a3] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#a8c5a3]/40" />
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold text-[#3d3d3d]">Low Risk</h4>
              <p className="text-sm text-[#8b7b6f]">Your current risk level</p>
            </div>
          </div>
        </div>

        {/* Emergency Check Button */}
        <button
          onClick={() => setActiveScreen('voice')}
          className="w-full py-4 px-6 rounded-2xl font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-[#f4c2c6] to-[#a8c5a3] active:scale-95"
        >
          Start Emergency Check
        </button>

        <p className="text-center text-sm text-[#8b7b6f]">Available 24/7 • No cost • Confidential</p>
      </div>
    </div>
  );

  // Voice Mode Triage Screen
  const VoiceScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#f5ede3] via-[#faf7f1] to-[#f5ede3] flex flex-col items-center justify-center px-4 relative">
      {/* Subtle pattern overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(168, 197, 163, 0.1) 35px, rgba(168, 197, 163, 0.1) 70px)',
      }} />

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Status */}
        <div className="mb-8">
          <p className="text-[#8b7b6f] font-medium text-center">Voice Mode Active</p>
          <h2 className="text-2xl font-bold text-[#3d3d3d] text-center mt-2">I&apos;m Listening</h2>
        </div>

        {/* Microphone Button with Animation */}
        <button
          onClick={handleMicClick}
          className={`relative w-32 h-32 rounded-full flex items-center justify-center mb-8 transition-all duration-300 shadow-2xl transform hover:scale-105 active:scale-95 ${
            isListening
              ? 'bg-gradient-to-br from-[#a8c5a3] to-[#8fb595]'
              : 'bg-gradient-to-br from-[#f4c2c6] to-[#e8a8b0]'
          }`}
        >
          <Mic className={`w-16 h-16 text-white ${isListening ? 'animate-pulse' : ''}`} />
        </button>

        {/* Waveform Visualization */}
        {isListening && (
          <div className="mb-12 flex items-center justify-center gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-[#a8c5a3] rounded-full transition-all duration-75"
                style={{ height: `${waveHeight(i)}px` }}
              />
            ))}
          </div>
        )}

        {/* Caption */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-white/40 max-w-sm text-center">
          <p className="text-[#3d3d3d] font-medium">Talk to me in English or Pidgin—I&apos;m listening.</p>
          <p className="text-sm text-[#8b7b6f] mt-3">Describe your symptoms and how you feel</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-12">
          <button
            onClick={() => setActiveScreen('emergency')}
            className="px-6 py-3 rounded-full bg-[#d1c4e9] text-[#3d3d3d] font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Next
          </button>
          <button
            onClick={() => setActiveScreen('home')}
            className="px-6 py-3 rounded-full bg-white/80 backdrop-blur text-[#3d3d3d] font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/40"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );

  // Emergency Action Panel
  const EmergencyScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#f5ede3] via-[#faf7f1] to-[#f5ede3] overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(168, 197, 163, 0.1) 35px, rgba(168, 197, 163, 0.1) 70px)',
      }} />

      <div className="relative z-10 max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <AlertCircle className="w-12 h-12 text-[#a8c5a3] mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-[#3d3d3d]">Help is Near</h2>
          <p className="text-[#8b7b6f] mt-2">Emergency services ready to assist you</p>
        </div>

        {/* One-Tap Emergency Call */}
        <button className="w-full py-6 px-6 rounded-2xl font-bold text-white text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-[#c85a5f] to-[#b84850] mb-8 active:scale-95 flex items-center justify-center gap-3">
          <Phone className="w-6 h-6" />
          Emergency Call Now
        </button>

        {/* Nearby Hospitals */}
        <div className="mb-8">
          <p className="text-sm font-bold text-[#3d3d3d] mb-4">Nearby Hospitals</p>
          <div className="space-y-3">
            {hospitals.map((hospital, idx) => (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#a8c5a3] flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-bold text-[#3d3d3d]">{hospital.name}</h4>
                    <p className="text-sm text-[#8b7b6f]">{hospital.distance}</p>
                    <p className="text-sm font-medium text-[#a8c5a3] mt-2">{hospital.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setActiveScreen('voice')}
            className="flex-1 px-6 py-3 rounded-full bg-[#d1c4e9] text-[#3d3d3d] font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Back
          </button>
          <button
            onClick={() => setActiveScreen('home')}
            className="flex-1 px-6 py-3 rounded-full bg-white/80 backdrop-blur text-[#3d3d3d] font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/40"
          >
            Home
          </button>
        </div>

        <p className="text-center text-xs text-[#8b7b6f] mt-8">24/7 Support • Licensed Healthcare Professionals • Multiple Language Support</p>
      </div>
    </div>
  );

  return (
    <>
      {activeScreen === 'home' && <HomeScreen />}
      {activeScreen === 'voice' && <VoiceScreen />}
      {activeScreen === 'emergency' && <EmergencyScreen />}
    </>
  );
}
