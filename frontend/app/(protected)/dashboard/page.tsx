'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Heart, LogOut } from 'lucide-react';
import { useDailyActivities } from '@/hooks/useDailyActivities';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { LogWalkModal } from '@/components/LogWalkModal';
import { LogHydrationModal } from '@/components/LogHydrationModal';
import { CallHospitalModal } from '@/components/CallHospitalModal';
import { ScheduleVisitModal } from '@/components/ScheduleVisitModal';
import { DailyResults } from '@/components/DailyResults';

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { walks, hydration, hospitalCalls, clinicalVisits, loading, error, addWalk, logHydration, addHospitalCall, scheduleClinicalVisit, refetch } = useDailyActivities();
  const [userName, setUserName] = useState<string>('');
  const [isLoggingWalk, setIsLoggingWalk] = useState(false);
  const [isLoggingHydration, setIsLoggingHydration] = useState(false);
  const [isLoggingCall, setIsLoggingCall] = useState(false);
  const [isSchedulingVisit, setIsSchedulingVisit] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signin');
      } else {
        setUserName(user.user_metadata?.full_name || user.email || 'User');
      }
    };
    checkAuth();
  }, [router]);

  const handleLogWalk = async (duration: number, distance: number) => {
    setIsLoggingWalk(true);
    try {
      await addWalk(duration, distance);
      await refetch();
    } finally {
      setIsLoggingWalk(false);
    }
  };

  const handleLogHydration = async (amount: number) => {
    setIsLoggingHydration(true);
    try {
      await logHydration(amount);
      await refetch();
    } finally {
      setIsLoggingHydration(false);
    }
  };

  const handleCallHospital = async (hospital: string, reason: string) => {
    setIsLoggingCall(true);
    try {
      await addHospitalCall(hospital, reason);
      await refetch();
    } finally {
      setIsLoggingCall(false);
    }
  };

  const handleScheduleVisit = async (date: string, hospital: string, doctor: string, notes?: string) => {
    setIsSchedulingVisit(true);
    try {
      await scheduleClinicalVisit(date, hospital, doctor, notes);
      await refetch();
    } finally {
      setIsSchedulingVisit(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#f5ede3]">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-[#f4c2c6]" />
            <span className="font-bold text-lg text-gray-900">MamaAlert</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{t('welcome')}, {userName}!</span>
            <LanguageSwitcher />
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-300 text-gray-900 hover:bg-gray-50 gap-2"
            >
              <LogOut className="w-4 h-4" />
              {t('sign_in')}
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <LogWalkModal onSubmit={handleLogWalk} isLoading={isLoggingWalk} />
          <LogHydrationModal onSubmit={handleLogHydration} isLoading={isLoggingHydration} />
          <CallHospitalModal onSubmit={handleCallHospital} isLoading={isLoggingCall} />
          <ScheduleVisitModal onSubmit={handleScheduleVisit} isLoading={isSchedulingVisit} />
        </div>

        {/* Daily Results */}
        <DailyResults
          walks={walks}
          hydration={hydration}
          hospitalCalls={hospitalCalls}
          clinicalVisits={clinicalVisits}
          loading={loading}
        />
      </main>
    </div>
  );
}
