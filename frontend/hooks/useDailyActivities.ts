'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { DailyActivity, Walk, HydrationLog, HospitalCall, ClinicalVisit } from '@/lib/supabase-types';

const getDayKey = (date: Date = new Date()) => {
  return date.toISOString().split('T')[0];
};

export function useDailyActivities() {
  const [activities, setActivities] = useState<DailyActivity | null>(null);
  const [walks, setWalks] = useState<Walk[]>([]);
  const [hydration, setHydration] = useState<HydrationLog[]>([]);
  const [hospitalCalls, setHospitalCalls] = useState<HospitalCall[]>([]);
  const [clinicalVisits, setClinicalVisits] = useState<ClinicalVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = supabase.auth.user();
  const todayKey = getDayKey();

  // Fetch today's activities
  const fetchTodayActivities = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const { data: walksData, error: walksError } = await supabase
        .from('walks')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', todayKey);

      const { data: hydrationData, error: hydrationError } = await supabase
        .from('hydration_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', todayKey);

      const { data: callsData, error: callsError } = await supabase
        .from('hospital_calls')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', todayKey);

      const { data: visitsData, error: visitsError } = await supabase
        .from('clinical_visits')
        .select('*')
        .eq('user_id', user.id)
        .gte('scheduled_date', todayKey)
        .lte('scheduled_date', todayKey);

      if (walksError) throw walksError;
      if (hydrationError) throw hydrationError;
      if (callsError) throw callsError;
      if (visitsError) throw visitsError;

      setWalks((walksData as Walk[]) || []);
      setHydration((hydrationData as HydrationLog[]) || []);
      setHospitalCalls((callsData as HospitalCall[]) || []);
      setClinicalVisits((visitsData as ClinicalVisit[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  // Add walk
  const addWalk = async (durationMinutes: number, distanceKm: number) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('walks')
        .insert([
          {
            user_id: user.id,
            date: todayKey,
            duration_minutes: durationMinutes,
            distance_km: distanceKm,
          },
        ])
        .select();

      if (error) throw error;
      if (data) setWalks([...walks, data[0]]);
      return data?.[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add walk');
    }
  };

  // Log hydration
  const logHydration = async (amountMl: number) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('hydration_logs')
        .insert([
          {
            user_id: user.id,
            date: todayKey,
            amount_ml: amountMl,
          },
        ])
        .select();

      if (error) throw error;
      if (data) setHydration([...hydration, data[0]]);
      return data?.[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log hydration');
    }
  };

  // Add hospital call
  const addHospitalCall = async (hospitalName: string, reason: string) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('hospital_calls')
        .insert([
          {
            user_id: user.id,
            date: todayKey,
            hospital_name: hospitalName,
            reason: reason,
          },
        ])
        .select();

      if (error) throw error;
      if (data) setHospitalCalls([...hospitalCalls, data[0]]);
      return data?.[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add hospital call');
    }
  };

  // Schedule clinical visit
  const scheduleClinicalVisit = async (scheduledDate: string, hospitalName: string, doctorName: string, notes?: string) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('clinical_visits')
        .insert([
          {
            user_id: user.id,
            scheduled_date: scheduledDate,
            hospital_name: hospitalName,
            doctor_name: doctorName,
            notes: notes || null,
          },
        ])
        .select();

      if (error) throw error;
      if (new Date(scheduledDate).toDateString() === new Date(todayKey).toDateString()) {
        if (data) setClinicalVisits([...clinicalVisits, data[0]]);
      }
      return data?.[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule visit');
    }
  };

  useEffect(() => {
    fetchTodayActivities();
  }, [user?.id]);

  return {
    activities,
    walks,
    hydration,
    hospitalCalls,
    clinicalVisits,
    loading,
    error,
    addWalk,
    logHydration,
    addHospitalCall,
    scheduleClinicalVisit,
    refetch: fetchTodayActivities,
  };
}
