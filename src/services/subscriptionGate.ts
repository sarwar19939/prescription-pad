/**
 * MedRecord — SaaS Subscription Gate & Feature Quota Logic.
 *
 * Enforces soft feature gates based on tenant.subscription_plan:
 * - Free: Unlimited 0ms offline prescriptions & local Dexie storage.
 * - Pro Clinic: Unlocks Cloud PostgreSQL sync + AI Clinical Co-Pilot.
 * - Enterprise: Multi-doctor branch isolation, custom domain, priority support.
 */
import { db } from '@/db/localDb';
import type { SubscriptionPlan, Tenant } from '@/types/schema';

export type FeatureKey = 'offline_prescriptions' | 'cloud_sync' | 'ai_copilot' | 'multi_device';

export interface PlanMetadata {
  id: SubscriptionPlan;
  name: string;
  tagline: string;
  price: string;
  period: string;
  features: string[];
  allowedFeatures: FeatureKey[];
}

export const PLANS: Record<SubscriptionPlan, PlanMetadata> = {
  free: {
    id: 'free',
    name: 'Free Starter',
    tagline: 'Ideal for independent doctors needing instant, offline prescribing.',
    price: '$0',
    period: 'forever',
    features: [
      'Unlimited 0ms Offline Prescriptions',
      'Local IndexedDB Patient Directory',
      'Print Margin Calibration for Rx Pads',
      'Basic Medical Shorthand Parser',
    ],
    allowedFeatures: ['offline_prescriptions'],
  },
  pro: {
    id: 'pro',
    name: 'Pro Clinic',
    tagline: 'Full power of AI Clinical Decision Support & Cloud Synchronization.',
    price: '$29',
    period: 'per month',
    features: [
      'Everything in Free Starter',
      'Automated Bidirectional Cloud Sync',
      'AI Clinical Co-Pilot & Drug Interaction Safety',
      'AI Lab Report OCR & Biomarker Extractor',
      'Longitudinal Parameter Trend Graphs',
      'Multi-Device Data Access',
    ],
    allowedFeatures: ['offline_prescriptions', 'cloud_sync', 'ai_copilot', 'multi_device'],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Clinic',
    tagline: 'For hospital networks and multi-doctor polyclinics.',
    price: '$99',
    period: 'per month',
    features: [
      'Everything in Pro Clinic',
      'Multi-Branch Tenant Isolation',
      'Custom Clinic Branding & Letterhead Pads',
      'Dedicated Cloud Database & RLS SLA',
      '24/7 Priority Support & Onboarding',
    ],
    allowedFeatures: ['offline_prescriptions', 'cloud_sync', 'ai_copilot', 'multi_device'],
  },
};

/**
 * Checks if a given tenant has access to a specific SaaS feature.
 */
export function hasFeatureAccess(tenant: Tenant | null | undefined, feature: FeatureKey): boolean {
  if (!tenant) return feature === 'offline_prescriptions';
  const plan = tenant.subscription_plan || 'free';
  const meta = PLANS[plan];
  return meta ? meta.allowedFeatures.includes(feature) : false;
}

/**
 * Updates a tenant's subscription tier in local Dexie first (offline-first).
 */
export async function switchSubscriptionPlan(tenantId: string, newPlan: SubscriptionPlan): Promise<void> {
  const ts = new Date().toISOString();
  await db.tenants.update(tenantId, {
    subscription_plan: newPlan,
    updated_at: ts,
    sync_status: 'pending',
  });
}
