import { Check } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../utils/cn";

export function PricingCard({ plan, currentPlan, onSelect }) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-lift",
        plan.highlighted
          ? "border-brand-300 ring-4 ring-brand-50"
          : "border-slate-200 ring-1 ring-slate-100",
      )}
    >
      {plan.highlighted && <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-700 via-brand-600 to-emerald-500" />}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-950">{plan.name}</h3>
        {plan.highlighted && (
          <span className="rounded-md bg-gradient-to-r from-brand-700 to-brand-900 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            Best value
          </span>
        )}
      </div>
      <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">{plan.description}</p>
      <div className="mt-6 flex items-end gap-1">
        <span className="text-4xl font-bold text-slate-950">{plan.price}</span>
        <span className="pb-1 text-sm font-semibold text-slate-500">{plan.cadence}</span>
      </div>
      <div className="mt-5 h-px bg-slate-100" />
      <ul className="mt-5 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
              <Check className="h-3.5 w-3.5" />
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <Button
        className="mt-7 w-full"
        variant={plan.name === currentPlan ? "secondary" : plan.highlighted ? "primary" : "secondary"}
        onClick={() => onSelect?.(plan.name)}
      >
        {plan.name === currentPlan ? "Current plan" : "Upgrade"}
      </Button>
    </article>
  );
}
