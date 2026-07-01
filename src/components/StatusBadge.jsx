import { CheckCircle2, Clock3, AlertTriangle, Circle } from "lucide-react";
import { cn } from "../utils/cn";

const paymentStyles = {
  paid: {
    label: "Paid",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-900/5",
    icon: CheckCircle2,
  },
  unpaid: {
    label: "Unpaid",
    className: "border-blue-200 bg-blue-50 text-blue-700 shadow-blue-900/5",
    icon: Clock3,
  },
  "due-soon": {
    label: "Due Soon",
    className: "border-orange-200 bg-orange-50 text-orange-700 shadow-orange-900/5",
    icon: Clock3,
  },
  overdue: {
    label: "Overdue",
    className: "border-red-200 bg-red-50 text-red-700 shadow-red-900/5",
    icon: AlertTriangle,
  },
};

const clientStyles = {
  Clear: {
    label: "Clear",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-900/5",
    icon: CheckCircle2,
  },
  "Has unpaid": {
    label: "Has unpaid",
    className: "border-amber-200 bg-amber-50 text-amber-700 shadow-amber-900/5",
    icon: Clock3,
  },
  Overdue: {
    label: "Overdue",
    className: "border-red-200 bg-red-50 text-red-700 shadow-red-900/5",
    icon: AlertTriangle,
  },
};

export function StatusBadge({ status, type = "payment", className }) {
  const config = type === "client" ? clientStyles[status] : paymentStyles[status];
  const Icon = config?.icon || Circle;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-bold shadow-sm",
        config?.className || "border-slate-200 bg-slate-50 text-slate-600",
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config?.label || status}
    </span>
  );
}
