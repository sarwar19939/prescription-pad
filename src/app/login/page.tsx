'use client';

/**
 * Multi-Doctor Authentication & Clinic Onboarding View:
 * Supports Supabase Auth (Sign In & Sign Up) with offline session persistence.
 * If the doctor goes offline, they can proceed seamlessly with their cached session.
 */
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, CloudOff, Loader2, Sparkles, Stethoscope, UserCheck } from 'lucide-react';

import { getCachedSession, loginDoctor, signUpDoctor } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-neutral-500">লোড হচ্ছে…</div>}>
      <LoginFormContent />
    </Suspense>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [specialty, setSpecialty] = useState('General Physician');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [cachedUser, setCachedUser] = useState<string | null>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const session = getCachedSession();
    if (session) {
      setCachedUser(session.doctorName || session.email);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await loginDoctor(email, password);
      } else {
        await signUpDoctor(email, password, clinicName, doctorName, specialty);
      }
      router.push('/patients');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleContinueOffline = () => {
    router.push('/patients');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-slate-200 shadow-xl bg-white rounded-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-sm">
            <Stethoscope className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
            {mode === 'signin' ? 'লগইন করুন (Doctor Sign In)' : 'নতুন চেম্বার রেজিস্ট্রেশন (Doctor Sign Up)'}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            {mode === 'signin'
              ? 'আপনার চেম্বার একাউন্টে প্রবেশ করে প্রেসক্রিপশন ও রোগী দেখুন।'
              : 'আপনার নিজস্ব নাম, ডিগ্রি ও চেম্বার দিয়ে সম্পূর্ণ আলাদা ও স্বাধীন অ্যাকাউন্ট খুলুন।'}
          </CardDescription>

          {/* Toggle Tabs */}
          <div className="mt-3 grid grid-cols-2 p-1 rounded-xl bg-slate-100 text-xs font-bold border border-slate-200">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); }}
              className={`py-1.5 rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              লগইন (Sign In)
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`py-1.5 rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              নতুন রেজিস্ট্রেশন (Sign Up)
            </button>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3 text-xs pt-1">
            {!isOnline && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-amber-800">
                <CloudOff className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <strong className="font-semibold">ইন্টারনেট অফলাইন:</strong>
                  <p className="mt-0.5 text-[11px]">
                    অফলাইনেও সম্পূর্ণ সফটওয়্যার কাজ করবে। পুনরায় ইন্টারনেট কানেক্ট হলে ক্লাউডে সিঙ্ক হয়ে যাবে।
                  </p>
                </div>
              </div>
            )}

            {cachedUser && (
              <div className="flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50/50 p-2.5 text-teal-900">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-teal-600 shrink-0" />
                  <span className="text-xs">চলমান একাউন্ট: <strong>{cachedUser}</strong></span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleContinueOffline}
                  className="h-7 text-xs border-teal-300 text-teal-900 hover:bg-teal-100 font-bold"
                >
                  প্রবেশ করুন →
                </Button>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-1.5 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-rose-700 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div>
                  <Label className="text-xs font-bold text-slate-700">ডাক্তারের নাম (Doctor Name) *</Label>
                  <Input
                    required
                    placeholder="যেমন: ডাঃ রফিকুল ইসলাম"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="mt-1 h-9 text-xs rounded-xl border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-700">ক্লিনিক / চেম্বারের নাম (Clinic / Chamber Name) *</Label>
                  <Input
                    required
                    placeholder="যেমন: সেন্ট্রাল ক্লিনিক ও ডায়াগনস্টিক সেন্টার"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="mt-1 h-9 text-xs rounded-xl border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-700">ডিগ্রি ও স্পেশালিটি (Specialty / Degrees)</Label>
                  <Input
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="যেমন: MBBS, BCS (Health), FCPS (Medicine)"
                    className="mt-1 h-9 text-xs rounded-xl border-slate-300"
                  />
                </div>
              </>
            )}

            <div>
              <Label className="text-xs font-bold text-slate-700">ইমেইল ঠিকানা (Email Address) *</Label>
              <Input
                type="email"
                required
                placeholder="doctor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-9 text-xs rounded-xl border-slate-300"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700">পাসওয়ার্ড (Password) *</Label>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 h-9 text-xs rounded-xl border-slate-300"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2.5 pt-2 pb-5">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : mode === 'signin' ? (
                'লগইন করুন (Sign In)'
              ) : (
                'রেজিস্ট্রেশন করে চেম্বার শুরু করুন (Create Account)'
              )}
            </Button>

            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
              }}
              className="text-xs text-slate-500 hover:text-teal-700 font-medium"
            >
              {mode === 'signin'
                ? 'নতুন ডাক্তার বন্ধু? এখানে ক্লিক করে নতুন চেম্বার খুলুন'
                : 'অলরেডি অ্যাকাউন্ট আছে? এখানে ক্লিক করে লগইন করুন'}
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
