'use client';

/**
 * Longitudinal Metrics Comparison Table:
 * Groups matching test parameters across different dates for the patient
 * and highlights abnormal values in red.
 */
import { useMemo } from 'react';
import { format } from 'date-fns';
import { AlertCircle, TrendingUp } from 'lucide-react';

import type { InvestigationReport } from '@/types/schema';
import { Badge } from '@/components/ui/badge';

interface MetricsTrendTableProps {
  reports: InvestigationReport[];
}

/** Known standard reference thresholds for auto-flagging numeric abnormal values */
const REFERENCE_RANGES: Record<string, { min?: number; max?: number; unit: string }> = {
  hba1c: { max: 6.4, unit: '%' },
  fastingbloodsugar: { min: 70, max: 100, unit: 'mg/dL' },
  fbs: { min: 70, max: 100, unit: 'mg/dL' },
  serumcreatinine: { min: 0.6, max: 1.3, unit: 'mg/dL' },
  creatinine: { min: 0.6, max: 1.3, unit: 'mg/dL' },
  hemoglobin: { min: 12.0, max: 17.5, unit: 'g/dL' },
  hb: { min: 12.0, max: 17.5, unit: 'g/dL' },
  totalcholesterol: { max: 200, unit: 'mg/dL' },
  triglycerides: { max: 150, unit: 'mg/dL' },
  ldl: { max: 100, unit: 'mg/dL' },
  hdl: { min: 40, unit: 'mg/dL' },
  sgpt: { max: 50, unit: 'U/L' },
  alt: { max: 50, unit: 'U/L' },
  sgot: { max: 45, unit: 'U/L' },
  ast: { max: 45, unit: 'U/L' },
};

function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parseNumber(val: string | number): number | null {
  if (typeof val === 'number') return val;
  const match = val.match(/[-+]?[0-9]*\.?[0-9]+/);
  return match ? parseFloat(match[0]) : null;
}

export function MetricsTrendTable({ reports }: MetricsTrendTableProps) {
  // Sort reports chronologically (oldest to newest)
  const sortedReports = useMemo(() => {
    return [...reports].sort((a, b) => a.report_date.localeCompare(b.report_date));
  }, [reports]);

  // Aggregate all unique metrics
  const { allMetrics, metricMap } = useMemo(() => {
    const names = new Set<string>();
    const map = new Map<string, Record<string, { value: string | number; isAbnormal: boolean }>>();

    for (const report of sortedReports) {
      const flags = (report.abnormality_flags || []).map((f) => f.toLowerCase());
      for (const [key, val] of Object.entries(report.extracted_metrics || {})) {
        names.add(key);
        const normKey = normalizeKey(key);
        const ref = REFERENCE_RANGES[normKey];

        let isAbnormal = false;
        // Check text flags
        if (flags.some((f) => f.includes(normKey) || (f.includes(key.toLowerCase()) && (f.includes('high') || f.includes('low') || f.includes('abnormal'))))) {
          isAbnormal = true;
        }

        // Check numeric thresholds
        if (ref) {
          const num = parseNumber(val);
          if (num !== null) {
            if (ref.max !== undefined && num > ref.max) isAbnormal = true;
            if (ref.min !== undefined && num < ref.min) isAbnormal = true;
          }
        }

        if (!map.has(key)) map.set(key, {});
        map.get(key)![report.id] = { value: val, isAbnormal };
      }
    }

    return { allMetrics: Array.from(names), metricMap: map };
  }, [sortedReports]);

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-sm text-neutral-500">
        <TrendingUp className="mb-2 h-8 w-8 text-neutral-300" />
        <p>No lab records recorded yet.</p>
        <p className="text-xs text-neutral-400">Upload or manually enter lab results to see trends over time.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Longitudinal Parameter Comparison
        </span>
        <span className="flex items-center gap-1 text-[11px] text-red-600 font-medium">
          <AlertCircle className="h-3 w-3" /> Red indicates out-of-range abnormal value
        </span>
      </div>

      <div className="overflow-x-auto rounded-md border border-neutral-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="sticky left-0 z-10 border-r border-neutral-200 bg-neutral-50 px-3 py-2 font-semibold text-neutral-700">
                Test Parameter
              </th>
              {sortedReports.map((r, i) => (
                <th key={r.id} className="min-w-[120px] px-3 py-2 font-medium text-neutral-600">
                  <div className="font-semibold text-neutral-900">
                    {format(new Date(r.report_date + 'T00:00:00'), 'dd MMM yyyy')}
                  </div>
                  <div className="truncate text-[10px] text-neutral-400">
                    {r.test_name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {allMetrics.map((metric) => {
              const rowData = metricMap.get(metric) || {};
              return (
                <tr key={metric} className="hover:bg-neutral-50/50">
                  <td className="sticky left-0 z-10 border-r border-neutral-200 bg-white px-3 py-2 font-medium text-neutral-800">
                    {metric}
                  </td>
                  {sortedReports.map((r) => {
                    const cell = rowData[r.id];
                    if (!cell) {
                      return (
                        <td key={r.id} className="px-3 py-2 text-neutral-300">
                          —
                        </td>
                      );
                    }
                    return (
                      <td key={r.id} className="px-3 py-2">
                        {cell.isAbnormal ? (
                          <Badge variant="destructive" className="font-semibold text-[11px] px-1.5 py-0.5">
                            {String(cell.value)}
                          </Badge>
                        ) : (
                          <span className="font-medium text-neutral-700">
                            {String(cell.value)}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
