'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignupFieldsProps {
  doctorName: string;
  setDoctorName: (val: string) => void;
  clinicName: string;
  setClinicName: (val: string) => void;
  specialty: string;
  setSpecialty: (val: string) => void;
}

export function SignupFields({
  doctorName,
  setDoctorName,
  clinicName,
  setClinicName,
  specialty,
  setSpecialty,
}: SignupFieldsProps) {
  return (
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
  );
}
