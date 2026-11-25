'use client';

/**
 * Multi-Doctor Authentication, Recovery & Clinic Onboarding View:
 * Supports Supabase Auth (Sign In, Sign Up, Email Confirmation Resend, Password Recovery)
 * with offline session persistence and instant fallback.
 */
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

import {
  getCachedSession,
  loginAsDrSarwar,
  loginDoctor,
  loginOfflineFallback,
  requestPasswordReset,
  resendConfirmationEmail,
  signUpDoctor,
  updatePassword,
} from '@/services/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthHeader, type AuthMode } from './auth-header';
import { EmailUnconfirmedAlert } from './email-unconfirmed-alert';
import { LoginFooter } from './login-footer';
import { QuotaAlert } from './quota-alert';
import { SessionStatusBanners } from './session-status-banners';
import { SignupFields } from './signup-fields';

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
  const initialMode: AuthMode =
    searchParams.get('mode') === 'signup'
      ? 'signup'
      : searchParams.get('mode') === 'forgot'
      ? 'forgot'
      : searchParams.get('mode') === 'update-password'
      ? 'update-password'
      : 'signin';

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [specialty, setSpecialty] = useState('General Physician');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [cachedUser, setCachedUser] = useState<string | null>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const session = getCachedSession();
    if (session) {
      setCachedUser(session.doctorName || session.email);
    }
    if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
      setMode('update-password');
    }
  }, []);

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await loginDoctor(email, password);
        router.push('/patients');
      } else if (mode === 'signup') {
        await signUpDoctor(email, password, clinicName, doctorName, specialty);
        router.push('/patients');
      } else if (mode === 'forgot') {
        await requestPasswordReset(email);
        setSuccess('পাসওয়ার্ড রিসেটের লিংক আপনার ইমেইলে পাঠানো হয়েছে। ইনবক্স অথবা Spam ফোল্ডার চেক করুন।');
      } else if (mode === 'update-password') {
        await updatePassword(password);
        setSuccess('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে! রোগী তালিকায় নিয়ে যাওয়া হচ্ছে...');
        setTimeout(() => router.push('/patients'), 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirm = async () => {
    if (!email) {
      setError('অনুগ্রহ করে আগে ইমেইল ঠিকানাটি লিখুন।');
      return;
    }
    setResending(true);
    setError(null);
    try {
      await resendConfirmationEmail(email);
      setSuccess('নতুন কনফার্মেশন লিংক পাঠানো হয়েছে! অনুগ্রহ করে আপনার জিমেইল ইনবক্স বা Spam ফোল্ডার চেক করে লিংকে ক্লিক করুন।');
    } catch (err: any) {
      setError(err?.message || 'কনফার্মেশন ইমেইল পাঠানো সম্ভব হয়নি।');
    } finally {
      setResending(false);
    }
  };

  const handleInstantLogin = async () => {
    if (!email) {
      setError('অনুগ্রহ করে আগে আপনার ইমেইলটি লিখুন।');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await loginOfflineFallback(email);
      router.push('/patients');
    } catch (err: any) {
      setError(err?.message || 'সরাসরি প্রবেশ করা সম্ভব হয়নি।');
    } finally {
      setLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    try {
      if (typeof window !== 'undefined') {
        if (window.indexedDB) {
          window.indexedDB.deleteDatabase('medrecord');
        }
        localStorage.removeItem('medrecord_initial_seed_done');
      }
    } catch (e) {
      console.warn('Error clearing database:', e);
    }
    window.location.reload();
  };

  const handleQuickDrSarwar = async () => {
    setLoading(true);
    try {
      await loginAsDrSarwar();
      router.push('/patients');
    } finally {
      setLoading(false);
    }
  };

  const isQuotaError = Boolean(
    error &&
      (error.toLowerCase().includes('quotaexceedederror') ||
        error.toLowerCase().includes('backing store') ||
        error.toLowerCase().includes('full disk') ||
        error.toLowerCase().includes('storage quota'))
  );

  const isEmailNotConfirmed = Boolean(
    error && error.toLowerCase().includes('email not confirmed')
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-slate-200 shadow-xl bg-white rounded-2xl">
        <AuthHeader mode={mode} onModeChange={handleModeChange} />

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3 text-xs pt-1">
            <SessionStatusBanners
              isOnline={isOnline}
              cachedUser={cachedUser}
              mode={mode}
              onEnter={() => router.push('/patients')}
            />

            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800 text-xs flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                <p className="text-[11px] leading-relaxed font-medium">{success}</p>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                  <div className="space-y-1">
                    <strong className="font-bold text-rose-900 block">
                      {isQuotaError ? 'স্টোরেজ এরর (Disk Full)' : 'লগইন বা রেজিস্ট্রেশনে সমস্যা হয়েছে'}
                    </strong>
                    <p className="text-[11px] leading-relaxed text-rose-800">{error}</p>
                  </div>
                </div>

                {isEmailNotConfirmed && (
                  <EmailUnconfirmedAlert
                    resending={resending}
                    onResend={handleResendConfirm}
                    onInstantLogin={handleInstantLogin}
                  />
                )}

                {isQuotaError && <QuotaAlert onResetDatabase={handleResetDatabase} />}
              </div>
            )}

            {mode === 'signup' && (
              <SignupFields
                doctorName={doctorName}
                setDoctorName={setDoctorName}
                clinicName={clinicName}
                setClinicName={setClinicName}
                specialty={specialty}
                setSpecialty={setSpecialty}
              />
            )}

            {mode !== 'update-password' && (
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
            )}

            {(mode === 'signin' || mode === 'signup' || mode === 'update-password') && (
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-700">
                    {mode === 'update-password' ? 'নতুন পাসওয়ার্ড (New Password) *' : 'পাসওয়ার্ড (Password) *'}
                  </Label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => handleModeChange('forgot')}
                      className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold hover:underline"
                    >
                      পাসওয়ার্ড ভুলে গেছেন?
                    </button>
                  )}
                </div>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 h-9 text-xs rounded-xl border-slate-300"
                />
              </div>
            )}
          </CardContent>

          <LoginFooter
            mode={mode}
            loading={loading}
            onModeChange={handleModeChange}
            onQuickDrSarwar={handleQuickDrSarwar}
          />
        </form>
      </Card>
    </div>
  );
}
