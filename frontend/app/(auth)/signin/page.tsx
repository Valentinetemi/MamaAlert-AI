'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, ArrowRight, CalendarClock, Eye, EyeOff, HeartPulse, LockKeyhole, PhoneCall, ShieldCheck } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push('/');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fff8f2] text-[#2f2524]">
      <div className="grid min-h-screen lg:grid-cols-[1.02fr_0.98fr]">
        <section className="relative hidden overflow-hidden bg-[#22362f] px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[url('/mama-hero.jpg')] bg-cover bg-center opacity-35" />
          <div className="absolute inset-0 bg-[#17251f]/70" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#f7b7a3] text-[#2f2524]">
              <HeartPulse className="h-6 w-6" />
            </div>
            <span className="text-xl font-semibold">MamaAlert</span>
          </div>

          <div className="relative max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white/90">
              <ShieldCheck className="h-4 w-4" />
              Private maternal care workspace
            </p>
            <h1 className="text-5xl font-semibold leading-tight">
              Welcome back to your pregnancy care hub.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/82">
              Continue symptom checks, track appointments, save your care profile, and get clear next steps when something feels off.
            </p>
          </div>

          <div className="relative grid grid-cols-3 gap-3">
            {[
              { icon: CalendarClock, label: 'Visits' },
              { icon: HeartPulse, label: 'Triage' },
              { icon: PhoneCall, label: 'Care calls' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-md border border-white/14 bg-white/10 p-4 backdrop-blur">
                  <Icon className="mb-3 h-5 w-5 text-[#f7b7a3]" />
                  <p className="text-sm text-white/85">{item.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8">
          <div className="w-full max-w-[460px]">
            <Link href="/landing" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#6f4f48] hover:text-[#2f2524]">
              <HeartPulse className="h-4 w-4" />
              MamaAlert
            </Link>

            <div className="rounded-lg border border-[#ecd8ce] bg-white p-6 shadow-[0_18px_60px_rgba(74,49,41,0.10)] sm:p-8">
              <div className="mb-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-[#e7f2ea] text-[#26604b]">
                  <LockKeyhole className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-semibold text-[#2f2524]">Sign in</h2>
                <p className="mt-2 text-sm leading-6 text-[#75615c]">
                  Access your symptom history, appointment reminders, and pregnancy dashboard.
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-5">
                {error && (
                  <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#4a3a36]">Email address</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 rounded-md border-[#d9c8c0] bg-[#fffdfb]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-[#4a3a36]">Password</label>
                    <button type="button" className="text-sm font-medium text-[#26604b] hover:text-[#1d4939]">
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="h-12 rounded-md border-[#d9c8c0] bg-[#fffdfb] pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#75615c] hover:text-[#2f2524]"
                      disabled={loading}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="h-12 w-full rounded-md bg-[#26604b] text-white hover:bg-[#1d4939]" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in to care dashboard'}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>

              <div className="mt-6 border-t border-[#ecd8ce] pt-6">
                <p className="text-center text-sm text-[#75615c]">
                  New to MamaAlert?{' '}
                  <Link href="/signup" className="font-semibold text-[#26604b] hover:text-[#1d4939]">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>

            <p className="mt-5 text-center text-xs leading-5 text-[#8a746f]">
              For danger signs like heavy bleeding, convulsions, severe headache, or trouble breathing, call emergency care immediately.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
