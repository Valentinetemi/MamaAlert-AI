'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, ArrowRight, Baby, CalendarDays, CheckCircle, Eye, EyeOff, HeartPulse, Hospital, ShieldCheck } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [hospital, setHospital] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !fullName || !dueDate) {
      setError('All fields are required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured yet. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in frontend/.env.local.');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            due_date: dueDate,
            hospital,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setSuccess(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setDueDate('');
      setHospital('');

      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fff8f2] text-[#2f2524]">
      <div className="grid min-h-screen lg:grid-cols-[0.96fr_1.04fr]">
        <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8">
          <div className="w-full max-w-[520px]">
            <Link href="/landing" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#6f4f48] hover:text-[#2f2524]">
              <HeartPulse className="h-4 w-4" />
              MamaAlert
            </Link>

            <div className="rounded-lg border border-[#ecd8ce] bg-white p-6 shadow-[0_18px_60px_rgba(74,49,41,0.10)] sm:p-8">
              <div className="mb-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-[#ffe4dc] text-[#884433]">
                  <Baby className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-semibold text-[#2f2524]">Create your care account</h2>
                <p className="mt-2 text-sm leading-6 text-[#75615c]">
                  Set up a private MamaAlert profile for symptom checks, visit reminders, hydration tracking, and pregnancy support.
                </p>
              </div>

              {success ? (
                <div className="space-y-4 rounded-md border border-green-200 bg-green-50 p-5 text-center">
                  <div className="flex justify-center">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-950">Your MamaAlert account is ready.</p>
                    <p className="mt-2 text-sm leading-6 text-green-800">
                      Check your email to confirm your account. We are taking you to sign in now.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-5">
                  {error && (
                    <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#4a3a36]">Full name</label>
                      <Input
                        type="text"
                        placeholder="Adaeze Okafor"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        disabled={loading}
                        className="h-12 rounded-md border-[#d9c8c0] bg-[#fffdfb]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#4a3a36]">Due date</label>
                      <Input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                        disabled={loading}
                        className="h-12 rounded-md border-[#d9c8c0] bg-[#fffdfb]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#4a3a36]">Hospital or clinic</label>
                    <Input
                      type="text"
                      placeholder="Lagos University Teaching Hospital"
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      disabled={loading}
                      className="h-12 rounded-md border-[#d9c8c0] bg-[#fffdfb]"
                    />
                  </div>

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

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#4a3a36]">Password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="At least 6 characters"
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

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#4a3a36]">Confirm password</label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Repeat password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          disabled={loading}
                          className="h-12 rounded-md border-[#d9c8c0] bg-[#fffdfb] pr-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#75615c] hover:text-[#2f2524]"
                          disabled={loading}
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="h-12 w-full rounded-md bg-[#884433] text-white hover:bg-[#6d3628]" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create care account'}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              )}

              {!success && (
                <div className="mt-6 border-t border-[#ecd8ce] pt-6">
                  <p className="text-center text-sm text-[#75615c]">
                    Already have an account?{' '}
                    <Link href="/signin" className="font-semibold text-[#884433] hover:text-[#6d3628]">
                      Sign in
                    </Link>
                  </p>
                </div>
              )}
            </div>

            <p className="mt-5 text-center text-xs leading-5 text-[#8a746f]">
              MamaAlert supports care decisions. It does not replace your doctor, midwife, or emergency services.
            </p>
          </div>
        </section>

        <section className="relative hidden overflow-hidden bg-[#3f2b28] px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[url('/mama-hero.jpg')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-[#2a1b19]/74" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#a8d5bd] text-[#20342d]">
              <HeartPulse className="h-6 w-6" />
            </div>
            <span className="text-xl font-semibold">MamaAlert</span>
          </div>

          <div className="relative max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white/90">
              <ShieldCheck className="h-4 w-4" />
              Care support for pregnancy
            </p>
            <h1 className="text-5xl font-semibold leading-tight">
              Start with a profile that understands your pregnancy.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/82">
              MamaAlert combines your due date, clinic details, symptom reports, and visit reminders so guidance feels timely and practical.
            </p>
          </div>

          <div className="relative grid grid-cols-3 gap-3">
            {[
              { icon: CalendarDays, label: 'Due-date tracking' },
              { icon: Hospital, label: 'Clinic context' },
              { icon: HeartPulse, label: 'Symptom triage' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-md border border-white/14 bg-white/10 p-4 backdrop-blur">
                  <Icon className="mb-3 h-5 w-5 text-[#a8d5bd]" />
                  <p className="text-sm text-white/85">{item.label}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
