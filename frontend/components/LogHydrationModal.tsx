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
import { Droplet, AlertCircle } from 'lucide-react';

interface LogHydrationModalProps {
  onSubmit: (amountMl: number) => Promise<void>;
  isLoading?: boolean;
}

const COMMON_AMOUNTS = [
  { label: 'Small Glass (200ml)', value: 200 },
  { label: 'Medium Glass (250ml)', value: 250 },
  { label: 'Large Glass (500ml)', value: 500 },
  { label: 'Bottle (750ml)', value: 750 },
];

export function LogHydrationModal({ onSubmit, isLoading = false }: LogHydrationModalProps) {
  const [custom, setCustom] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleQuickAdd = async (amount: number) => {
    setError('');
    try {
      await onSubmit(amount);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log hydration');
    }
  };

  const handleCustomAdd = async () => {
    setError('');
    if (!custom) {
      setError('Please enter an amount');
      return;
    }
    if (parseFloat(custom) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    try {
      await onSubmit(parseFloat(custom));
      setCustom('');
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log hydration');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#d1c4e9] hover:bg-[#c7b8e0] text-gray-900 gap-2">
          <Droplet className="w-4 h-4" />
          Log Hydration
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Your Hydration</DialogTitle>
          <DialogDescription>Track your water intake today</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            {COMMON_AMOUNTS.map((amount) => (
              <Button
                key={amount.value}
                onClick={() => handleQuickAdd(amount.value)}
                disabled={isLoading}
                variant="outline"
                className="text-sm"
              >
                {amount.label}
              </Button>
            ))}
          </div>
          <div className="space-y-2 border-t pt-4">
            <label className="text-sm font-medium">Custom Amount (ml)</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="e.g., 300"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                min="1"
              />
              <Button
                onClick={handleCustomAdd}
                disabled={isLoading}
                className="bg-[#d1c4e9] hover:bg-[#c7b8e0] text-gray-900"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
