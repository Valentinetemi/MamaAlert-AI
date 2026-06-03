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
import { Activity, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface LogWalkModalProps {
  onSubmit: (duration: number, distance: number) => Promise<void>;
  isLoading?: boolean;
}

export function LogWalkModal({ onSubmit, isLoading = false }: LogWalkModalProps) {
  const { t } = useTranslation();
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!duration || !distance) {
      setError('Please fill in all fields');
      return;
    }
    if (parseFloat(duration) <= 0 || parseFloat(distance) <= 0) {
      setError('Values must be greater than 0');
      return;
    }
    try {
      await onSubmit(parseFloat(duration), parseFloat(distance));
      setDuration('');
      setDistance('');
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log walk');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#a8c5a3] hover:bg-[#96b391] text-white gap-2">
          <Activity className="w-4 h-4" />
          Log Walk
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Your Walk</DialogTitle>
          <DialogDescription>Record your walking activity today</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Duration (minutes)</label>
            <Input
              type="number"
              placeholder="e.g., 30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Distance (km)</label>
            <Input
              type="number"
              placeholder="e.g., 2.5"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              step="0.1"
              min="0.1"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-[#a8c5a3] hover:bg-[#96b391] text-white"
          >
            {isLoading ? 'Logging...' : 'Log Walk'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
