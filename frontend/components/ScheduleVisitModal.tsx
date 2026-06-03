'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar, AlertCircle } from 'lucide-react';

interface ScheduleVisitModalProps {
  onSubmit: (date: string, hospital: string, doctor: string, notes?: string) => Promise<void>;
  isLoading?: boolean;
}

export function ScheduleVisitModal({ onSubmit, isLoading = false }: ScheduleVisitModalProps) {
  const [date, setDate] = useState('');
  const [hospital, setHospital] = useState('');
  const [doctor, setDoctor] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!date || !hospital || !doctor) {
      setError('Please fill in all required fields');
      return;
    }
    try {
      await onSubmit(date, hospital, doctor, notes);
      setDate('');
      setHospital('');
      setDoctor('');
      setNotes('');
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule visit');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#d1c4e9] hover:bg-[#c7b8e0] text-gray-900 gap-2">
          <Calendar className="w-4 h-4" />
          Schedule Visit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Clinical Visit</DialogTitle>
          <DialogDescription>Book your appointment with the hospital</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Visit Date *</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Hospital Name *</label>
            <Input
              placeholder="e.g., General Hospital"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Doctor Name *</label>
            <Input
              placeholder="e.g., Dr. Chioma"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <Input
              placeholder="Any special notes for the visit"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-[#d1c4e9] hover:bg-[#c7b8e0] text-gray-900"
          >
            {isLoading ? 'Scheduling...' : 'Schedule Visit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
