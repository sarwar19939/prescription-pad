import { Suspense } from 'react';

import { ConsultationClient } from '@/features/consultation/consultation-client';

/**
 * /consultation/[patientId] — split-screen longitudinal patient workspace.
 * `params` is accessed inside Suspense so the shell prerenders instantly
 * and the workspace streams in.
 */
export default function ConsultationPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  return (
    <Suspense fallback={<WorkspaceFallback />}>
      <WorkspaceContent params={params} />
    </Suspense>
  );
}

async function WorkspaceContent({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  return <ConsultationClient patientId={patientId} />;
}

function WorkspaceFallback() {
  return (
    <div className="flex h-64 items-center justify-center rounded-md border border-neutral-200 bg-white text-sm text-neutral-500">
      Loading patient workspace…
    </div>
  );
}
