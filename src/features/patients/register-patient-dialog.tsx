'use client';

/**
 * "Register New Patient" modal. On save: client-generated UUID v4, active
 * tenant_id, sync_status: 'pending', write to Dexie first (offline-first).
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { db } from '@/db/localDb';
import { generateUUID } from '@/lib/uuid';
import { getCurrentTenantId } from '@/services/auth';
import type { AgeUnit, Gender, Patient } from '@/types/schema';
import { TagInput } from '@/components/tag-input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface RegisterPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a patient is persisted: `saved(id, name)`. */
  onRegistered?: (patient: Patient) => void;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
const GENDERS: Array<{ value: Gender; label: string }> = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

function stamp() {
  return new Date().toISOString();
}

/** Next patient code: P-0001, P-0002 … highest existing per tenant + 1. */
async function nextPatientCode(tenantId: string): Promise<string> {
  const all = await db.patients.where('tenant_id').equals(tenantId).toArray();
  const max = all.reduce((acc, p) => {
    const n = Number.parseInt(p.patient_code.replace(/\D+/g, ''), 10);
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 0);
  return `P-${String(max + 1).padStart(4, '0')}`;
}

export function RegisterPatientDialog({ open, onOpenChange, onRegistered }: RegisterPatientDialogProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: '',
    age_value: '',
    age_unit: 'years' as AgeUnit,
    gender: '' as Gender | '',
    phone: '',
    address: '',
    blood_group: '',
    chronic_conditions: [] as string[],
    allergies: [] as string[],
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const invalid =
    form.full_name.trim() === '' || form.age_value.trim() === '' || form.gender === '';

  const save = async (startConsultation: boolean) => {
    setSaving(true);
    setError(null);
    try {
      const ts = stamp();
      const tenantId = getCurrentTenantId();
      const rawAge = Number.parseInt(form.age_value, 10) || 0;
      let age = 0;
      let age_months: number | undefined = undefined;
      let age_days: number | undefined = undefined;

      if (form.age_unit === 'years') {
        age = rawAge;
      } else if (form.age_unit === 'months') {
        age = 0;
        age_months = rawAge;
      } else if (form.age_unit === 'days') {
        age = 0;
        age_days = rawAge;
      }

      const patient: Patient = {
        id: generateUUID(),
        tenant_id: tenantId,
        patient_code: await nextPatientCode(tenantId),
        full_name: form.full_name.trim(),
        age,
        age_months,
        age_days,
        age_unit: form.age_unit,
        gender: form.gender as Gender,
        phone: form.phone.trim(),
        address: form.address.trim(),
        blood_group: form.blood_group,
        chronic_conditions: form.chronic_conditions,
        allergies: form.allergies,
        medical_surgical_history: '',
        created_at: ts,
        updated_at: ts,
        sync_status: 'pending', // will drain to Supabase via the sync engine
      };
      await db.patients.put(patient);
      onOpenChange(false);
      setForm({
        full_name: '',
        age_value: '',
        age_unit: 'years',
        gender: '',
        phone: '',
        address: '',
        blood_group: '',
        chronic_conditions: [],
        allergies: [],
      });
      onRegistered?.(patient);
      if (startConsultation) router.push(`/consultation/${patient.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Register New Patient</DialogTitle>
          <DialogDescription>
            Saved offline to the local database first; a pending-sync record is
            created for the cloud.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 grid gap-1.5">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={form.full_name}
              onChange={(e) => set('full_name', e.target.value)}
              placeholder="e.g. Anil Sharma"
              autoFocus
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="age_value">বয়স (Age) *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="age_value"
                type="number"
                min={0}
                max={150}
                value={form.age_value}
                onChange={(e) => set('age_value', e.target.value)}
                placeholder="যেমন: ৫"
                className="flex-1 font-semibold"
              />
              <Select
                value={form.age_unit}
                onValueChange={(v) => set('age_unit', v as AgeUnit)}
              >
                <SelectTrigger className="w-32 shrink-0 bg-slate-50 border-slate-300 font-medium">
                  <SelectValue placeholder="একক" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="years">বছর (Years)</SelectItem>
                  <SelectItem value="months">মাস (Months)</SelectItem>
                  <SelectItem value="days">দিন (Days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Gender *</Label>
            <Select value={form.gender} onValueChange={(v) => set('gender', v as Gender)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {GENDERS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="01700-000000"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="address">Address (ঠিকানা)</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="e.g. পার্বতীপুর, দিনাজপুর"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="blood_group">Blood Group</Label>
            <Input
              id="blood_group"
              list="blood-groups"
              value={form.blood_group}
              onChange={(e) => set('blood_group', e.target.value)}
              placeholder="e.g. O+"
            />
            <datalist id="blood-groups">
              {BLOOD_GROUPS.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </div>
          <div className="col-span-2 grid gap-1.5">
            <Label>Chronic Conditions</Label>
            <TagInput
              value={form.chronic_conditions}
              onChange={(v) => set('chronic_conditions', v)}
              placeholder="Press Enter to add, e.g. Diabetes"
            />
          </div>
          <div className="col-span-2 grid gap-1.5">
            <label className="text-sm font-medium text-red-700">Known Allergies</label>
            <TagInput
              danger
              value={form.allergies}
              onChange={(v) => set('allergies', v)}
              placeholder="Press Enter to add, e.g. Penicillin"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="outline" disabled={saving || invalid} onClick={() => void save(false)}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            Save Patient
          </Button>
          <Button disabled={saving || invalid} onClick={() => void save(true)}>
            Register & Start Consultation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
