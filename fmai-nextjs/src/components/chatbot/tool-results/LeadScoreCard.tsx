"use client";

import { useCardCopy } from "./cardI18n";
import { CardShell, CardTitle } from "./CardShell";

// Serves get_roi_estimate only; qualify_lead is scoring for the sales team and renders nothing.
export interface LeadScoreData {
  monthlySavings?: number | string;
  roiPercent?: number;
  paybackPeriodMonths?: number;
  breakdown?: {
    hoursSavedPerWeek?: number;
    subscriptionCost?: number;
  };
}

export function LeadScoreCard({ data }: { data: LeadScoreData }) {
  const { t, money, payback } = useCardCopy();
  const hours = data.breakdown?.hoursSavedPerWeek;
  const subscription = data.breakdown?.subscriptionCost;
  const figures = [
    { label: t.monthlySavings, value: money(data.monthlySavings) },
    {
      label: t.roi,
      value:
        data.roiPercent !== undefined && data.roiPercent !== null
          ? `${data.roiPercent}%`
          : null,
    },
    {
      label: t.payback,
      value:
        data.paybackPeriodMonths !== undefined &&
        data.paybackPeriodMonths !== null
          ? payback(data.paybackPeriodMonths)
          : null,
    },
  ].filter((f) => f.value);

  return (
    <CardShell>
      <CardTitle title={t.roiHeader} />
      <div className="grid grid-cols-3 gap-2">
        {figures.map((f) => (
          <div key={f.label} data-roi-figure className="min-w-0">
            <p className="font-mono text-sm font-bold text-accent-system">
              {f.value}
            </p>
            <p className="mt-0.5 text-[11px] leading-tight text-text-secondary">
              {f.label}
            </p>
          </div>
        ))}
      </div>
      {hours !== undefined && subscription !== undefined && (
        <p className="border-t border-border-primary pt-2.5 text-xs text-text-secondary/70">
          {t.assumptions(hours, money(subscription) ?? "")}
        </p>
      )}
    </CardShell>
  );
}

export default LeadScoreCard;
