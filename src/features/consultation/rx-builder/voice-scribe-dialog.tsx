'use client';

/**
 * VoiceScribeDialog — Ambient AI Voice Consultation & Dialogue Scribe.
 * Listens to doctor-patient spoken conversation in Bengali or English,
 * and automatically extracts Chief Complaints, Diagnoses, full Prescription, and Advice.
 */
import { useEffect, useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  FileText,
  Languages,
  Loader2,
  Mic,
  MicOff,
  Pill,
  Radio,
  Sparkles,
  Volume2,
  Wand2,
} from 'lucide-react';

import { db } from '@/db/localDb';
import { generateUUID } from '@/lib/uuid';
import {
  processVoiceConsultation,
  type ScribeExtractionResult,
} from '@/services/aiScribeService';
import type { Encounter, Patient, PrescriptionItem } from '@/types/schema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const SAMPLE_DIALOGUES = [
  {
    label: 'সর্দি-কাশি ও জ্বর ডায়ালগ',
    text: 'ডাক্তার: আপনার কী সমস্যা?\nরোগী: ডাক্তার সাহেব, ৩ দিন ধরে খুব জ্বর আর শুকনো কাশি। গা-হাত-পা খুব ব্যথা করছে।\nডাক্তার: বমি ভাব বা ডায়রিয়া আছে?\nরোগী: না, তবে রাতে কাশির জন্য ঘুমাতে পারি না আর গলা খুসখুস করে।',
  },
  {
    label: 'গ্যাস্ট্রিক ও বুকজ্বালা ডায়ালগ',
    text: 'ডাক্তার: কেমন আছেন? কী সমস্যা হচ্ছে?\nরোগী: স্যার, খাওয়ার পরপরই বুকে তীব্র জ্বালাপোড়া করে আর টক ঢেঁকুর আসে। পেট খুব ফাঁপা লাগে।\nডাক্তার: কোনো বাইরের ভাজাপোড়া খেয়েছিলেন?\nরোগী: হ্যাঁ, গতকাল রাতে হোটেলের বিরিয়ানি আর পরাটা খেয়েছিলাম।',
  },
];

