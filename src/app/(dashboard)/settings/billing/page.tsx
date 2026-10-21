'use client';

/**
 * SaaS Subscription & Billing View:
 * Displays current clinic plan tier, features, and plan upgrade actions.
 * Updates local Dexie tenant record first (offline-first).
 */
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import Link from 'next/link';
import { ArrowLeft, Check, Crown, Loader2, Sparkles, Zap } from 'lucide-react';

import { db } from '@/db/localDb';
import { getCurrentTenantId } from '@/services/auth';
import { PLANS, switchSubscriptionPlan } from '@/services/subscriptionGate';
import type { SubscriptionPlan } from '@/types/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function BillingPage() {
  const tenantId = getCurrentTenantId();
  const tenant = useLiveQuery(() => db.tenants.get(tenantId), [tenantId]);
  const [upgrading, setUpgrading] = useState<SubscriptionPlan | null>(null);

  if (!tenant) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  const currentPlan = tenant.subscription_plan || 'free';

  const handleSelectPlan = async (planKey: SubscriptionPlan) => {
    if (planKey === currentPlan) return;
    setUpgrading(planKey);
    try {
      await switchSubscriptionPlan(tenant.id, planKey);
    } finally {
      setUpgrading(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="h-8">
            <Link href="/settings">
              <ArrowLeft className="h-4 w-4 mr-1" /> Settings
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Subscription &amp; Plans</h1>
            <p className="text-xs text-neutral-500">Manage your SaaS tier and multi-tenant quotas</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">Current Plan:</span>
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold uppercase text-xs">
            {PLANS[currentPlan].name}
          </Badge>
        </div>
      </div>

      {/* Plan Tiers Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {(Object.keys(PLANS) as SubscriptionPlan[]).map((planKey) => {
          const plan = PLANS[planKey];
          const isCurrent = planKey === currentPlan;
          const isPro = planKey === 'pro';

          return (
            <Card
              key={planKey}
              className={`relative flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'border-2 border-emerald-600 shadow-md ring-1 ring-emerald-600'
                  : isPro
                    ? 'border-neutral-300 shadow-sm hover:border-emerald-400'
                    : 'border-neutral-200'
              }`}
            >
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-700 px-3 py-0.5 text-[11px] font-semibold text-white shadow-xs">
                  Most Popular
                </div>
              )}

              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold flex items-center gap-1.5">
                    {planKey === 'enterprise' ? (
                      <Crown className="h-5 w-5 text-amber-500" />
                    ) : planKey === 'pro' ? (
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Zap className="h-5 w-5 text-neutral-400" />
                    )}
                    {plan.name}
                  </CardTitle>
                  {isCurrent && (
                    <Badge variant="secondary" className="text-[10px] bg-neutral-100 text-neutral-700">
                      Active
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs mt-1 min-h-[32px]">{plan.tagline}</CardDescription>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-neutral-900">{plan.price}</span>
                  <span className="text-xs text-neutral-500">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="border-t border-neutral-100 pt-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
                    Included Features
                  </span>
                  <ul className="space-y-2 text-xs text-neutral-700">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <Button
                  className={`w-full text-xs ${
                    isCurrent
                      ? 'bg-neutral-100 text-neutral-500 hover:bg-neutral-100 cursor-default'
                      : isPro
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        : 'border-neutral-300'
                  }`}
                  variant={isCurrent ? 'ghost' : isPro ? 'default' : 'outline'}
                  disabled={isCurrent || upgrading !== null}
                  onClick={() => handleSelectPlan(planKey)}
                >
                  {upgrading === planKey ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : isCurrent ? (
                    'Current Plan'
                  ) : (
                    `Switch to ${plan.name}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
