export function DashboardCard({ title, value, helper, icon: Icon, tone = "blue" }) {
  const tones = {
    blue: "bg-brand-50 text-brand-700 ring-brand-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    red: "bg-red-50 text-red-700 ring-red-100",
  };

  return (
    <section className="panel-gradient relative overflow-hidden rounded-2xl border border-white/80 p-5 shadow-card ring-1 ring-slate-200/80 transition duration-200 hover:-translate-y-0.5 hover:shadow-soft">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">{value}</p>
        </div>
        {Icon && (
          <div className={`rounded-md p-2.5 ring-1 ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {helper && <p className="mt-4 min-h-10 text-sm leading-5 text-slate-500">{helper}</p>}
    </section>
  );
}
