import {
  Bell,
  CreditCard,
  LayoutDashboard,
  Menu,
  Settings,
  Tags,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { Button } from "./Button";
import { cn } from "../utils/cn";

const items = [
  { label: "Dashboard", route: "dashboard", icon: LayoutDashboard },
  { label: "Clients", route: "clients", icon: Users },
  { label: "Payments", route: "payments", icon: CreditCard },
  { label: "Reminders", route: "reminders", icon: Bell },
  { label: "Pricing", route: "pricing", icon: Tags },
  { label: "Settings", route: "settings", icon: Settings },
];

export function Sidebar({ route, navigate, open, setOpen }) {
  const isActive = (itemRoute) => route === itemRoute || route.startsWith(`${itemRoute}:`);

  const content = (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-700 text-white shadow-sm shadow-brand-900/20">
          <WalletCards className="h-5 w-5" />
        </span>
        <span className="text-lg font-bold text-slate-950">PayNudge</span>
      </div>

      <div className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.route}
              onClick={() => {
                navigate(item.route);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition",
                isActive(item.route)
                  ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-100"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-lg bg-slate-950 p-4 text-white shadow-card">
          <p className="text-sm font-semibold">Free workspace</p>
          <p className="mt-1 text-xs leading-5 text-slate-300">Track 3 active unpaid payments and upgrade when client volume grows.</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-2/3 rounded-full bg-emerald-400" />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-slate-200/80 bg-white/[0.92] shadow-sm backdrop-blur-xl lg:flex">
        {content}
      </div>

      <div className="fixed left-4 top-4 z-40 lg:hidden">
        <Button variant="secondary" size="icon" onClick={() => setOpen(true)} aria-label="Open sidebar">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/40" onClick={() => setOpen(false)} aria-label="Close sidebar" />
          <aside className="relative flex h-full w-72 max-w-[86vw] flex-col bg-white shadow-lift">
            <Button className="absolute right-3 top-3" variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close sidebar">
              <X className="h-5 w-5" />
            </Button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
