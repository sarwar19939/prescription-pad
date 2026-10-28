'use client';

/**
 * VoiceScribeDialog — Ambient AI Voice Clinical Scribe.
 * Listens to doctor-patient consultation dialogue in Bengali or English,
 * and extracts Chief Complaints (C/C), Vitals, History Notes (H/O),
 * Examination findings (O/E), and Advice into the prescription pad.
 * Does NOT auto-diagnose or auto-prescribe medicines, leaving clinical decision
 * to the doctor and specialized tools (AI Co-Pilot, Clinical Photo Vision).
 */
import { useEffect, useRef, useState } from 'react';
import { Loader2, Mic, MicOff, Radio, Sparkles } from 'lucide-react';

import { db } from '@/db/localDb';
import { processVoiceConsultation, type ScribeExtractionResult } from '@/services/aiScribeService';
import type { Encounter, Patient, Vitals } from '@/types/schema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { VoiceScribeResults } from './voice-scribe-results';

const SAMPLE_DIALOGUES = [
  {
    label: 'সর্দি-কাশি ও জ্বর ডায়ালগ',
    text: 'ডাক্তার: আপনার কী সমস্যা?\nরোগী: ডাক্তার সাহেব, ৩ দিন ধরে খুব জ্বর আর শুকনো কাশি। গা-হাত-পা খুব ব্যথা করছে।\nডাক্তার: বমি ভাব বা ডায়রিয়া আছে? প্রেসার মেপে দেখলাম ১২০ বাই ৮০, টেম্পারেচার ১০১ ডিগ্রি।\nরোগী: না, তবে রাতে কাশির জন্য ঘুমাতে পারি না আর গলা খুব খুসখুস করে।',
  },
  {
    label: 'গ্যাস্ট্রিক ও বুকজ্বালা ডায়ালগ',
    text: 'ডাক্তার: কেমন আছেন? কী সমস্যা হচ্ছে?\nরোগী: স্যার, খাওয়ার পরপরই বুকে তীব্র জ্বালাপোড়া করে আর টক ঢেঁকুর আসে। পেট খুব ফাঁপা লাগে।\nডাক্তার: কোনো বাইরের ভাজাপোড়া খেয়েছিলেন? পালস দেখলাম ৭৬, ওজন ৬৫ কেজি। পেট নরম কিন্তু পেটের উপরিভাগে সামান্য অস্বস্তি আছে।\nরোগী: হ্যাঁ, গতকাল রাতে হোটেলের বিরিয়ানি আর পরাটা খেয়েছিলাম।',
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
  const savedPrefixRef = useRef<string>('');

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
          let sessionText = '';
          for (let i = 0; i < event.results.length; i++) {
            sessionText += event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              sessionText += ' ';
            }
          }
          const full = (savedPrefixRef.current + sessionText).trim();
          setTranscript(full);
        };
        recognition.onerror = () => setListening(false);
        recognition.onend = () => setListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, [lang]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('আপনার ব্রাউজারে স্পিচ রিকগনিশন সাপোর্ট নেই। টেক্সটবক্সে কথা পেস্ট বা টাইপ করতে পারেন।');
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      savedPrefixRef.current = '';
    } else {
      try {
        savedPrefixRef.current = transcript.trim() ? transcript.trim() + ' ' : '';
        recognitionRef.current.lang = lang;
        recognitionRef.current.start();
        setListening(true);
      } catch (err) {
        console.error('Speech recognition error:', err);
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

  const handleApplyDocumentation = async () => {
    if (!result) return;
    const ts = new Date().toISOString();
    const existingComplaints = encounter.chief_complaints || [];
    const mergedComplaints = Array.from(new Set([...existingComplaints, ...(result.chief_complaints || [])]));
    const existingAdvice = encounter.advice || [];
    const mergedAdvice = Array.from(new Set([...existingAdvice, ...(result.advice || [])]));

    const updatedVitals: Vitals = {
      bp: result.vitals_mentioned?.bp || encounter.vitals?.bp || '',
      pulse: result.vitals_mentioned?.pulse || encounter.vitals?.pulse || '',
      temp: result.vitals_mentioned?.temp || encounter.vitals?.temp || '',
      weight: result.vitals_mentioned?.weight || encounter.vitals?.weight || '',
      spo2: result.vitals_mentioned?.spo2 || encounter.vitals?.spo2 || '',
    };

    const newHistory = result.history_notes?.length ? `H/O: ${result.history_notes.join('; ')}` : '';
    const newExam = result.examination_findings ? `O/E: ${result.examination_findings}` : '';
    const updatedFindings = [encounter.clinical_findings, newHistory, newExam].filter(Boolean).join('\n');

    await db.encounters.update(encounter.id, {
      chief_complaints: mergedComplaints,
      vitals: updatedVitals,
      clinical_findings: updatedFindings,
      advice: mergedAdvice,
      updated_at: ts,
      sync_status: 'pending',
    });

    setApplied(true);
    setTimeout(() => {
      setOpen(false);
      setApplied(false);
      setResult(null);
      setTranscript('');
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100/90 px-2.5 py-1 text-xs font-bold text-teal-800 shadow-2xs transition-all"
        >
          <Mic className="h-3.5 w-3.5 text-teal-600 animate-pulse" />
          <span>🎙️ ভয়েস হিস্ট্রি ও O/E স্ক্রাইব</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base text-slate-900">
            <Radio className="h-5 w-5 text-teal-600 animate-pulse" />
            অ্যাম্বিয়েন্ট এআই ভয়েস স্ক্রাইব (হিস্ট্রি ও এক্সামিনেশন)
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            রোগী ও ডাক্তারের কথোপকথন শুনে AI স্বয়ংক্রিয়ভাবে উপসর্গ (C/C), ভাইটালস, হিস্ট্রি ও O/E প্রেসক্রিপশনে প্রস্তুত করে দিবে।
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <Button
              type="button"
              onClick={toggleListening}
              className={`h-10 px-4 rounded-xl text-xs font-bold gap-2 transition-all ${
                listening ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
              }`}
            >
              {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {listening ? 'কথা শোনা বন্ধ করুন' : 'কথা বলা শুরু করুন (Start Recording)'}
            </Button>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-slate-600">ভাষা:</span>
              <button
                type="button"
                onClick={() => setLang('bn-BD')}
                className={`rounded px-2.5 py-1 text-xs font-bold border ${lang === 'bn-BD' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-700'}`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLang('en-US')}
                className={`rounded px-2.5 py-1 text-xs font-bold border ${lang === 'en-US' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-700'}`}
              >
                English
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">স্যাম্পল:</span>
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

          <textarea
            rows={4}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="এখানে কথা বললে লাইভ লেখা উঠবে। প্রয়োজনে নিজে পেস্ট বা সম্পাদন করুন।"
            className="w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed text-slate-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30 font-medium"
          />

          <Button
            type="button"
            onClick={handleProcess}
            disabled={processing || !transcript.trim()}
            className="w-full h-11 bg-gradient-to-r from-teal-600 via-teal-700 to-indigo-700 hover:from-teal-700 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                AI উপসর্গ, ভাইটালস ও এক্সামিনেশন বিশ্লেষণ করছে…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                📋 হিস্ট্রি ও উপসর্গ বিশ্লেষণ করুন (Extract History &amp; Exam)
              </>
            )}
          </Button>

          {result && (
            <VoiceScribeResults
              result={result}
              onApply={handleApplyDocumentation}
              applied={applied}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
