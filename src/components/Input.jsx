import { cn } from "../utils/cn";

const fieldClass =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-50";

export function Input({ label, id, icon: Icon, className, helper, error, ...props }) {
  return (
    <label className="block text-sm font-medium text-slate-700" htmlFor={id}>
      {label && <span className="mb-1.5 block">{label}</span>}
      <span className="relative block">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
        <input
          id={id}
          className={cn(fieldClass, Icon && "pl-9", error && "border-red-300 focus:border-red-500 focus:ring-red-100", className)}
          {...props}
        />
      </span>
      {helper && !error && <span className="mt-1.5 block text-xs text-slate-500">{helper}</span>}
      {error && <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

export function Select({ label, id, className, children, helper, error, ...props }) {
  return (
    <label className="block text-sm font-medium text-slate-700" htmlFor={id}>
      {label && <span className="mb-1.5 block">{label}</span>}
      <select
        id={id}
        className={cn(fieldClass, "appearance-none", error && "border-red-300 focus:border-red-500 focus:ring-red-100", className)}
        {...props}
      >
        {children}
      </select>
      {helper && !error && <span className="mt-1.5 block text-xs text-slate-500">{helper}</span>}
      {error && <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

export function TextArea({ label, id, className, helper, error, rows = 4, ...props }) {
  return (
    <label className="block text-sm font-medium text-slate-700" htmlFor={id}>
      {label && <span className="mb-1.5 block">{label}</span>}
      <textarea
        id={id}
        rows={rows}
        className={cn(fieldClass, "min-h-24 resize-y", error && "border-red-300 focus:border-red-500 focus:ring-red-100", className)}
        {...props}
      />
      {helper && !error && <span className="mt-1.5 block text-xs text-slate-500">{helper}</span>}
      {error && <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}
