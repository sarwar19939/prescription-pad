'use client';

/**
 * AICopilotQuestions — Interactive Clinical Probing & Missing Information Questionnaire.
 * Prompts the doctor for critical missing parameters (red flags, allergy checks, symptom duration)
 * and feeds the answers back to the AI Clinical Copilot for refined guidance.
 */
import { Check, HelpCircle, Loader2, Sparkles } from 'lucide-react';
import type { ClinicalQuestion } from '@/services/aiClinicalCopilot';
import { Button } from '@/components/ui/button';

interface AICopilotQuestionsProps {
  questions: ClinicalQuestion[];
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, answer: string) => void;
  onSubmitAnswers: () => void;
  loading: boolean;
}

export function AICopilotQuestions({
  questions,
  answers,
  onAnswerChange,
  onSubmitAnswers,
  loading,
}: AICopilotQuestionsProps) {
  if (!questions || questions.length === 0) return null;

  const hasAnyAnswer = Object.values(answers).some((a) => Boolean(a?.trim()));

  return (
    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50/40 p-4 shadow-2xs space-y-3.5">
      <div className="border-b border-indigo-100 pb-2">
        <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-950 uppercase tracking-wider">
          <HelpCircle className="h-4 w-4 text-indigo-600" />
          <span>প্রয়োজনীয় অতিরিক্ত ক্লিনিক্যাল প্রশ্ন (Clarifying Questions)</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">
          সঠিক রোগ নিশ্চিত ও নিরাপদ ড্রাগ নির্বাচনের জন্য নিচের তথ্য নির্বাচন বা লিখুন:
        </p>
      </div>

      <div className="space-y-3">
        {questions.map((q) => {
          const currentAnswer = answers[q.id] || '';
          return (
            <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-3 space-y-2 shadow-2xs">
              <div>
                <p className="text-xs font-bold text-slate-900 leading-snug">{q.question}</p>
                {q.hint && <p className="text-[10px] text-indigo-600 font-medium mt-0.5">💡 {q.hint}</p>}
              </div>

              {q.options && q.options.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {q.options.map((opt, idx) => {
                    const isSelected = currentAnswer === opt;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onAnswerChange(q.id, isSelected ? '' : opt)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold ring-1 ring-indigo-500 shadow-2xs'
                            : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="inline h-3 w-3 mr-1 text-indigo-600" />}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              <input
                type="text"
                placeholder="অথবা অন্য কোনো তথ্য থাকলে লিখুন…"
                value={currentAnswer}
                onChange={(e) => onAnswerChange(q.id, e.target.value)}
                className="w-full h-8 px-2.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/20"
              />
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        onClick={onSubmitAnswers}
        disabled={loading || !hasAnyAnswer}
        className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            তথ্য বিশ্লেষণ ও গাইডেন্স আপডেট হচ্ছে…
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            ✓ এই তথ্য দিয়ে গাইডেন্স রিফ্রেশ করুন (Update Guidance)
          </>
        )}
      </Button>
    </div>
  );
}
