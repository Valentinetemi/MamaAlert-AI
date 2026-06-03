'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Droplet, Phone, Calendar, Lightbulb } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { Walk, HydrationLog, HospitalCall, ClinicalVisit } from '@/lib/supabase-types';

interface DailyResultsProps {
  walks: Walk[];
  hydration: HydrationLog[];
  hospitalCalls: HospitalCall[];
  clinicalVisits: ClinicalVisit[];
  aiRecommendation?: string | null;
  loading?: boolean;
}

const DAILY_HYDRATION_GOAL = 2000; // 2 liters in ml
const DAILY_WALK_GOAL = 10000; // 10 km in meters

export function DailyResults({
  walks,
  hydration,
  hospitalCalls,
  clinicalVisits,
  aiRecommendation,
  loading = false,
}: DailyResultsProps) {
  const totalWalkDistance = walks.reduce((sum, walk) => sum + walk.distance_km, 0);
  const totalWalkDuration = walks.reduce((sum, walk) => sum + walk.duration_minutes, 0);
  const totalHydration = hydration.reduce((sum, log) => sum + log.amount_ml, 0);
  const hydrationPercentage = Math.min((totalHydration / DAILY_HYDRATION_GOAL) * 100, 100);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Today's Summary</h2>

      {/* Activity Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Walks Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#a8c5a3]" />
              Walks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalWalkDistance.toFixed(1)}</p>
                <p className="text-xs text-gray-600">km today</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">{totalWalkDuration} minutes</p>
                <p className="text-xs text-gray-600">{walks.length} walks logged</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hydration Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Droplet className="w-4 h-4 text-[#d1c4e9]" />
              Hydration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalHydration}</p>
                <p className="text-xs text-gray-600">ml / {DAILY_HYDRATION_GOAL}ml</p>
              </div>
              <Progress value={hydrationPercentage} className="h-2" />
              <p className="text-xs text-gray-600">{Math.round(hydrationPercentage)}% of goal</p>
            </div>
          </CardContent>
        </Card>

        {/* Hospital Calls Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#f4c2c6]" />
              Hospital Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-2xl font-bold text-gray-900">{hospitalCalls.length}</p>
              {hospitalCalls.length > 0 && (
                <div className="text-xs space-y-1">
                  {hospitalCalls.slice(0, 2).map((call, idx) => (
                    <p key={idx} className="text-gray-600 truncate">
                      {call.hospital_name} - {call.reason}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Clinical Visits Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#a8c5a3]" />
              Visits Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-2xl font-bold text-gray-900">{clinicalVisits.length}</p>
              {clinicalVisits.length > 0 && (
                <div className="text-xs space-y-1">
                  {clinicalVisits.slice(0, 1).map((visit, idx) => (
                    <p key={idx} className="text-gray-600 truncate">
                      {new Date(visit.scheduled_date).toLocaleDateString()}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendation Card */}
      {aiRecommendation && (
        <Card className="border-[#d1c4e9] bg-[#d1c4e9]/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#a8c5a3]" />
              AI Health Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{aiRecommendation}</p>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && walks.length === 0 && hydration.length === 0 && hospitalCalls.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-gray-600">No activities logged yet today. Start by logging a walk or drinking water!</p>
        </Card>
      )}
    </div>
  );
}
