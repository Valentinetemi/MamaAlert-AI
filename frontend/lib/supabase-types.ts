import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DailyActivity {
  id: string;
  user_id: string;
  date: string;
  walks: Walk[];
  hydration_logs: HydrationLog[];
  hospital_calls: HospitalCall[];
  clinical_visits: ClinicalVisit[];
  ai_recommendation: string | null;
  created_at: string;
  updated_at: string;
}

export interface Walk {
  id: string;
  user_id: string;
  date: string;
  duration_minutes: number; // in minutes
  distance_km: number; // in kilometers
  created_at: string;
}

export interface HydrationLog {
  id: string;
  user_id: string;
  date: string;
  amount_ml: number; // in milliliters
  created_at: string;
}

export interface HospitalCall {
  id: string;
  user_id: string;
  date: string;
  hospital_name: string;
  reason: string;
  created_at: string;
}

export interface ClinicalVisit {
  id: string;
  user_id: string;
  scheduled_date: string;
  hospital_name: string;
  doctor_name: string;
  notes: string | null;
  created_at: string;
}
