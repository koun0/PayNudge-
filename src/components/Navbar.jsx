import { useState } from "react";
import { ArrowRight, Menu, X, WalletCards } from "lucide-react";
import { Button } from "./Button";

export function BrandMark({ dark = false }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-700 text-white shadow-sm">
        <WalletCards className="h-5 w-5" />
      </span>
      <span className={`text-lg font-bold tracking-normal ${dark ? "text-white" : "text-slate-950"}`}>
        PayNudge
      </span>
    </div>
  );
}

export function Navbar({ navigate }) {
  const [open, setOpen] = useState(false);
  const navLinks = [
    ["Features", "#features"],
    ["Pricing", "#pricing"],
    ["Demo", "demo"],
    ["Login", "login"],
  ];

  const handleClick = (target) => {
    setOpen(false);
    if (target.startsWith("#")) {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    navigate(target);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-white/90 shadow-sm backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate("landing")} className="rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
          <BrandMark />
        </button>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map(([label, target]) => (
            <button
              key={label}
              onClick={() => handleClick(target)}
              className="text-sm font-semibold text-slate-600 transition hover:text-slate-950"
            >
              {label}
            </button>
          ))}
          <Button onClick={() => navigate("signup")} size="sm">
            Start Free
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Open menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-card md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map(([label, target]) => (
              <button
                key={label}
                onClick={() => handleClick(target)}
                className="rounded-md px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {label}
              </button>
            ))}
            <Button className="mt-2" onClick={() => navigate("signup")}>
              Start Free
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
