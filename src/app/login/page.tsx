'use client';

/**
 * Multi-Doctor Authentication & Clinic Onboarding View:
 * Supports Supabase Auth (Sign In & Sign Up) with offline session persistence.
 * If the doctor goes offline, they can proceed seamlessly with their cached session.
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CloudOff, Loader2, Stethoscope, UserCheck } from 'lucide-react';

import { getCachedSession, loginDoctor, signUpDoctor } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
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
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      <Card className="w-full max-w-md border-neutral-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Stethoscope className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold text-neutral-900">
            {mode === 'signin' ? 'Sign In to MedRecord' : 'Create Clinic Workspace'}
          </CardTitle>
          <CardDescription className="text-xs">
            {mode === 'signin'
              ? 'Access your offline-first clinical workspace & smart prescription pad.'
              : 'Setup your multi-tenant clinic registry and start managing patient encounters.'}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3 text-xs">
            {!isOnline && (
              <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-amber-800">
                <CloudOff className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <strong className="font-semibold">Device is Offline:</strong>
                  <p className="mt-0.5">
                    You can continue working offline. Patient records will save to Dexie and sync when reconnected.
                  </p>
                </div>
              </div>
            )}

            {cachedUser && (
              <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50/50 p-2 text-emerald-800">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-emerald-600" />
                  <span>Active Session: <strong>{cachedUser}</strong></span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleContinueOffline}
                  className="h-6 text-[11px] border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                >
                  Enter Workspace
                </Button>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-1.5 rounded-md border border-red-200 bg-red-50 p-2 text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div>
                  <Label className="text-xs">Doctor Name</Label>
                  <Input
                    required
                    placeholder="Dr. Jane Doe"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="mt-1 h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Clinic / Practice Name</Label>
                  <Input
                    required
                    placeholder="Care Clinic Kolkata"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="mt-1 h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Specialty</Label>
                  <Input
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Internal Medicine, Cardiologist"
                    className="mt-1 h-8 text-xs"
                  />
                </div>
              </>
            )}

            <div>
              <Label className="text-xs">Email Address</Label>
              <Input
                type="email"
                required
                placeholder="doctor@clinic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-8 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs">Password</Label>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 h-8 text-xs"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-xs"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : mode === 'signin' ? (
                'Sign In'
              ) : (
                'Create Clinic & Start'
              )}
            </Button>

            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
              }}
              className="text-xs text-neutral-500 hover:text-emerald-700 hover:underline"
            >
              {mode === 'signin'
                ? "Don't have a workspace? Register new clinic"
                : 'Already have an account? Sign In'}
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
