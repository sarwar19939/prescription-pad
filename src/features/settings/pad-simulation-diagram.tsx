'use client';

interface PadSimulationDiagramProps {
  currentPaperLabel: string;
  leftOffset: number;
  rightOffset: number;
  topOffset: number;
  bottomOffset: number;
  hideHeader: boolean;
  hideFooter: boolean;
}

export function PadSimulationDiagram({
  currentPaperLabel,
  leftOffset,
  rightOffset,
  topOffset,
  bottomOffset,
  hideHeader,
  hideFooter,
}: PadSimulationDiagramProps) {
  return (
    <div className="pt-3 border-t border-slate-100">
      <span className="text-xs font-bold text-slate-800 block mb-2">
        লাইভ প্যাড ডায়াগ্রাম (কাগজের সাইজ: {currentPaperLabel}):
      </span>

      <div
        className="relative mx-auto w-64 h-80 rounded-xl border-2 border-slate-400 bg-white shadow-sm flex flex-col justify-between overflow-hidden text-center text-[10px] transition-all"
        style={{
          paddingLeft: `${Math.min(24, Math.max(6, leftOffset * 1.1))}px`,
          paddingRight: `${Math.min(24, Math.max(6, rightOffset * 1.1))}px`,
          paddingTop: '8px',
          paddingBottom: '8px',
        }}
      >
        {/* Header Area */}
        <div
          className={`border border-dashed rounded flex flex-col items-center justify-center transition-all ${
            hideHeader
              ? 'bg-amber-50/80 border-amber-300 text-amber-900 font-bold'
              : 'bg-teal-50/80 border-teal-300 text-teal-900 font-semibold'
          }`}
          style={{ height: `${Math.min(70, Math.max(26, topOffset * 0.9))}px` }}
        >
          {hideHeader ? (
            <span>⚠️ প্রি-প্রিন্টেড হেডার জোন ({topOffset} মিমি ফাঁকা)</span>
          ) : (
            <span>ডিজিটাল হেডার ({topOffset} মিমি মার্জিন)</span>
          )}
        </div>

        {/* Printable Body Zone */}
        <div className="flex-1 my-1.5 border border-dashed border-slate-200 bg-slate-50/50 rounded flex flex-col items-center justify-center text-slate-400 font-semibold text-[9px] p-2">
          <span>℞ ক্লিনিক্যাল প্রেসক্রিপশন লেখার এলাকা</span>
          <span className="text-[8px] text-slate-400 font-normal mt-0.5">
            (রোগীর তথ্য, উপসর্গ, পরীক্ষা, ওষুধ ও পরামর্শ)
          </span>
        </div>

        {/* Footer Area */}
        <div
          className={`border border-dashed rounded flex flex-col items-center justify-center transition-all ${
            hideFooter
              ? 'bg-amber-50/80 border-amber-300 text-amber-900 font-bold'
              : 'bg-slate-100 border-slate-300 text-slate-700 font-semibold'
          }`}
          style={{ height: `${Math.min(50, Math.max(22, bottomOffset * 0.9))}px` }}
        >
          {hideFooter ? (
            <span>⚠️ প্রি-প্রিন্টেড ফুটার জোন ({bottomOffset} মিমি ফাঁকা)</span>
          ) : (
            <span>ডিজিটাল সিগনেচার ও ফুটনোট ({bottomOffset} মিমি)</span>
          )}
        </div>
      </div>
    </div>
  );
}
