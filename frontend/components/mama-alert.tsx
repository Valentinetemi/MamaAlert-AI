'use client';

import React, { useState, useEffect } from 'react';
import Onboarding from './Onboarding';
import { Mic, Phone, Home, Shield, Calendar } from 'lucide-react';

type Screen = 'home' | 'voice' | 'emergency';

interface Hospital {
  name: string;
  distance: string;
  phone: string;
}

interface UserData {
  name: string;
  weeks: number;
  onboardingComplete: boolean;
}

const HOSPITALS: Hospital[] = [
  { name: 'Lagos Island Maternity', distance: '1.8 km away', phone: '(+234) 1-261-4403' },
  { name: 'UCH Ibadan', distance: '2.3 km away', phone: '(+234) 2-241-0000' },
  { name: 'Asokoro Hospital', distance: '3.1 km away', phone: '(+234) 8-9900-0000' },
];

/* Progress Ring Component */
const ProgressRing = ({ weeks = 28, total = 40 }: { weeks?: number; total?: number }) => {
  const percentage = Math.round((weeks / total) * 100);
  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#fce7f0" strokeWidth="8" />
        <circle 
          cx="50" cy="50" r="42" 
          fill="none" 
          stroke="#e8687a" 
          strokeWidth="8"
          strokeDasharray={`${percentage * 2.64} 264`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-serif font-semibold text-gray-800">{weeks}</span>
        <span className="text-xs text-gray-500 -mt-1">/40</span>
      </div>
    </div>
  );
};

