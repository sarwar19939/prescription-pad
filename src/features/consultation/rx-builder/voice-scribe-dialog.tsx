'use client';

/**
 * VoiceScribeDialog — Ambient AI Voice Clinical Scribe.
 * Listens to doctor-patient conversation using standard W3C resultIndex accumulation.
 * Safely recycles across speech pauses so neither speaker's words are lost.
 * 1-click Auto-Apply directly writes authentic C/C, Vitals, and O/E into the prescription pad.
 */
import { useMemo, useRef, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  HeartPulse,
  Loader2,
  Mic,
  MicOff,
  Radio,
  Sparkles,
  Zap,
} from 'lucide-react';

import { db } from '@/db/localDb';
import {
  extractComplaintsFromSpokenText,
  extractVitalsFromSpokenText,
  processVoiceConsultation,
  type ScribeExtractionResult,
} from '@/services/aiScribeService';
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

const PRESET_CHIPS = [
  { label: 'জ্বর ও কাশি', text: 'রোগীর ৩ দিন ধরে খুব তীব্র জ্বর ও শুকনো কাশি। গা-হাত-পা ব্যথা।' },
  { label: 'গ্যাস্ট্রিক ও বুকজ্বালা', text: 'খাওয়ার পরপরই তীব্র বুকজ্বালা করে ও টক ঢেঁকুর আসে। পেট ফাঁপা।' },
  { label: 'পেটব্যথা ও পাতলা পায়খানা', text: 'তীব্র পেটব্যথা ও বারবার পাতলা পায়খানা হচ্ছে। বমি ভাব আছে।' },
  { label: 'ভাইটালস: BP 120/80', text: 'বিপি মেপে দেখলাম ১২০ বাই ৮০, পালস ৭৬।' },
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

  const isListeningRef = useRef<boolean>(false);
  const finalTranscriptRef = useRef<string>('');
  const recognitionRef = useRef<any>(null);
  const restartTimerRef = useRef<any>(null);

  const liveComplaints = useMemo(() => extractComplaintsFromSpokenText(transcript), [transcript]);
  const liveVitals = useMemo(() => extractVitalsFromSpokenText(transcript), [transcript]);
  const hasLiveVitals = Object.values(liveVitals).some(Boolean);

  const setupRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('আপনার ব্রাউজারে স্পিচ রিকগনিশন সাপোর্ট নেই। Chrome ব্রাউজার ব্যবহার করুন।');
      return;
    }

    try {
      recognitionRef.current?.stop();
    } catch (_) {}

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: any) => {
      let finalPart = '';
      let interimPart = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const trans = event.results[i][0]?.transcript || '';
        if (event.results[i].isFinal) {
          finalPart += trans + ' ';
        } else {
          interimPart += trans;
        }
      }
      if (finalPart) {
        finalTranscriptRef.current += finalPart;
      }
      const combined = (finalTranscriptRef.current + interimPart).trim();
      setTranscript(combined);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') return;
      if (event.error === 'not-allowed') {
        isListeningRef.current = false;
        setListening(false);
        alert('মাইক্রোফোন পারমিশন এলাও করুন।');
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(() => {
          if (isListeningRef.current) {
            try {
              recognition.start();
            } catch (_) {
              setupRecognition();
            }
          }
        }, 250);
      } else {
        setListening(false);
      }
    };

    try {
      recognition.start();
      setListening(true);
      recognitionRef.current = recognition;
    } catch (_) {}
  };

  const stopListening = () => {
    isListeningRef.current = false;
    setListening(false);
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    try {
      recognitionRef.current?.stop();
    } catch (_) {}
  };

  const toggleListening = () => {
    if (listening || isListeningRef.current) {
      stopListening();
    } else {
      isListeningRef.current = true;
      finalTranscriptRef.current = transcript.trim() ? transcript.trim() + ' ' : '';
      setupRecognition();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) stopListening();
    setOpen(newOpen);
  };

  const applyDataToEncounter = async (data: ScribeExtractionResult) => {
    const ts = new Date().toISOString();
    const existingComplaints = encounter.chief_complaints || [];
    const mergedComplaints = Array.from(new Set([...existingComplaints, ...(data.chief_complaints || [])]));
    const existingAdvice = encounter.advice || [];
    const mergedAdvice = Array.from(new Set([...existingAdvice, ...(data.advice || [])]));

    const updatedVitals: Vitals = {
      bp: data.vitals_mentioned?.bp || encounter.vitals?.bp || '',
      pulse: data.vitals_mentioned?.pulse || encounter.vitals?.pulse || '',
      temp: data.vitals_mentioned?.temp || encounter.vitals?.temp || '',
      weight: data.vitals_mentioned?.weight || encounter.vitals?.weight || '',
      spo2: data.vitals_mentioned?.spo2 || encounter.vitals?.spo2 || '',
    };

    const newHistory = data.history_notes?.length ? `H/O: ${data.history_notes.join('; ')}` : '';
    const newExam = data.examination_findings ? `O/E: ${data.examination_findings}` : '';
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
      finalTranscriptRef.current = '';
    }, 1000);
  };

  const handleStopAndAutoApply = async () => {
    stopListening();
    const textToProcess = transcript.trim();
    if (!textToProcess) {
      alert('কথোপকথন খালি। কথা বলুন অথবা নিচের কুইক চিপসে ক্লিক করে লক্ষণ যোগ করুন।');
      return;
    }

    setProcessing(true);
    try {
      const data = await processVoiceConsultation(textToProcess, {
        age: patient.age,
        gender: patient.gender,
        chronic_conditions: patient.chronic_conditions,
        allergies: patient.allergies,
      });

      if (!data.chief_complaints?.length && !Object.keys(data.vitals_mentioned || {}).length) {
        alert('কোনো সুনির্দিষ্ট উপসর্গ বা ভাইটালস পাওয়া যায়নি। অনুগ্রহ করে আরও স্পষ্ট করে বলুন বা লিখুন।');
        return;
      }

      await applyDataToEncounter(data);
    } catch (err) {
      alert(`AI Scribe Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleAppendChip = (text: string) => {
    const current = transcript.trim();
    const updated = current ? `${current} ${text}` : text;
    setTranscript(updated);
    finalTranscriptRef.current = updated + ' ';
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            অ্যাম্বিয়েন্ট ভয়েস স্ক্রাইব (হিস্ট্রি ও এক্সামিনেশন)
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            রোগী ও ডাক্তারের কথোপকথন শুনে C/C উপসর্গ, ভাইটালস ও O/E প্রেসক্রিপশনে প্রস্তুত করে দিবে।
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 pt-1">
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
              {listening ? 'কথা সাময়িক বিরতি দিন' : 'কথা বলা শুরু করুন (Start Recording)'}
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

          {listening && (
            <div className="flex items-center justify-between rounded-xl bg-teal-50 border border-teal-200 px-3 py-2 text-xs text-teal-900 animate-fade-in">
              <span className="flex items-center gap-2 font-bold">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-600"></span>
                </span>
                মাইক্রোফোন সক্রিয় — কথা শুনছে…
              </span>
              <span className="text-[11px] font-semibold text-teal-700">বিরতিতে স্বয়ংক্রিয়ভাবে বজায় থাকবে</span>
            </div>
          )}

          {(liveComplaints.length > 0 || hasLiveVitals) && (
            <div className="space-y-1 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs">
              {liveComplaints.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <HeartPulse className="h-3 w-3 text-rose-500" /> শনাক্ত উপসর্গ:
                  </span>
                  {liveComplaints.map((c, i) => (
                    <span key={i} className="rounded-md bg-white border border-slate-300 px-2 py-0.5 text-[11px] font-semibold text-teal-800">
                      ✓ {c}
                    </span>
                  ))}
                </div>
              )}
              {hasLiveVitals && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <Activity className="h-3 w-3 text-teal-600" /> শনাক্ত ভাইটালস:
                  </span>
                  {liveVitals.bp && <span className="bg-white border border-teal-300 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-teal-900">BP: {liveVitals.bp}</span>}
                  {liveVitals.pulse && <span className="bg-white border border-teal-300 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-teal-900">Pulse: {liveVitals.pulse}</span>}
                  {liveVitals.temp && <span className="bg-white border border-teal-300 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-teal-900">Temp: {liveVitals.temp}</span>}
                  {liveVitals.weight && <span className="bg-white border border-teal-300 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-teal-900">Weight: {liveVitals.weight}</span>}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">কুইক প্রেসক্রাইব চিপস:</span>
            {PRESET_CHIPS.map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAppendChip(chip.text)}
                className="rounded-md border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 px-2 py-0.5 text-[11px] font-semibold text-slate-700 transition-colors"
              >
                + {chip.label}
              </button>
            ))}
          </div>

          <textarea
            rows={4}
            value={transcript}
            onChange={(e) => {
              setTranscript(e.target.value);
              finalTranscriptRef.current = e.target.value + ' ';
            }}
            placeholder="এখানে কথা বললে লেখা উঠবে অথবা কীবোর্ড দিয়ে টাইপ করতে পারেন…"
            className="w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed text-slate-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30 font-medium"
          />

          <Button
            type="button"
            onClick={handleStopAndAutoApply}
            disabled={processing}
            className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                অটো-প্রেসক্রিপশনে যুক্ত হচ্ছে…
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 text-amber-300" />
                ⚡ কথা শেষ ও সরাসরি প্রেসক্রিপশনে যুক্ত করুন
              </>
            )}
          </Button>

          {result && (
            <VoiceScribeResults
              result={result}
              onApply={() => applyDataToEncounter(result)}
              applied={applied}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
