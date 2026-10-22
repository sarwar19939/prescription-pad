'use client';

/**
 * Intelligent Diagnosis-Driven Protocol Banner.
 * Appears when the active encounter diagnosis matches a clinical disease protocol,
 * allowing 1-click generation of age- and weight-calibrated prescriptions.
 */
import { useState } from 'react';
import { Check, Sparkles, Wand2 } from 'lucide-react';
import {
  applyProtocolToEncounter,
  matchProtocolsForDiagnosis,
} from '@/services/clinicalProtocolsService';
import type { DiseaseProtocolTemplate } from '@/services/protocolTemplatesData';
import type { Encounter, Patient } from '@/types/schema';
import { Button } from '@/components/ui/button';

interface SuggestedProtocolBannerProps {
  encounter: Encounter;
  patient: Patient;
  onOpenTemplatesModal?: () => void;
}

export function SuggestedProtocolBanner({
  encounter,
  patient,
  onOpenTemplatesModal,
}: SuggestedProtocolBannerProps) {
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const matched = matchProtocolsForDiagnosis(encounter.diagnosis || []);
  if (matched.length === 0) return null;

  const handleApply = async (proto: DiseaseProtocolTemplate) => {
    setLoading(true);
    try {
      await applyProtocolToEncounter(encounter.id, proto, patient, encounter.vitals);
      setAppliedId(proto.id);
      setTimeout(() => setAppliedId(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-3 space-y-2">
      {matched.map((proto) => (
        <div
          key={proto.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-violet-50/70 to-teal-50/60 p-3.5 shadow-2xs transition-all"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Wand2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                  ⚡ ডায়াগনোসিস প্রোটোকল শনাক্ত
                </span>
                <span className="rounded-md bg-indigo-100/80 px-2 py-0.5 text-[11px] font-bold text-indigo-800">
                  {proto.titleBn}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 truncate max-w-md sm:max-w-xl">
                {proto.descriptionBn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              size="sm"
              disabled={loading}
              onClick={() => handleApply(proto)}
              className="h-9 px-3.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition-all"
            >
              {appliedId === proto.id ? (
                <>
                  <Check className="h-4 w-4 mr-1.5 text-emerald-300" />
                  প্রেসক্রিপশনে যুক্ত হয়েছে
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  ১-ক্লিকে প্রেসক্রিপশন তৈরি করুন
                </>
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