export default function MamaAlert() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [screen, setScreen] = useState<Screen>('home');
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mama_alert_user');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.onboardingComplete) setUserData(data);
    }
    setIsLoaded(true);
  }, []);

  const go = (s: Screen) => {
    setScreen(s);
    setListening(false);
  };

  if (!isLoaded) return <div className="min-h-screen bg-pink-50" />;

  if (!userData) {
    return <Onboarding onComplete={(data) => {
      localStorage.setItem('mama_alert_user', JSON.stringify(data));
      setUserData(data);
    }} />;
  }

  return (
    <div className="min-h-screen bg-pink-50 font-sans">
      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-[260px_1fr_320px] h-screen">
        {/* Sidebar */}
        <div className="bg-white border-r p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-4 h-4 bg-rose-500 rounded-full" />
            <span className="font-serif text-2xl font-semibold">MamaAlert</span>
          </div>

          <nav className="flex-1 space-y-1">
            {[
              { id: 'home', label: 'Overview', icon: Home },
              { id: 'voice', label: 'Voice Triage', icon: Mic },
              { id: 'emergency', label: 'Emergency', icon: Shield },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => go(item.id as Screen)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all ${screen === item.id ? 'bg-pink-100 text-pink-600 font-medium' : 'hover:bg-pink-50'}`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </div>
            ))}
          </nav>

          <div className="bg-pink-100 rounded-3xl p-6 text-center mt-auto">
            <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center text-3xl border-4 border-pink-200 mb-4">
              {userData.name[0].toUpperCase()}
            </div>
            <h4 className="font-semibold text-lg">{userData.name}</h4>
            <p className="text-pink-600 text-sm">{userData.weeks} weeks • Low Risk</p>
          </div>
        </div>

        {/* Main Area */}
        <div className="overflow-y-auto p-8">
          {screen === 'home' && <HomeScreen userData={userData} go={go} />}
          {screen === 'voice' && <VoiceScreen listening={listening} setListening={setListening} />}
          {screen === 'emergency' && <EmergencyScreen />}
        </div>

        {/* Right Panel */}
        <div className="bg-white border-l p-6 overflow-y-auto">
          <h3 className="font-serif text-xl font-semibold mb-5">Nearby Hospitals</h3>
          {HOSPITALS.map(h => (
            <div key={h.name} className="mb-5 p-5 bg-pink-50 rounded-3xl">
              <p className="font-medium">{h.name}</p>
              <p className="text-sm text-gray-500">{h.distance}</p>
              <p className="text-pink-600 font-medium mt-1">{h.phone}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile + Tablet Layout */}
      <div className="lg:hidden">
        <div className="pb-24">
          {screen === 'home' && <HomeScreen userData={userData} go={go} />}
          {screen === 'voice' && <VoiceScreen listening={listening} setListening={setListening} />}
          {screen === 'emergency' && <EmergencyScreen />}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 z-50">
          <div className="flex justify-around py-3">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'voice', label: 'Voice', icon: Mic },
              { id: 'emergency', label: 'SOS', icon: Shield },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id as Screen)}
                className={`flex flex-col items-center py-2 px-6 rounded-xl transition-all ${screen === item.id ? 'text-pink-600' : 'text-gray-500'}`}
              >
                <item.icon size={26} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== EXPANDED HOMESCREEN ===================== */
const HomeScreen = ({ userData, go }: { userData: UserData; go: (s: Screen) => void }) => (
  <div className="p-6 max-w-4xl mx-auto space-y-8">
    {/* Greeting */}
    <div>
      <h1 className="text-4xl font-serif font-semibold text-gray-800">
        Good morning, {userData.name}
      </h1>
      <p className="text-pink-600 mt-1">Week {userData.weeks} • Your baby is the size of an eggplant today</p>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-3xl p-6">
        <p className="text-xs uppercase tracking-widest text-gray-500">Weeks Along</p>
        <p className="text-5xl font-serif font-semibold mt-2">{userData.weeks}</p>
        <p className="text-sm text-gray-500">of 40 weeks</p>
      </div>

      <div className="bg-white rounded-3xl p-6">
        <p className="text-xs uppercase tracking-widest text-emerald-600">Risk Level</p>
        <p className="text-4xl font-semibold text-emerald-700 mt-3">Low</p>
        <p className="text-sm text-emerald-600">All readings normal</p>
      </div>

      <div className="bg-white rounded-3xl p-6">
        <p className="text-xs uppercase tracking-widest text-pink-600">Next Appointment</p>
        <p className="text-2xl font-semibold mt-3">Apr 22</p>
        <p className="text-sm text-gray-600">Dr. Oluwaseun</p>
      </div>
    </div>

    {/* Pregnancy Progress + Risk Status */}
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Progress */}
      <div className="lg:col-span-3 bg-white rounded-3xl p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="uppercase text-xs tracking-widest text-pink-500">Pregnancy Progress</p>
            <p className="text-4xl font-serif font-semibold mt-2">{userData.weeks}/40</p>
            <p className="text-pink-600">3rd Trimester</p>
          </div>
          <ProgressRing weeks={userData.weeks} />
        </div>
      </div>

      {/* Risk Status */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-8 flex flex-col">
        <p className="uppercase text-xs tracking-widest text-emerald-600 mb-4">Live Risk Status</p>
        <div className="flex-1 flex items-center gap-5">
          <div className="text-6xl">🛡️</div>
          <div>
            <p className="text-3xl font-semibold text-emerald-700">Low Risk</p>
            <p className="text-emerald-600">All readings calm</p>
          </div>
        </div>
        <button
          onClick={() => go('voice')}
          className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-2xl font-medium transition-all"
        >
          Start Voice Emergency Check
        </button>
      </div>
    </div>

    {/* Wellness Tips */}
    <div>
      <h3 className="font-semibold text-lg mb-4">Today's Wellness Tips</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { title: "Stay Hydrated", desc: "Drink at least 8 glasses of water daily in your third trimester." },
          { title: "Rest Often", desc: "Nap when you can. Your body is doing incredible work right now." },
          { title: "Count Kicks", desc: "Track fetal movements — aim for 10 kicks within 2 hours each day." },
        ].map((tip, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-pink-100 rounded-2xl flex items-center justify-center mb-4">🌸</div>
            <h4 className="font-semibold mb-2">{tip.title}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* Voice & Emergency Screens (kept simple) */
const VoiceScreen = ({ listening, setListening }: any) => (
  <div className="p-6 max-w-md mx-auto text-center">
    <h2 className="text-3xl font-serif font-semibold mb-8">Voice Triage</h2>
    <button
      onClick={() => setListening(!listening)}
      className={`w-40 h-40 rounded-full border-8 mx-auto flex items-center justify-center transition-all ${listening ? 'border-pink-500 bg-pink-50' : 'border-pink-200'}`}
    >
      <Mic size={64} className={listening ? "text-pink-600" : "text-gray-400"} />
    </button>
    <p className="mt-8 text-xl font-medium">{listening ? "I'm listening..." : "Tap to speak"}</p>
  </div>
);

const EmergencyScreen = () => (
  <div className="p-6">
    <div className="bg-gradient-to-br from-red-50 to-rose-100 border border-red-200 rounded-3xl p-10 text-center">
      <Shield size={64} className="mx-auto text-red-500 mb-6" />
      <h2 className="text-4xl font-semibold text-red-700">Help is Near</h2>
      <p className="text-red-600 mt-3 text-lg">Emergency services are ready to assist you</p>
      
      <button className="mt-10 bg-red-600 hover:bg-red-700 w-full py-5 rounded-2xl text-white text-lg font-medium flex items-center justify-center gap-3">
        <Phone /> Call Emergency Now
      </button>
    </div>
  </div>
);