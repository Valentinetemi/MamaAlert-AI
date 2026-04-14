'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, Mic, AlertTriangle, Droplet, Leaf, Heart, 
  Flower2, Award 
} from 'lucide-react';

interface UserData {
  name: string;
  week: number;
  waterCount: number;
  affirmation: string;
}

const BloomSanctuary: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<'home' | 'voice' | 'emergency'>('home');
  const [isMicActive, setIsMicActive] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: "Adaeze",
    week: 28,
    waterCount: 5,
    affirmation: "You and your baby are blooming beautifully today 🌸"
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bloomUserData');
    if (saved) setUserData(JSON.parse(saved));
  }, []);

  // Save to localStorage
  const updateWater = () => {
    const newCount = Math.min(userData.waterCount + 1, 10);
    const updated = { ...userData, waterCount: newCount };
    setUserData(updated);
    localStorage.setItem('bloomUserData', JSON.stringify(updated));
  };

  const getDailyNutritionTip = () => {
    const tips = [
      "Eat ugu leaves or spinach today for natural iron 🌿",
      "Add some avocado for healthy fats and folate 🥑",
      "Try beans or lentils for protein and fiber 🫘",
      "Have fresh oranges for Vitamin C and hydration 🍊"
    ];
    return tips[Math.floor(Date.now() / 86400000) % tips.length];
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] overflow-hidden font-sans">
      {/* Floral Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, #EBF8FF 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="flex min-h-screen">
        {/* Desktop & Tablet Sidebar / Navigation Rail */}
        <aside className="hidden md:flex w-20 lg:w-72 flex-col border-r border-[#F0FFF4] bg-white/70 backdrop-blur-xl z-50">
          <div className="p-6 flex items-center gap-3 border-b border-[#F0FFF4]">
            <div className="w-11 h-11 bg-gradient-to-br from-pink-300 to-blue-300 rounded-2xl flex items-center justify-center">
              <Flower2 className="w-7 h-7 text-white" />
            </div>
            <div className="hidden lg:block">
              <h1 className="text-3xl font-light italic text-[#2c1a22]">Bloom</h1>
              <p className="text-xs text-pink-600 -mt-1">Garden Sanctuary</p>
            </div>
          </div>

          <nav className="flex-1 pt-8 px-3 lg:px-6 space-y-2">
            {[
              { id: 'home', label: 'Garden Home', icon: Home },
              { id: 'voice', label: 'Voice Triage', icon: Mic },
              { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveScreen(item.id as any)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all ${isActive
                      ? 'bg-white shadow-md text-pink-600'
                      : 'hover:bg-white/60 text-gray-600'
                    }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-medium hidden lg:block">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          <div className="p-6 border-t border-[#F0FFF4]">
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur rounded-3xl p-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 to-blue-400 flex items-center justify-center text-white font-semibold">A</div>
              <div className="hidden lg:block">
                <p className="font-medium">{userData.name}</p>
                <p className="text-xs text-gray-500">Week {userData.week}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Top Bar */}
          <header className="bg-white/80 backdrop-blur-lg border-b border-pink-100 sticky top-0 z-40 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flower2 className="w-8 h-8 text-pink-500 md:hidden" />
              <div>
                <p className="text-sm text-pink-600">Good morning, {userData.name}</p>
                <p className="text-xl font-light italic">Week {userData.week} • Growing strong</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-gray-500">Daily Affirmation</p>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm italic text-[#2c1a22] max-w-xs"
              >
                {userData.affirmation}
              </motion.p>
            </div>
          </header>

          {/* Screen Content */}
          <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
            {activeScreen === 'home' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto space-y-8"
              >
                {/* Wellness Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {/* Hydration Tracker - Blue Wave Card */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/60 backdrop-blur-xl border border-blue-100 rounded-[2rem] p-8 relative overflow-hidden col-span-1 md:col-span-2 lg:col-span-1"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <Droplet className="w-9 h-9 text-blue-500 mb-2" />
                        <h3 className="text-2xl font-light">Hydration Garden</h3>
                        <p className="text-sm text-gray-600">Keep your body nourished</p>
                      </div>
                      <div className="text-right">
                        <span className="text-5xl font-light text-blue-600">{userData.waterCount}</span>
                        <span className="text-sm text-gray-500">/10</span>
                      </div>
                    </div>

                    {/* Wave Visualization */}
                    <div className="relative h-40 bg-gradient-to-t from-blue-400/20 to-transparent rounded-2xl overflow-hidden mb-6">
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-blue-500 to-blue-300"
                        animate={{ height: `${(userData.waterCount / 10) * 100}%` }}
                        transition={{ type: "spring", stiffness: 60, damping: 15 }}
                      />
                      <div className="absolute inset-0 flex items-end justify-around pb-4 opacity-30">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 bg-white rounded-full"
                            animate={{ height: [12, 28, 12] }}
                            transition={{ repeat: Infinity, duration: 2.5 + i * 0.2 }}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={updateWater}
                      disabled={userData.waterCount >= 10}
                      className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-2xl font-medium transition-all active:scale-95"
                    >
                      + Drink a Glass of Water
                    </button>
                  </motion.div>

                  {/* Nutrition Bloom */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/60 backdrop-blur-xl border border-emerald-100 rounded-[2rem] p-8"
                  >
                    <Leaf className="w-9 h-9 text-emerald-600 mb-4" />
                    <h3 className="text-2xl font-light mb-2">Today's Bloom Tip</h3>
                    <p className="text-lg leading-snug text-gray-700">
                      {getDailyNutritionTip()}
                    </p>
                    <div className="mt-8 pt-6 border-t border-emerald-100 text-xs text-emerald-700 flex items-center gap-2">
                      <Award className="w-4 h-4" /> Local Nigerian superfood suggestion
                    </div>
                  </motion.div>

                  {/* Activity / Rest Card */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/60 backdrop-blur-xl border border-pink-100 rounded-[2rem] p-8 flex flex-col"
                  >
                    <Heart className="w-9 h-9 text-pink-500 mb-4" />
                    <h3 className="text-2xl font-light">Gentle Movement</h3>
                    <p className="mt-auto text-sm text-gray-600">
                      Take a slow 10-minute walk in the garden or do prenatal stretches today.
                    </p>
                    <button className="mt-6 w-full py-3.5 border border-pink-300 text-pink-600 rounded-2xl hover:bg-pink-50">
                      Log Gentle Walk
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Voice Triage Screen */}
            {activeScreen === 'voice' && (
              <div className="max-w-md mx-auto text-center pt-12">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div
                    onClick={() => setIsMicActive(!isMicActive)}
                    className={`mx-auto w-52 h-52 rounded-full flex items-center justify-center cursor-pointer transition-all border-8 ${isMicActive ? 'border-blue-400 bg-blue-50 scale-110 shadow-2xl' : 'border-pink-200 bg-white'}`}
                  >
                    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center">
                      <Mic className="w-20 h-20 text-white" />
                    </div>
                  </div>
                </motion.div>

                <p className="mt-12 text-3xl font-light italic text-gray-800">
                  {isMicActive ? "I'm listening to you, dear..." : "Tap to speak with your garden guide"}
                </p>
                <p className="text-sm text-gray-500 mt-3">Describe how you're feeling today</p>
              </div>
            )}

            {/* Emergency Screen */}
            {activeScreen === 'emergency' && (
              <div className="max-w-lg mx-auto pt-8">
                <div className="bg-gradient-to-br from-rose-600 to-pink-600 text-white rounded-[2.5rem] p-12 text-center">
                  <AlertTriangle className="w-16 h-16 mx-auto mb-6" />
                  <h2 className="text-4xl font-light">Help is blooming near you</h2>
                  <p className="mt-3 opacity-90">Emergency support is ready</p>
                </div>

                <button className="mt-8 w-full py-7 bg-red-600 hover:bg-red-700 text-white text-xl rounded-3xl font-medium shadow-lg transition">
                  📞 Call Emergency Services Now
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-pink-100 z-50">
        <div className="flex justify-around items-center py-3 max-w-md mx-auto">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'voice', icon: Mic, label: 'Voice' },
            { id: 'emergency', icon: AlertTriangle, label: 'Help' },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id as any)}
                className={`flex flex-col items-center py-2 px-8 rounded-3xl transition-all ${active ? 'text-pink-600 bg-pink-50' : 'text-gray-500'}`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default BloomSanctuary;