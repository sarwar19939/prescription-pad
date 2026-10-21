'use client';

/**
 * Medicine Catalog — read-only browser of the seeded master list.
 * Full catalog management is a later phase.
 */
import { useLiveQuery } from 'dexie-react-hooks';

import { db } from '@/db/localDb';
import { DEFAULT_TENANT_ID } from '@/db/seedData';
import { getCurrentTenantId } from '@/services/auth';

export default function MedicinesPage() {
  const tenantId = getCurrentTenantId();
  const medicines = useLiveQuery(
    async () => {
      const all = await db.medicine_catalog.toArray();
      const filtered = all.filter((m) => m.tenant_id === tenantId || m.tenant_id === DEFAULT_TENANT_ID);
      return filtered.sort((a, b) => a.brand_name.localeCompare(b.brand_name));
    },
    [tenantId],
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Medicine Catalog</h1>
      <div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-2 font-medium">Brand</th>
              <th className="px-4 py-2 font-medium">Generic</th>
              <th className="px-4 py-2 font-medium">Form</th>
              <th className="px-4 py-2 font-medium">Strength</th>
              <th className="px-4 py-2 font-medium">Manufacturer</th>
            </tr>
          </thead>
          <tbody>
            {(medicines ?? []).map((m) => (
              <tr key={m.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-2 font-medium">{m.brand_name}</td>
                <td className="px-4 py-2 text-neutral-600">{m.generic_name}</td>
                <td className="px-4 py-2 text-neutral-600">{m.dosage_form}</td>
                <td className="px-4 py-2 text-neutral-600">{m.strength}</td>
                <td className="px-4 py-2 text-neutral-600">{m.manufacturer}</td>
              </tr>
            ))}
            {medicines && medicines.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                  Catalog is empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
