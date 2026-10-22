'use client';

/**
 * Disease Protocol & Prescription Templates Modal.
 * Allows doctors to browse clinical disease templates (Skin, Dengue, Diarrhea,
 * Hypertension, Diabetes, PUD, UTI, etc.) and apply age/weight-adapted Rx in 1 click.
 */
import { useState } from 'react';
import { Check, ChevronRight, Layers, Sparkles, Wand2 } from 'lucide-react';
import {
  applyProtocolToEncounter,
  DISEASE_PROTOCOL_TEMPLATES,
} from '@/services/clinicalProtocolsService';
import type { DiseaseProtocolTemplate } from '@/services/protocolTemplatesData';
import type { Encounter, Patient } from '@/types/schema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const CATEGORIES = [
  'All',
  'Skin & Dermatology',
  'Internal Medicine',
  'Chronic Diseases',
] as const;

export function ProtocolTemplatesDialog({
  encounter,
  patient,
}: {
  encounter: Encounter;
  patient: Patient;
}) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string>('All');
  const [selected, setSelected] = useState<DiseaseProtocolTemplate>(
    DISEASE_PROTOCOL_TEMPLATES[0],
  );
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const filtered =
    category === 'All'
      ? DISEASE_PROTOCOL_TEMPLATES
      : DISEASE_PROTOCOL_TEMPLATES.filter((p) => p.category === category);

  const isPediatric =
    patient.age < 12 ||
    (encounter.vitals?.weight && parseFloat(encounter.vitals.weight) <= 35);

  const handleApply = async () => {
    setLoading(true);
    try {
      await applyProtocolToEncounter(
        encounter.id,
        selected,
        patient,
        encounter.vitals,
      );
      setApplied(true);
      setTimeout(() => {
        setApplied(false);
        setOpen(false);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 rounded-xl border-indigo-200 bg-indigo-50/70 text-indigo-900 hover:bg-indigo-100/80 font-bold text-xs shadow-2xs"
        >
          <Wand2 className="h-3.5 w-3.5 text-indigo-600" />
          <span>রোগভিত্তিক প্রেসক্রিপশন টেমপ্লেট</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-6 rounded-2xl">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                ক্লিনিক্যাল ট্রিটমেন্ট প্রোটোকল ও টেমপ্লেট লাইব্রেরি
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                রোগীর বয়স ({patient.age} বছর) ও ওজনের ভিত্তিতে ওষুধের সঠিক ডোজ সহ প্রস্তুতকৃত প্রোটোকল
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-3 pb-1 border-b border-slate-100">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? 'সকল প্রোটোকল' : cat}
            </button>
          ))}
        </div>

        {/* 2-Column Split: Template List & Details Preview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-hidden pt-3 min-h-[380px]">
          {/* Left Column: Template List */}
          <div className="md:col-span-5 overflow-y-auto space-y-1.5 pr-2">
            {filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                  selected.id === item.id
                    ? 'border-indigo-400 bg-indigo-50/80 text-indigo-950 font-semibold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">{item.titleBn}</div>
                  <div className="text-[11px] text-slate-500">{item.title}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
              </button>
            ))}
          </div>

          {/* Right Column: Preview Selected Protocol */}
          <div className="md:col-span-7 flex flex-col justify-between overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/40 p-4">
            <div className="space-y-3">
              <div>
                <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 uppercase tracking-wider">
                  {selected.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selected.titleBn} ({selected.title})
                </h3>
                <p className="text-xs text-slate-600 mt-1">{selected.descriptionBn}</p>
              </div>

              {/* Medicine list */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  প্রস্তাবিত ওষুধসমূহ ({isPediatric ? 'শিশুদের ডোজ' : 'পূর্ণবয়স্ক ডোজ'}):
                </span>
                <div className="space-y-2">
                  {selected.medicines.map((m, i) => {
                    const profile = isPediatric && m.pediatric ? m.pediatric : m.adult;
                    return (
                      <div
                        key={i}
                        className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">
                            {profile.dosage_form}. {m.brand_name} {profile.strength}
                          </span>
                          <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {profile.schedule} ({profile.meal_timing})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          মেয়াদ: {profile.duration} — {profile.special_instructions}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Advice */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  জীবনযাত্রা ও রোগী পরামর্শ:
                </span>
                <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1">
                  {selected.adviceBn.map((adv, i) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-4 mt-3 border-t border-slate-200 flex justify-end">
              <Button
                type="button"
                disabled={loading}
                onClick={handleApply}
                className="h-10 px-5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
              >
                {applied ? (
                  <>
                    <Check className="h-4 w-4 mr-1.5 text-emerald-300" />
                    প্রেসক্রিপশনে যুক্ত হয়েছে!
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    ১-ক্লিকে প্রেসক্রিপশনে প্রয়োগ করুন
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