export function VoiceScribeDialog({
  encounter,
  patient,
}: {
  encounter: Encounter;
  patient: Patient;
}) {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState<'bn-BD' | 'en-US'>('bn-BD');
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ScribeExtractionResult | null>(null);
  const [applied, setApplied] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API for in-browser speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = lang;

        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript + ' ';
          }
          setTranscript((prev) => (current.trim().length > prev.length ? current : prev + ' ' + current));
        };

        recognition.onerror = () => {
          setListening(false);
        };

        recognition.onend = () => {
          setListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [lang]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('আপনার ব্রাউজারে স্পিচ রিকগনিশন সাপোর্ট নেই। আপনি নিচের টেক্সটবক্সে কথা পেস্ট বা টাইপ করতে পারেন।');
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      try {
        recognitionRef.current.lang = lang;
        recognitionRef.current.start();
        setListening(true);
      } catch (err) {
        console.error('Speech recognition start error:', err);
      }
    }
  };

  const handleProcess = async () => {
    if (!transcript.trim()) return;
    setProcessing(true);
    try {
      const data = await processVoiceConsultation(transcript, {
        age: patient.age,
        gender: patient.gender,
        chronic_conditions: patient.chronic_conditions,
        allergies: patient.allergies,
      });
      setResult(data);
    } catch (err) {
      alert(`AI Scribe Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleApplyToConsultation = async () => {
    if (!result) return;
    const ts = new Date().toISOString();

    // 1. Update chief complaints and diagnosis in encounter
    const existingComplaints = encounter.chief_complaints || [];
    const mergedComplaints = Array.from(new Set([...existingComplaints, ...result.chief_complaints]));

    const existingDiags = encounter.diagnosis || [];
    const newDiags = Array.from(new Set([...existingDiags, result.primary_diagnosis, ...result.differential_diagnoses]));

    const existingAdvice = encounter.advice || [];
    const mergedAdvice = Array.from(new Set([...existingAdvice, ...result.advice]));

    await db.encounters.update(encounter.id, {
      chief_complaints: mergedComplaints,
      diagnosis: newDiags.slice(0, 3),
      advice: mergedAdvice,
      updated_at: ts,
      sync_status: 'pending',
    });

    // 2. Add suggested rational medications into Dexie
    for (const m of result.suggested_medicines) {
      await db.prescription_items.add({
        id: generateUUID(),
        tenant_id: patient.tenant_id,
        encounter_id: encounter.id,
        patient_id: patient.id,
        brand_name: m.brand_name || 'Medicine',
        generic_name: m.generic_name || '',
        dosage_form: m.dosage_form || 'Tab',
        strength: m.strength || 'Standard',
        schedule: m.schedule || '1+0+1',
        meal_timing: m.meal_timing || 'After Meal',
        duration: m.duration || '7 Days',
        special_instructions: m.special_instructions || '',
        created_at: ts,
        updated_at: ts,
        sync_status: 'pending',
      } as PrescriptionItem);
    }

    setApplied(true);
    setTimeout(() => {
      setOpen(false);
      setApplied(false);
      setResult(null);
      setTranscript('');
    }, 1800);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100/90 px-2.5 py-1 text-xs font-bold text-teal-800 shadow-2xs transition-all"
        >
          <Mic className="h-3.5 w-3.5 text-teal-600 animate-pulse" />
          <span>🎙️ ভয়েস স্ক্রাইব (কথা বলে প্রেসক্রিপশন)</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base text-slate-900">
            <Radio className="h-5 w-5 text-teal-600 animate-pulse" />
            অ্যাম্বিয়েন্ট এআই ভয়েস স্ক্রাইব (Voice Consultation Scribe)
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            ডাক্তার ও রোগীর স্বাভাবিক কথোপকথন শুনে AI স্বয়ংক্রিয়ভাবে প্রধান উপসর্গ, রোগ নির্ণয় এবং প্রেসক্রিপশন তৈরি করবে।
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Controls: Microphone Record & Language Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <Button
              type="button"
              onClick={toggleListening}
              className={`h-10 px-4 rounded-xl text-xs font-bold gap-2 transition-all ${
                listening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
              }`}
            >
              {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {listening ? 'কথা শোনা বন্ধ করুন (Stop Recording)' : 'কথা বলা শুরু করুন (Start Voice Input)'}
            </Button>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-slate-600">ভাষা:</span>
              <button
                type="button"
                onClick={() => setLang('bn-BD')}
                className={`rounded px-2 py-1 text-xs font-bold border ${
                  lang === 'bn-BD' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-700'
                }`}
              >
                বাংলা (Bengali)
              </button>
              <button
                type="button"
                onClick={() => setLang('en-US')}
                className={`rounded px-2 py-1 text-xs font-bold border ${
                  lang === 'en-US' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-700'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Quick Demo Dialogues */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">স্যাম্পল কথোপকথন:</span>
            {SAMPLE_DIALOGUES.map((d, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setTranscript(d.text)}
                className="rounded-md border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
              >
                + {d.label}
              </button>
            ))}
          </div>

          {/* Spoken Transcript Box */}
          <div>
            <textarea
              rows={4}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="কথা বলুন... এখানে ডাক্তার ও রোগীর কথোপকথন লাইভ লেখা উঠবে। প্রয়োজনে নিজে সম্পাদন বা পেস্টও করতে পারেন।"
              className="w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed text-slate-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30 font-medium"
            />
          </div>

          {/* Process with AI Scribe Button */}
          <Button
            type="button"
            onClick={handleProcess}
            disabled={processing || !transcript.trim()}
            className="w-full h-11 bg-gradient-to-r from-teal-600 via-teal-700 to-indigo-700 hover:from-teal-700 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                AI কথোপকথন বিশ্লেষণ করছে…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                ✨ AI দিয়ে প্রেসক্রিপশন ও তথ্য তৈরি করুন
              </>
            )}
          </Button>

          {/* Extracted Results Card */}
          {result && (
            <div className="space-y-3 rounded-2xl border border-teal-200 bg-gradient-to-b from-teal-50/60 via-white to-indigo-50/30 p-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-teal-100 pb-2">
                <span className="text-xs font-bold text-teal-950 uppercase tracking-wider">
                  নির্ণীত রোগ: {result.primary_diagnosis}
                </span>
                <span className="rounded bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5">
                  AI Scribe Extracted
                </span>
              </div>

              {/* Chief Complaints */}
              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1">চিহ্নিত উপসর্গ (C/C):</span>
                <div className="flex flex-wrap gap-1">
                  {result.chief_complaints.map((c, i) => (
                    <span key={i} className="rounded-md bg-white border border-teal-200 px-2 py-0.5 text-xs font-semibold text-slate-800">
                      • {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Medicines */}
              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1">প্রস্তাবিত ঔষধমালা ({result.suggested_medicines.length}টি):</span>
                <div className="space-y-1">
                  {result.suggested_medicines.map((m, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-white border border-slate-200 p-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{m.dosage_form}. {m.brand_name} {m.strength}</span>
                        <span className="text-slate-500 text-[11px] ml-1">({m.generic_name})</span>
                      </div>
                      <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[11px]">
                        {m.schedule} ({m.meal_timing})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advice */}
              {result.advice.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-0.5">পরামর্শ:</span>
                  <ul className="text-xs text-slate-600 space-y-0.5">
                    {result.advice.map((adv, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-teal-600 font-bold">•</span> <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 1-Click Apply Button */}
              <Button
                type="button"
                onClick={handleApplyToConsultation}
                disabled={applied}
                className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 mt-2"
              >
                {applied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                    সফলভাবে প্রেসক্রিপশনে প্রয়োগ করা হয়েছে!
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    ১-ক্লিকে প্রেসক্রিপশন ও তথ্যে প্রয়োগ করুন
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
