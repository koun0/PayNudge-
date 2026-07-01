import { useState } from "react";
import { Bell, LogOut, Mail, UserRound } from "lucide-react";
import { Button } from "./Button";
import { Input, Select } from "./Input";
import { currencyOptions } from "../utils/payments";

export function SettingsForm({ user, onSave, onLogout }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    default_currency: user.default_currency,
    notifications: true,
    theme: "System",
  });
  const [saved, setSaved] = useState(false);

  const update = (field, value) => {
    setSaved(false);
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(form);
    setSaved(true);
  };

  return (
    <form className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(18rem,0.45fr)]" onSubmit={handleSubmit}>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="text-lg font-bold text-slate-950">Profile settings</h2>
        <p className="mt-1 text-sm text-slate-500">Keep your account details and default billing preferences current.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input
            id="settings-name"
            label="Name"
            icon={UserRound}
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
          />
          <Input
            id="settings-email"
            label="Email"
            type="email"
            icon={Mail}
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
          />
          <Select
            id="settings-currency"
            label="Default currency"
            value={form.default_currency}
            onChange={(event) => update("default_currency", event.target.value)}
          >
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </Select>
          <Select id="settings-theme" label="Theme" value={form.theme} onChange={(event) => update("theme", event.target.value)}>
            <option>System</option>
            <option>Light</option>
            <option>Dark coming soon</option>
          </Select>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-600"
              checked={form.notifications}
              onChange={(event) => update("notifications", event.target.checked)}
            />
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Bell className="h-4 w-4 text-brand-700" />
              Payment reminder notifications
            </span>
          </label>
          <Button type="submit">Save settings</Button>
        </div>

        {saved && (
          <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            Settings saved for this mock session.
          </p>
        )}
      </section>

      <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
        <h3 className="text-lg font-bold text-slate-950">Account</h3>
        <p className="mt-2 text-sm text-slate-500">Mock authentication is enabled for this MVP. Real auth can be connected later.</p>
        <div className="mt-6 rounded-lg bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-950">{user.name}</p>
          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
          <p className="mt-3 inline-flex rounded-md bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
            {user.plan} plan
          </p>
        </div>
        <Button className="mt-6 w-full" variant="secondary" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </aside>
    </form>
  );
}
