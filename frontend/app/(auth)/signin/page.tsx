'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, ArrowRight, CalendarClock, Eye, EyeOff, HeartPulse, LockKeyhole, PhoneCall, ShieldCheck } from 'lucide-react';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured yet. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in frontend/.env.local.');
      return;
    }

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

      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError('');
    setNotice('');

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured yet. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in frontend/.env.local.');
      return;
    }

    if (!email) {
      setError('Enter your email address first, then request a reset link.');
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/signin`,
      });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setNotice('Password reset link sent. Please check your email.');
    } catch (err) {
      setError('Unable to send a reset link right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF5F5] text-[#1C1014]">
      <div className="grid min-h-screen lg:grid-cols-[1.02fr_0.98fr]">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#F9A8D4] via-[#FBCFE8] to-[#93C5FD] px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[url('/mama-hero.jpg')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#F9A8D4]/80 via-[#F472B6]/50 to-[#93C5FD]/70" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/25 backdrop-blur">
              <HeartPulse className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-semibold">MamaAlert</span>
          </div>

          <div className="relative max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm text-white/95 backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Private maternal care workspace
            </p>
            <h1 className="text-5xl font-light leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Welcome back to your pregnancy care hub.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/90">
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
                <div key={item.label} className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur">
                  <Icon className="mb-3 h-5 w-5 text-white" />
                  <p className="text-sm text-white/90">{item.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8">
          <div className="w-full max-w-[460px]">
            <Link href="/landing" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#6B5057] hover:text-[#BE185D]">
              <HeartPulse className="h-4 w-4 text-[#F9A8D4]" />
              MamaAlert
            </Link>

            <div className="rounded-[2rem] border border-[#FECDD3]/60 bg-white/90 p-6 shadow-[0_32px_80px_rgba(249,168,212,0.14)] backdrop-blur sm:p-8">
              <div className="mb-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#F9A8D4] to-[#93C5FD] text-white">
                  <LockKeyhole className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-light text-[#1C1014]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Sign in
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#6B5057]">
                  Access your symptom history, appointment reminders, and pregnancy dashboard.
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-5">
                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                {notice && (
                  <div className="flex items-start gap-2 rounded-xl border border-[#FECDD3] bg-[#FFF5F5] p-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#BE185D]" />
                    <p className="text-sm text-[#6B5057]">{notice}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#6B5057]">Email address</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 rounded-xl border-[#FECDD3] bg-white focus-visible:ring-[#F9A8D4]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-[#6B5057]">Password</label>
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      disabled={loading}
                      className="text-sm font-medium text-[#BE185D] hover:text-[#9D174D] disabled:opacity-60"
                    >
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
                      className="h-12 rounded-xl border-[#FECDD3] bg-white pr-11 focus-visible:ring-[#F9A8D4]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B09099] hover:text-[#1C1014]"
                      disabled={loading}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-[#F9A8D4] to-[#93C5FD] text-white hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign in to care dashboard'}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>

              <div className="mt-6 border-t border-[#FECDD3]/60 pt-6">
                <p className="text-center text-sm text-[#6B5057]">
                  New to MamaAlert?{' '}
                  <Link href="/signup" className="font-semibold text-[#BE185D] hover:text-[#9D174D]">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>

            <p className="mt-5 text-center text-xs leading-5 text-[#B09099]">
              For danger signs like heavy bleeding, convulsions, severe headache, or trouble breathing, call emergency care immediately.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#FFF5F5]">
          <p className="text-sm text-[#6B5057]">Loading sign in...</p>
        </main>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
