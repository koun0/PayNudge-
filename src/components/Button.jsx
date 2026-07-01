import { cn } from "../utils/cn";

const variants = {
  primary:
    "bg-gradient-to-r from-brand-700 via-brand-700 to-brand-800 text-white shadow-sm shadow-brand-900/15 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-900/20 focus-visible:outline-brand-700",
  secondary:
    "border border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md focus-visible:outline-brand-700",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-brand-700",
  success:
    "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-emerald-700",
  danger:
    "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-900/15 focus-visible:outline-red-700",
  warning:
    "bg-amber-500 text-white shadow-sm hover:bg-amber-600 focus-visible:outline-amber-600",
};

const sizes = {
  sm: "h-9 gap-2 px-3 text-sm",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-5 text-base",
  icon: "h-10 w-10 justify-center p-0",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-55",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
