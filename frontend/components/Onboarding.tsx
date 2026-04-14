// app/onboarding/Onboarding.tsx   OR   components/Onboarding.tsx

'use client';

import React, { useState } from 'react';
import { ArrowLeft, MapPin, Heart } from 'lucide-react';

interface UserData {
  name: string;
  phone: string;
  dueDate?: string;
  lmpDate?: string;
  weeks: number;
  isFirstPregnancy: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  onboardingComplete: boolean;
}

interface OnboardingProps {
  onComplete: (data: UserData) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    dueDate: '',
    lmpDate: '',
    isFirstPregnancy: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const updateForm = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  const calculateWeeks = () => {
    // You can make this more accurate later using date logic
    return 28;
  };

  const handleComplete = () => {
    const userData: UserData = {
      name: form.name || 'Mama',
      phone: form.phone,
      dueDate: form.dueDate,
      lmpDate: form.lmpDate,
      weeks: calculateWeeks(),
      isFirstPregnancy: form.isFirstPregnancy,
      emergencyContactName: form.emergencyContactName,
      emergencyContactPhone: form.emergencyContactPhone,
      onboardingComplete: true,
    };

    onComplete(userData);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Progress */}
        <div className="h-2 bg-pink-100">
          <div className="h-2 bg-pink-500 transition-all" style={{ width: `${(step / 4) * 100}%` }} />
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="text-center space-y-8 py-8">
              <div className="text-6xl">❤️</div>
              <h1 className="text-3xl font-semibold">Welcome to MamaAlert</h1>
              <p className="text-pink-600 text-lg">Your safe pregnancy companion in Nigeria</p>

              <button
                onClick={next}
                className="w-full bg-pink-500 text-white py-4 rounded-2xl text-lg font-medium"
              >
                Let’s Begin
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">What should we call you?</h2>
              <input
                type="text"
                placeholder="Adaeze"
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
                className="w-full px-5 py-4 border border-pink-200 rounded-2xl text-lg"
              />
              <input
                type="tel"
                placeholder="+234 801 234 5678"
                value={form.phone}
                onChange={(e) => updateForm('phone', e.target.value)}
                className="w-full px-5 py-4 border border-pink-200 rounded-2xl text-lg"
              />
              <button onClick={next} disabled={!form.name || !form.phone} className="w-full bg-pink-500 text-white py-4 rounded-2xl font-medium disabled:bg-pink-300">
                Continue
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">Tell us about your pregnancy</h2>

              <div>
                <label className="block text-sm mb-2">Expected Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => updateForm('dueDate', e.target.value)}
                  className="w-full px-5 py-4 border border-pink-200 rounded-2xl"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Is this your first pregnancy?</label>
                <div className="flex gap-3">
                  {['Yes', 'No'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => updateForm('isFirstPregnancy', opt)}
                      className={`flex-1 py-4 rounded-2xl border-2 ${form.isFirstPregnancy === opt ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={next} disabled={!form.dueDate} className="w-full bg-pink-500 text-white py-4 rounded-2xl font-medium">
                Continue
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-center">Let’s keep you safe</h2>

              <button className="w-full bg-pink-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2">
                <MapPin /> Find My Location
              </button>

              <div>
                <p className="text-sm font-medium mb-3">Emergency Contact</p>
                <input
                  type="text"
                  placeholder="Name (Husband / Mother)"
                  value={form.emergencyContactName}
                  onChange={(e) => updateForm('emergencyContactName', e.target.value)}
                  className="w-full px-5 py-4 border border-pink-200 rounded-2xl mb-3"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.emergencyContactPhone}
                  onChange={(e) => updateForm('emergencyContactPhone', e.target.value)}
                  className="w-full px-5 py-4 border border-pink-200 rounded-2xl"
                />
              </div>

              <button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-5 rounded-3xl font-semibold text-xl flex items-center justify-center gap-2"
              >
                Complete Onboarding <Heart fill="white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}