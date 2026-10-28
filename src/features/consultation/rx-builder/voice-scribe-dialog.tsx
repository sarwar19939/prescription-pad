'use client';

/**
 * VoiceScribeDialog — Ambient AI Voice Clinical Scribe.
 * Listens continuously to doctor-patient consultation dialogue in Bengali or English,
 * automatically restarting across speech pauses so neither doctor nor patient speech is dropped.
 * Real-time heuristic parsing shows live detected complaints & vitals,
 * and 1-click Auto-Apply directly writes C/C, Vitals, and O/E into the prescription pad.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  HeartPulse,
  Loader2,
  Mic,
  MicOff,
  Radio,
  Sparkles,
  Stethoscope,
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

  const isListeningRef = useRef<boolean>(false);
  const transcriptRef = useRef<string>('');
  const savedPrefixRef = useRef<string>('');
  const recognitionRef = useRef<any>(null);
  const restartTimerRef = useRef<any>(null);

  // Live real-time heuristic detections as they speak
  const liveComplaints = useMemo(() => extractComplaintsFromSpokenText(transcript), [transcript]);
  const liveVitals = useMemo(() => extractVitalsFromSpokenText(transcript), [transcript]);
  const hasLiveVitals = Object.values(liveVitals).some(Boolean);

  const startListeningSession = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('আপনার ব্রাউজারে স্পিচ রিকগনিশন সাপোর্ট নেই। Chrome বা Edge ব্রাউজার ব্যবহার করুন।');
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let sessionText = '';
      for (let i = 0; i < event.results.length; i++) {
        sessionText += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          sessionText += ' ';
        }
      }
      const full = (savedPrefixRef.current + sessionText).trim();
      transcriptRef.current = full;
      setTranscript(full);
    };

    recognition.onerror = (event: any) => {
      // 'no-speech' is natural pause between doctor and patient talking
      if (event.error === 'no-speech') {
        return;
      }
      if (event.error === 'not-allowed') {
        isListeningRef.current = false;
        setListening(false);
        alert('মাইক্রোফোন পারমিশন এলাও করুন।');
        return;
      }
    };

    recognition.onend = () => {
      // Auto-restart across pauses so neither doctor nor patient speech is cut off
      if (isListeningRef.current) {
        if (transcriptRef.current.trim()) {
          savedPrefixRef.current = transcriptRef.current.trim() + ' ';
        }
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(() => {
          if (isListeningRef.current) {
            startListeningSession();
          }
        }, 80);
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

  const stopListeningSession = () => {
    isListeningRef.current = false;
    setListening(false);
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }
  };

  const toggleListening = () => {
    if (listening || isListeningRef.current) {
      stopListeningSession();
    } else {
      isListeningRef.current = true;
      savedPrefixRef.current = transcript.trim() ? transcript.trim() + ' ' : '';
      transcriptRef.current = transcript;
      startListeningSession();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      stopListeningSession();
    }
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
      transcriptRef.current = '';
    }, 1100);
  };

  const handleStopAndAutoApply = async () => {
    stopListeningSession();
    const textToProcess = transcriptRef.current || transcript;
    if (!textToProcess.trim()) return;

    setProcessing(true);
    try {
      const data = await processVoiceConsultation(textToProcess, {
        age: patient.age,
        gender: patient.gender,
        chronic_conditions: patient.chronic_conditions,
        allergies: patient.allergies,
      });
      await applyDataToEncounter(data);
    } catch (err) {
      alert(`AI Scribe Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessPreview = async () => {
    stopListeningSession();
    const textToProcess = transcriptRef.current || transcript;
    if (!textToProcess.trim()) return;

    setProcessing(true);
    try {
      const data = await processVoiceConsultation(textToProcess, {
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
            অ্যাম্বিয়েন্ট এআই ভয়েস স্ক্রাইব (হিস্ট্রি ও এক্সামিনেশন)
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            বিরতিহীন লাইভ মাইক্রোফোন: রোগী ও ডাক্তার উভয়ের কথোপকথন শুনে AI উপসর্গ (C/C), ভাইটালস ও O/E প্রেসক্রিপশনে প্রস্তুত করে দিবে।
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Controls Bar */}
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

          {/* Active Listening Indicator */}
          {listening && (
            <div className="flex items-center justify-between rounded-xl bg-teal-50 border border-teal-200 px-3 py-2 text-xs text-teal-900 animate-fade-in">
              <span className="flex items-center gap-2 font-bold">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-600"></span>
                </span>
                মাইক্রোফোন চালু আছে — রোগী ও ডাক্তার উভয়ের কথা শোনা হচ্ছে…
              </span>
              <span className="text-[11px] font-semibold text-teal-700">বিরতিতে স্বয়ংক্রিয়ভাবে রিস্টার্ট হবে</span>
            </div>
          )}

          {/* Live Detected Symptoms & Vitals Chips */}
          {(liveComplaints.length > 0 || hasLiveVitals) && (
            <div className="space-y-1 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs">
              {liveComplaints.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <HeartPulse className="h-3 w-3 text-rose-500" /> লাইভ শনাক্ত উপসর্গ:
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
                    <Activity className="h-3 w-3 text-teal-600" /> লাইভ ভাইটালস:
                  </span>
                  {liveVitals.bp && <span className="bg-white border border-teal-300 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-teal-900">BP: {liveVitals.bp}</span>}
                  {liveVitals.pulse && <span className="bg-white border border-teal-300 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-teal-900">Pulse: {liveVitals.pulse}</span>}
                  {liveVitals.temp && <span className="bg-white border border-teal-300 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-teal-900">Temp: {liveVitals.temp}</span>}
                  {liveVitals.weight && <span className="bg-white border border-teal-300 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-teal-900">Weight: {liveVitals.weight}</span>}
                </div>
              )}
            </div>
          )}

          {/* Sample Dialogues */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">স্যাম্পল:</span>
            {SAMPLE_DIALOGUES.map((d, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setTranscript(d.text);
                  transcriptRef.current = d.text;
                }}
                className="rounded-md border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
              >
                + {d.label}
              </button>
            ))}
          </div>

          <textarea
            rows={4}
            value={transcript}
            onChange={(e) => {
              setTranscript(e.target.value);
              transcriptRef.current = e.target.value;
            }}
            placeholder="এখানে কথা বললে লাইভ লেখা উঠবে। প্রয়োজনে নিজে পেস্ট বা সম্পাদন করুন।"
            className="w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed text-slate-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30 font-medium"
          />

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              type="button"
              onClick={handleStopAndAutoApply}
              disabled={processing || !transcript.trim()}
              className="h-11 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  অটো-প্রেসক্রিপশনে যুক্ত হচ্ছে…
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 text-amber-300" />
                  ⚡ কথা শেষ ও অটো-প্রেসক্রিপশনে ইনপুট নিন
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleProcessPreview}
              disabled={processing || !transcript.trim()}
              className="h-11 border-slate-300 text-slate-800 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-indigo-600" />
              📋 শুধু প্রিভিউ দেখে যুক্ত করুন
            </Button>
          </div>

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
