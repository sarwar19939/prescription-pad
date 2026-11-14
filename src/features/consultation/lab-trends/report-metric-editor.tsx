'use client';

/**
 * ReportMetricEditor — Dynamic key-value metric editor for investigations.
 */
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface MetricItem {
  key: string;
  value: string;
}

interface ReportMetricEditorProps {
  metrics: MetricItem[];
  onChange: (metrics: MetricItem[]) => void;
}

export function ReportMetricEditor({ metrics, onChange }: ReportMetricEditorProps) {
  const addRow = () => {
    onChange([...metrics, { key: '', value: '' }]);
  };

  const updateRow = (idx: number, field: 'key' | 'value', val: string) => {
    const copy = [...metrics];
    copy[idx] = { ...copy[idx], [field]: val };
    onChange(copy);
  };

  const removeRow = (idx: number) => {
    onChange(metrics.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <Label className="text-xs font-semibold text-slate-700">রিপোর্ট প্যারামিটার ও মান (Metrics)</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addRow}
          className="h-6 text-xs text-teal-800 hover:bg-teal-50 font-bold"
        >
          <Plus className="h-3 w-3 mr-1" /> প্যারামিটার যোগ করুন
        </Button>
      </div>
      <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
        {metrics.map((m, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Input
              placeholder="প্যারামিটার (যেমন: Rhythm / HbA1c)"
              value={m.key}
              onChange={(e) => updateRow(idx, 'key', e.target.value)}
              className="h-7 text-xs flex-1"
            />
            <Input
              placeholder="মান (যেমন: Sinus / 7.2 %)"
              value={m.value}
              onChange={(e) => updateRow(idx, 'value', e.target.value)}
              className="h-7 text-xs flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeRow(idx)}
              className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
