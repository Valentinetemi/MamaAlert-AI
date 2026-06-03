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
import { Phone, AlertCircle } from 'lucide-react';

interface CallHospitalModalProps {
  onSubmit: (hospitalName: string, reason: string) => Promise<void>;
  isLoading?: boolean;
}

const QUICK_REASONS = [
  'Emergency',
  'Check-up',
  'Symptoms consultation',
  'Appointment booking',
  'Test results',
];

export function CallHospitalModal({ onSubmit, isLoading = false }: CallHospitalModalProps) {
  const [hospital, setHospital] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!hospital || !reason) {
      setError('Please fill in all fields');
      return;
    }
    try {
      await onSubmit(hospital, reason);
      setHospital('');
      setReason('');
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log call');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#f4c2c6] hover:bg-[#f0b0b7] text-gray-900 gap-2">
          <Phone className="w-4 h-4" />
          Call Hospital
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Hospital Call</DialogTitle>
          <DialogDescription>Record your communication with the hospital</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Hospital Name</label>
            <Input
              placeholder="e.g., General Hospital"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for Call</label>
            <div className="space-y-2">
              {QUICK_REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`w-full p-2 text-left rounded border transition-colors ${
                    reason === r
                      ? 'bg-[#a8c5a3]/20 border-[#a8c5a3]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-[#f4c2c6] hover:bg-[#f0b0b7] text-gray-900"
          >
            {isLoading ? 'Logging...' : 'Log Call'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
