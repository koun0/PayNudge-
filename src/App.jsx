import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Gauge,
  Lock,
  Mail,
  Plus,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { AddClientForm } from "./components/AddClientForm";
import { AddPaymentForm } from "./components/AddPaymentForm";
import { Button } from "./components/Button";
import { ClientTable } from "./components/ClientTable";
import { DashboardCard } from "./components/DashboardCard";
import { EmptyState } from "./components/EmptyState";
import { Input } from "./components/Input";
import { Modal } from "./components/Modal";
import { Navbar, BrandMark } from "./components/Navbar";
import { PaymentTable } from "./components/PaymentTable";
import { PricingCard } from "./components/PricingCard";
import { ReminderGenerator } from "./components/ReminderGenerator";
import { SettingsForm } from "./components/SettingsForm";
import { Sidebar } from "./components/Sidebar";
import { StatusBadge } from "./components/StatusBadge";
import {
  demoUser,
  initialClients,
  initialPayments,
  initialReminders,
  pricingPlans,
} from "./data/mockData";
import {
  formatDate,
  formatMoney,
  getClientName,
  getClientPayments,
  getClientStatus,
  getClientTotals,
  getPaymentDisplayStatus,
  getPaymentStatus,
  isActivePayment,
  isDueThisWeek,
  todayInput,
} from "./utils/payments";

const activeLimitByPlan = {
  Free: 3,
  Starter: 25,
  Pro: Infinity,
};

const getRouteFromHash = () => {
  const route = window.location.hash.replace(/^#/, "");
  return route || "landing";
};

export default function App() {
  const [route, setRoute] = useState(getRouteFromHash);
  const [user, setUser] = useState(demoUser);
  const [clients, setClients] = useState(initialClients);
  const [payments, setPayments] = useState(initialPayments);
  const [reminders, setReminders] = useState(initialReminders);
  const [clientSearch, setClientSearch] = useState("");
  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const syncRoute = () => setRoute(getRouteFromHash());
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  const navigate = (nextRoute) => {
    const normalizedRoute = nextRoute === "demo" ? "dashboard" : nextRoute;
    window.location.hash = normalizedRoute;
    setRoute(normalizedRoute);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activePaymentCount = useMemo(
    () => payments.filter((payment) => isActivePayment(payment)).length,
    [payments],
  );
  const activePaymentLimit = activeLimitByPlan[user.plan] || 3;

  const dashboardStats = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);

    return payments.reduce(
      (stats, payment) => {
        const status = getPaymentStatus(payment);

        if (status !== "paid") {
          stats.totalUnpaid += Number(payment.amount);
        }
        if (status === "overdue") {
          stats.overdueCount += 1;
        }
        if (isDueThisWeek(payment)) {
          stats.dueThisWeek += 1;
        }
        if (status === "paid" && payment.paid_at?.startsWith(currentMonth)) {
          stats.paidThisMonth += Number(payment.amount);
        }

        return stats;
      },
      { totalUnpaid: 0, overdueCount: 0, dueThisWeek: 0, paidThisMonth: 0 },
    );
  }, [payments]);

  const recentUnpaidPayments = useMemo(
    () =>
      payments
        .filter((payment) => getPaymentStatus(payment) !== "paid")
        .sort((a, b) => a.due_date.localeCompare(b.due_date))
        .slice(0, 5),
    [payments],
  );

  const dueSoonPayments = useMemo(
    () =>
      payments
        .filter((payment) => isDueThisWeek(payment))
        .sort((a, b) => a.due_date.localeCompare(b.due_date)),
    [payments],
  );

  const overduePayments = useMemo(
    () =>
      payments
        .filter((payment) => getPaymentStatus(payment) === "overdue")
        .sort((a, b) => a.due_date.localeCompare(b.due_date)),
    [payments],
  );

  const saveClient = (client) => {
    setClients((current) => {
      const exists = current.some((item) => item.id === client.id);
      return exists ? current.map((item) => (item.id === client.id ? client : item)) : [...current, client];
    });
    setModal(null);
  };

  const deleteClient = (clientId) => {
    const client = clients.find((item) => item.id === clientId);
    if (!client || !window.confirm(`Delete ${client.name} and linked payments?`)) return;

    setClients((current) => current.filter((item) => item.id !== clientId));
    setPayments((current) => current.filter((payment) => payment.client_id !== clientId));
    setReminders((current) => current.filter((reminder) => reminder.client_id !== clientId));
  };

  const savePayment = (payment) => {
    setPayments((current) => {
      const exists = current.some((item) => item.id === payment.id);
      return exists ? current.map((item) => (item.id === payment.id ? payment : item)) : [...current, payment];
    });
    setModal(null);
  };

  const deletePayment = (paymentId) => {
    const payment = payments.find((item) => item.id === paymentId);
    if (!payment || !window.confirm(`Delete ${payment.title}?`)) return;

    setPayments((current) => current.filter((item) => item.id !== paymentId));
    setReminders((current) => current.filter((reminder) => reminder.payment_id !== paymentId));
  };

  const markPaymentPaid = (paymentId) => {
    setPayments((current) =>
      current.map((payment) =>
        payment.id === paymentId ? { ...payment, status: "paid", paid_at: todayInput() } : payment,
      ),
    );
  };

  const markPaymentUnpaid = (paymentId) => {
    setPayments((current) =>
      current.map((payment) =>
        payment.id === paymentId ? { ...payment, status: "unpaid", paid_at: null } : payment,
      ),
    );
  };

  const saveReminder = (reminder) => {
    setReminders((current) => [reminder, ...current]);
  };

  const saveSettings = (settings) => {
    setUser((current) => ({ ...current, ...settings }));
  };

  const selectPlan = (planName) => {
    setUser((current) => ({ ...current, plan: planName }));
  };

  if (route === "landing") {
    return <LandingPage navigate={navigate} selectPlan={selectPlan} currentPlan={user.plan} />;
  }

  if (["login", "signup", "forgot"].includes(route)) {
    return <AuthPage mode={route} navigate={navigate} />;
  }

  const page = (() => {
    if (route.startsWith("clients:")) {
      const clientId = route.split(":")[1];
      return (
        <ClientDetailPage
          client={clients.find((item) => item.id === clientId)}
          clients={clients}
          payments={payments}
          navigate={navigate}
          onAddPayment={(client) => setModal({ type: "payment", preselectedClientId: client.id })}
          onGenerateReminder={() => navigate("reminders")}
          onEditPayment={(payment) => setModal({ type: "payment", data: payment })}
          onDeletePayment={deletePayment}
          onMarkPaid={markPaymentPaid}
          onMarkUnpaid={markPaymentUnpaid}
        />
      );
    }

    switch (route) {
      case "clients":
        return (
          <ClientsPage
            clients={clients}
            payments={payments}
            search={clientSearch}
            setSearch={setClientSearch}
            navigate={navigate}
            onAdd={() => setModal({ type: "client" })}
            onEdit={(client) => setModal({ type: "client", data: client })}
            onDelete={deleteClient}
          />
        );
      case "payments":
        return (
          <PaymentsPage
            clients={clients}
            payments={payments}
            search={paymentSearch}
            setSearch={setPaymentSearch}
            filter={paymentFilter}
            setFilter={setPaymentFilter}
            onAdd={() => setModal({ type: "payment" })}
            onEdit={(payment) => setModal({ type: "payment", data: payment })}
            onDelete={deletePayment}
            onMarkPaid={markPaymentPaid}
            onMarkUnpaid={markPaymentUnpaid}
          />
        );
      case "reminders":
        return (
          <RemindersPage
            clients={clients}
            payments={payments}
            reminders={reminders}
            onSaveReminder={saveReminder}
          />
        );
      case "pricing":
        return <PricingPage currentPlan={user.plan} onSelect={selectPlan} />;
      case "settings":
        return <SettingsPage user={user} onSave={saveSettings} onLogout={() => navigate("landing")} />;
      case "dashboard":
      default:
        return (
          <DashboardPage
            clients={clients}
            payments={payments}
            stats={dashboardStats}
            recentUnpaidPayments={recentUnpaidPayments}
            dueSoonPayments={dueSoonPayments}
            overduePayments={overduePayments}
            activePaymentCount={activePaymentCount}
            activePaymentLimit={activePaymentLimit}
            user={user}
            navigate={navigate}
            onAddPayment={() => setModal({ type: "payment" })}
            onAddClient={() => setModal({ type: "client" })}
          />
        );
    }
  })();

  return (
    <>
      <AppShell route={route} user={user} navigate={navigate} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        {page}
      </AppShell>

      {modal?.type === "client" && (
        <Modal
          title={modal.data ? "Edit client" : "Add client"}
          description="Keep client records clear so unpaid work is easy to track."
          onClose={() => setModal(null)}
        >
          <AddClientForm initialClient={modal.data} onSave={saveClient} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {modal?.type === "payment" && (
        <Modal
          title={modal.data ? "Edit payment" : "Add payment"}
          description="Track the amount, due date, and current payment state."
          onClose={() => setModal(null)}
        >
          <AddPaymentForm
            clients={clients}
            initialPayment={modal.data}
            preselectedClientId={modal.preselectedClientId}
            defaultCurrency={user.default_currency}
            activePaymentCount={activePaymentCount}
            activePaymentLimit={activePaymentLimit}
            onSave={savePayment}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </>
  );
}

function LandingPage({ navigate, currentPlan, selectPlan }) {
  const features = [
    {
      title: "Track unpaid payments",
      description: "Log project fees, due dates, and balances without turning PayNudge into heavy accounting software.",
      icon: CircleDollarSign,
    },
    {
      title: "Spot overdue clients instantly",
      description: "Prioritize late payments with clear status badges and a focused follow-up queue.",
      icon: AlertTriangle,
    },
    {
      title: "Generate polite reminders",
      description: "Create copy-ready follow-ups that sound calm, professional, and easy to respond to.",
      icon: Bell,
    },
    {
      title: "Organize freelance income",
      description: "Replace scattered notes with a simple operating system for freelance cash flow.",
      icon: ShieldCheck,
    },
  ];

  const steps = [
    {
      title: "Add your client",
      description: "Store contact details and project context once.",
    },
    {
      title: "Track the payment",
      description: "Add the amount, currency, due date, and current status.",
    },
    {
      title: "Review what needs attention",
      description: "See upcoming and overdue payments before they get buried.",
    },
    {
      title: "Copy a polished reminder",
      description: "Send a professional follow-up from your own inbox or chat app.",
    },
  ];

  return (
    <div className="bg-white text-slate-900">
      <Navbar navigate={navigate} />

      <main>
        <section className="hero-shell relative overflow-hidden pt-16">
          <div className="relative z-10 mx-auto grid min-h-[88vh] w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-md border border-brand-100 bg-white/70 px-3 py-1.5 text-sm font-bold text-brand-700 shadow-sm backdrop-blur-xl">
                <Sparkles className="h-4 w-4" />
                Freelance payment follow-up, simplified
              </div>
              <h1 className="mt-6 text-5xl font-bold leading-tight tracking-normal text-slate-950 sm:text-6xl">
                Never lose track of unpaid client payments again.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                PayNudge helps freelancers track unpaid payments, overdue clients, and generate professional reminder messages in seconds.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={() => navigate("signup")}>
                  Start Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="secondary" onClick={() => navigate("demo")}>
                  View Demo
                </Button>
              </div>
              <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
                {[
                  ["$1,250", "Unpaid balance"],
                  ["3", "Overdue payments"],
                  ["1 min", "Reminder ready"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg border border-white/80 bg-white/70 p-4 shadow-card backdrop-blur-xl ring-1 ring-slate-200/70">
                    <p className="text-2xl font-bold text-slate-950">{value}</p>
                    <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <HeroVisual />
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 md:grid-cols-3 lg:px-8">
            {[
              [SearchCheck, "Built for repeat client follow-up"],
              [ShieldCheck, "Professional copy without awkward wording"],
              [TrendingUp, "Clearer cash-flow habits from day one"],
            ].map(([Icon, text]) => (
              <div key={text} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="surface-grid bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-normal text-brand-700">Features</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">A clean workspace for freelance payments.</h2>
              <p className="mt-4 text-lg text-slate-600">
                PayNudge keeps the workflow narrow on purpose: clients, payment status, due dates, and reminders.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="panel-gradient group rounded-2xl border border-white/80 p-6 shadow-card ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm ring-1 ring-brand-100 transition group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-slate-950">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-normal text-brand-700">How it works</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">A calmer way to manage collections.</h2>
              <p className="mt-4 text-lg text-slate-600">
                A lightweight flow for freelancers who want to stay organized without sounding pushy.
              </p>
            </div>
            <div className="relative grid gap-4 sm:grid-cols-2">
              {steps.map((step, index) => (
                <article key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 text-sm font-bold text-white shadow-md shadow-brand-900/20">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-slate-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-normal text-brand-700">Pricing</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Simple pricing for solo freelancers.</h2>
              <p className="mt-4 text-lg text-slate-600">
                Start with a small payment queue, then upgrade when client volume makes follow-up harder to manage manually.
              </p>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {pricingPlans.map((plan) => (
                <PricingCard
                  key={plan.name}
                  plan={plan}
                  currentPlan={currentPlan}
                  onSelect={(planName) => {
                    selectPlan(planName);
                    navigate("signup");
                  }}
                />
              ))}
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate-500">
              No payment processing is required for this MVP. Upgrade actions are ready to connect to Stripe or another provider later.
            </p>
          </div>
        </section>

        <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-300/50 to-transparent" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(49,89,212,0.28),rgba(16,185,129,0.12)_45%,rgba(251,146,60,0.10))]" />
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <div className="relative">
            <h2 className="text-3xl font-bold sm:text-4xl">Start tracking your payments today.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              Keep client follow-ups clear, polite, and on time from the first project.
            </p>
            <div className="mt-8 flex justify-center">
              <Button size="lg" onClick={() => navigate("signup")}>
                Start Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-950 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <BrandMark dark />
          <div className="flex flex-wrap gap-5 text-sm text-slate-300">
            <button onClick={() => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })}>Features</button>
            <button onClick={() => document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" })}>Pricing</button>
            <button onClick={() => navigate("login")}>Login</button>
            <button onClick={() => navigate("demo")}>Demo</button>
          </div>
          <p className="text-sm text-slate-400">&copy; 2026 PayNudge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function HeroVisual() {
  const rows = [
    ["John Carter", "Logo Design", "$150", "Overdue", "red"],
    ["Sarah Miles", "Website Redesign", "$600", "Unpaid", "blue"],
    ["Lina Coaching", "Landing Page", "$300", "Due Soon", "orange"],
  ];

  return (
    <div className="hero-stage relative mx-auto h-[520px] w-full max-w-[620px] lg:h-[620px]">
      <div className="absolute left-[8%] top-[10%] h-[78%] w-[78%] rounded-[2rem] border border-white/70 bg-white/30 shadow-lift backdrop-blur-2xl" />

      <div className="hero-card-main absolute left-[6%] top-[12%] w-[86%] overflow-hidden rounded-2xl border border-white/80 bg-white/[0.88] shadow-lift backdrop-blur-xl ring-1 ring-slate-200/70">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-950 px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-emerald-300 ring-1 ring-white/10">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">PayNudge Dashboard</p>
              <p className="text-xs text-slate-400">Payment pipeline</p>
            </div>
          </div>
          <div className="rounded-md bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-300/20">
            Live
          </div>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-3">
          {[
            ["$1,250", "Total unpaid", "brand"],
            ["3", "Overdue", "red"],
            ["$850", "Due soon", "orange"],
          ].map(([value, label, tone]) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className={`text-lg font-bold ${tone === "red" ? "text-red-600" : tone === "orange" ? "text-orange-600" : "text-brand-700"}`}>
                {value}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="px-5 pb-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80">
            <div className="grid grid-cols-[1fr_0.9fr_0.55fr_0.7fr] gap-3 border-b border-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-normal text-slate-400">
              <span>Client</span>
              <span>Project</span>
              <span>Amount</span>
              <span>Status</span>
            </div>
            {rows.map(([client, project, amount, status, tone]) => (
              <div key={client} className="grid grid-cols-[1fr_0.9fr_0.55fr_0.7fr] items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0">
                <span className="truncate text-sm font-semibold text-slate-950">{client}</span>
                <span className="truncate text-sm text-slate-500">{project}</span>
                <span className="text-sm font-bold text-slate-950">{amount}</span>
                <span
                  className={`w-fit rounded-md px-2 py-1 text-xs font-bold ${
                    tone === "red"
                      ? "bg-red-50 text-red-700"
                      : tone === "orange"
                        ? "bg-orange-50 text-orange-700"
                        : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-card-float absolute right-[4%] top-[5%] w-56 rounded-2xl border border-white/80 bg-white/[0.82] p-4 backdrop-blur-xl ring-1 ring-slate-200/70 [--rotate:6deg]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-950">$1,250 unpaid</p>
            <p className="text-xs font-semibold text-slate-500">Across 4 clients</p>
          </div>
        </div>
      </div>

      <div className="hero-card-float absolute left-0 top-[50%] w-52 rounded-2xl border border-white/80 bg-white/[0.82] p-4 backdrop-blur-xl ring-1 ring-red-100 [--rotate:-7deg]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-950">3 overdue</p>
            <p className="text-xs font-semibold text-slate-500">Needs follow-up</p>
          </div>
        </div>
      </div>

      <div className="hero-card-float absolute bottom-[7%] right-[7%] w-64 rounded-2xl border border-white/80 bg-white/[0.86] p-4 backdrop-blur-xl ring-1 ring-emerald-100 [--rotate:5deg]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-950">Reminder ready to copy</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Hi John, quick reminder that payment was due...
            </p>
          </div>
        </div>
      </div>

      <div className="hero-card-float absolute bottom-[26%] left-[12%] w-56 rounded-2xl border border-white/80 bg-white/[0.84] p-4 backdrop-blur-xl ring-1 ring-orange-100 [--rotate:4deg]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
            <Clock3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-950">Invoice due tomorrow</p>
            <p className="text-xs font-semibold text-slate-500">Lina Coaching, $300</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthPage({ mode, navigate }) {
  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const title = isLogin ? "Welcome back" : isSignup ? "Create your PayNudge account" : "Reset your password";
  const subtitle = isLogin
    ? "Log in to keep your freelance income organized."
    : isSignup
      ? "Start tracking unpaid payments with sample data ready to explore."
      : "Enter your email and we will prepare a mock reset link.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-lift sm:p-8">
        <button onClick={() => navigate("landing")} className="mx-auto block rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
          <BrandMark />
        </button>
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="mt-7 space-y-4">
          <Button variant="secondary" className="w-full">
            <Mail className="h-4 w-4" />
            Continue with Google
          </Button>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-normal text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            Email
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          {isSignup && (
            <Input id="auth-name" label="Name" icon={UserRound} placeholder="Maya Bennett" autoComplete="name" />
          )}
          <Input id="auth-email" label="Email" type="email" icon={Mail} placeholder="you@example.com" autoComplete="email" />
          {mode !== "forgot" && (
            <Input id="auth-password" label="Password" type="password" icon={Lock} placeholder="Password" autoComplete={isLogin ? "current-password" : "new-password"} />
          )}
          <Button className="w-full" onClick={() => navigate("dashboard")}>
            {isLogin ? "Login" : isSignup ? "Create account" : "Send reset link"}
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          {isLogin && (
            <>
              <button className="font-semibold text-brand-700 hover:text-brand-800" onClick={() => navigate("forgot")}>
                Forgot password?
              </button>
              <span className="mx-2">/</span>
              <button className="font-semibold text-brand-700 hover:text-brand-800" onClick={() => navigate("signup")}>
                Create account
              </button>
            </>
          )}
          {isSignup && (
            <button className="font-semibold text-brand-700 hover:text-brand-800" onClick={() => navigate("login")}>
              Already have an account? Login
            </button>
          )}
          {mode === "forgot" && (
            <button className="font-semibold text-brand-700 hover:text-brand-800" onClick={() => navigate("login")}>
              Back to login
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

function AppShell({ children, route, user, navigate, sidebarOpen, setSidebarOpen }) {
  const titles = {
    dashboard: "Dashboard",
    clients: "Clients",
    payments: "Payments",
    reminders: "Reminders",
    pricing: "Pricing",
    settings: "Settings",
  };
  const title = route.startsWith("clients:") ? "Client detail" : titles[route] || "Dashboard";

  return (
    <div className="app-backdrop min-h-screen">
      <Sidebar route={route} navigate={navigate} open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/[0.82] shadow-sm backdrop-blur-xl">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="pl-14 lg:pl-0">
              <p className="text-xs font-bold uppercase tracking-normal text-brand-700">PayNudge workspace</p>
              <h1 className="text-xl font-bold text-slate-950">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm md:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Mock data live
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-slate-950">{user.name}</p>
                <p className="text-xs text-slate-500">{user.plan} plan</p>
              </div>
              <button
                onClick={() => navigate("settings")}
                className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-brand-700 to-brand-900 text-sm font-bold text-white shadow-sm shadow-brand-900/20 ring-1 ring-white/70"
                aria-label="Open settings"
              >
                {user.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && <p className="text-sm font-bold uppercase tracking-normal text-brand-700">{eyebrow}</p>}
        <h2 className="mt-1 text-3xl font-bold text-slate-950 sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-col gap-2 sm:flex-row">{actions}</div>}
    </div>
  );
}

function DashboardPage({
  clients,
  payments,
  stats,
  recentUnpaidPayments,
  dueSoonPayments,
  overduePayments,
  activePaymentCount,
  activePaymentLimit,
  user,
  navigate,
  onAddPayment,
  onAddClient,
}) {
  const topOverdue = overduePayments[0];
  const nextDue = dueSoonPayments[0];
  const overdueTotal = overduePayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const dueThisWeekTotal = dueSoonPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const activeClientCount = new Set(
    payments.filter((payment) => getPaymentStatus(payment) !== "paid").map((payment) => payment.client_id),
  ).size;
  const planProgress =
    Number.isFinite(activePaymentLimit) && activePaymentLimit > 0
      ? Math.min(100, Math.round((activePaymentCount / activePaymentLimit) * 100))
      : 100;
  const focusPayment = topOverdue || nextDue;
  const focusClient = focusPayment ? getClientName(clients, focusPayment.client_id) : "";

  return (
    <div>
      <PageHeader
        eyebrow="Income command center"
        title={`Good to see you, ${user.name.split(" ")[0]}.`}
        description="A focused view of who owes you, what needs attention, and the next follow-up to send."
        actions={
          <>
            <Button variant="secondary" onClick={onAddClient}>
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
            <Button onClick={onAddPayment}>
              <Plus className="h-4 w-4" />
              Add Payment
            </Button>
          </>
        }
      />

      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-lift">
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:p-7">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-normal text-slate-200">
              <Gauge className="h-3.5 w-3.5" />
              Today's focus
            </div>
            <h3 className="mt-4 max-w-2xl text-2xl font-bold leading-tight sm:text-3xl">
              {focusPayment
                ? `${topOverdue ? "Follow up with" : "Prepare for"} ${focusClient}`
                : "Your payment pipeline is clear."}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              {focusPayment
                ? `${focusPayment.title} is ${topOverdue ? "overdue" : "due soon"} for ${formatMoney(
                    focusPayment.amount,
                    focusPayment.currency,
                  )}. Keep the message concise, professional, and easy for the client to act on.`
                : "No active payment needs urgent attention. Add new work as soon as a client confirms scope so nothing slips."}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => (focusPayment ? navigate("reminders") : onAddPayment())}>
                {focusPayment ? "Generate reminder" : "Add payment"}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="secondary" className="border-white/20 bg-white/95" onClick={() => navigate("payments")}>
                Review payments
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
            <p className="text-sm font-semibold text-slate-200">Collection health</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold">{formatMoney(overdueTotal, user.default_currency)}</p>
                <p className="mt-1 text-xs text-slate-400">Overdue value</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{activeClientCount}</p>
                <p className="mt-1 text-xs text-slate-400">Clients owing</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{formatMoney(dueThisWeekTotal, user.default_currency)}</p>
                <p className="mt-1 text-xs text-slate-400">Due this week</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{formatMoney(stats.paidThisMonth, user.default_currency)}</p>
                <p className="mt-1 text-xs text-slate-400">Collected</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Total Unpaid" value={formatMoney(stats.totalUnpaid, user.default_currency)} helper="Unpaid work still sitting in your pipeline." icon={CircleDollarSign} tone="blue" />
        <DashboardCard title="Overdue Payments" value={stats.overdueCount} helper="Prioritized follow-ups that should go out first." icon={AlertTriangle} tone="red" />
        <DashboardCard title="Due This Week" value={stats.dueThisWeek} helper="Upcoming payments worth checking before they slip." icon={CalendarDays} tone="amber" />
        <DashboardCard title="Paid This Month" value={formatMoney(stats.paidThisMonth, user.default_currency)} helper="Paid work logged for the current month." icon={CheckCircle2} tone="emerald" />
      </div>

      {user.plan === "Free" && (
        <section className="mt-5 rounded-2xl border border-amber-200 bg-white p-4 shadow-card">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-950">Free plan usage</p>
              <p className="mt-1 text-sm text-slate-500">
                {activePaymentCount} of {activePaymentLimit} active unpaid payments are in use.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate("pricing")}>
              Compare plans
            </Button>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-amber-100">
            <div className="h-full rounded-full bg-amber-500" style={{ width: `${planProgress}%` }} />
          </div>
        </section>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card ring-1 ring-slate-100">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-5">
            <div>
              <h3 className="text-lg font-bold text-slate-950">Active payment queue</h3>
              <p className="mt-1 text-sm text-slate-500">Sorted by due date so the next action is obvious.</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate("payments")}>
              View all
            </Button>
          </div>
          <PaymentList clients={clients} payments={recentUnpaidPayments} compact />
        </section>

        <div className="grid gap-6">
          <DueDatesPanel clients={clients} payments={dueSoonPayments} />
          <OverduePanel clients={clients} payments={overduePayments} navigate={navigate} />
        </div>
      </div>
    </div>
  );
}

function PaymentList({ clients, payments, compact = false }) {
  if (!payments.length) {
    return (
      <div className="p-5">
        <EmptyState
          title="No active payments"
          description="Everything you have tracked is either paid or not yet entered. Add new work as soon as a client approves it."
          icon={CheckCircle2}
        />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">Project</th>
            {!compact && <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">Client</th>}
            <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">Due</th>
            <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">Status</th>
            <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-normal text-slate-500">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-slate-50">
              <td className="px-5 py-4">
                <p className="font-semibold text-slate-950">{payment.title}</p>
                <p className="text-sm text-slate-500">{getClientName(clients, payment.client_id)}</p>
              </td>
              {!compact && <td className="px-5 py-4 text-sm text-slate-600">{getClientName(clients, payment.client_id)}</td>}
              <td className="px-5 py-4 text-sm text-slate-600">{formatDate(payment.due_date)}</td>
              <td className="px-5 py-4">
                <StatusBadge status={getPaymentDisplayStatus(payment)} />
              </td>
              <td className="px-5 py-4 text-right text-sm font-bold text-slate-950">
                {formatMoney(payment.amount, payment.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DueDatesPanel({ clients, payments }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-amber-50 p-2 text-amber-700">
          <Clock3 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-950">This week</h3>
          <p className="text-sm text-slate-500">Payments to watch before they become late.</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {payments.length === 0 ? (
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">No due dates this week</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Your near-term payment calendar is clear. Add confirmed work early to keep it that way.
            </p>
          </div>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{payment.title}</p>
                  <p className="text-sm text-slate-500">{getClientName(clients, payment.client_id)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-950">{formatMoney(payment.amount, payment.currency)}</p>
                  <StatusBadge className="mt-2" status="due-soon" />
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-500">Due {formatDate(payment.due_date)}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function OverduePanel({ clients, payments, navigate }) {
  return (
    <section className="rounded-2xl border border-red-200 bg-red-50/80 p-5 shadow-card">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-white p-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-red-950">Follow-up queue</h3>
          <p className="text-sm text-red-700">Overdue payments that need a professional nudge.</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {payments.length === 0 ? (
          <div className="rounded-lg bg-white p-4">
            <p className="text-sm font-semibold text-slate-950">No overdue payments</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Your follow-up list is clean. Keep due dates current as new client work lands.
            </p>
          </div>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="rounded-lg bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{getClientName(clients, payment.client_id)}</p>
                  <p className="text-sm text-slate-500">{payment.title}</p>
                </div>
                <p className="text-sm font-bold text-red-700">{formatMoney(payment.amount, payment.currency)}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <Button className="mt-5 w-full" variant="danger" onClick={() => navigate("reminders")}>
        Generate reminder
      </Button>
    </section>
  );
}

function ClientsPage({ clients, payments, search, setSearch, navigate, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <PageHeader
        eyebrow="Client tracking"
        title="Clients"
        description="Keep every client, balance, and follow-up context in one place before unpaid work gets hard to trace."
        actions={<Button onClick={onAdd}><Plus className="h-4 w-4" />Add client</Button>}
      />
      <ClientTable
        clients={clients}
        payments={payments}
        search={search}
        setSearch={setSearch}
        onView={(client) => navigate(`clients:${client.id}`)}
        onEdit={onEdit}
        onDelete={onDelete}
        onAdd={onAdd}
      />
    </div>
  );
}

function ClientDetailPage({
  client,
  clients,
  payments,
  navigate,
  onAddPayment,
  onGenerateReminder,
  onEditPayment,
  onDeletePayment,
  onMarkPaid,
  onMarkUnpaid,
}) {
  const [detailSearch, setDetailSearch] = useState("");
  const [detailFilter, setDetailFilter] = useState("all");

  if (!client) {
    return (
      <EmptyState
        title="Client not found"
        description="This client may have been deleted from the mock workspace."
        actionLabel="Back to clients"
        onAction={() => navigate("clients")}
      />
    );
  }

  const clientPayments = getClientPayments(payments, client.id);
  const totals = getClientTotals(payments, client.id);
  const status = getClientStatus(payments, client.id);

  return (
    <div>
      <PageHeader
        eyebrow="Client detail"
        title={client.name}
        description="See the client relationship, payment history, open balance, and next follow-up action."
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate("clients")}>Back to clients</Button>
            <Button onClick={() => onAddPayment(client)}><Plus className="h-4 w-4" />Add payment</Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(18rem,0.45fr)_minmax(0,1fr)]">
        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">{client.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{client.company || "Independent client"}</p>
              </div>
              <StatusBadge type="client" status={status} />
            </div>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-slate-500">Email</dt>
                <dd className="mt-1 text-slate-950">{client.email}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Phone</dt>
                <dd className="mt-1 text-slate-950">{client.phone}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Created</dt>
                <dd className="mt-1 text-slate-950">{formatDate(client.created_at)}</dd>
              </div>
            </dl>
            <Button className="mt-6 w-full" variant="secondary" onClick={onGenerateReminder}>
              Generate reminder message
            </Button>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
            <h3 className="font-bold text-slate-950">Notes</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{client.notes || "No notes added yet."}</p>
          </section>
        </aside>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <DashboardCard title="Total paid" value={formatMoney(totals.paid, "USD")} icon={CheckCircle2} tone="emerald" />
            <DashboardCard title="Total unpaid" value={formatMoney(totals.unpaid, "USD")} icon={CreditCard} tone="blue" />
            <DashboardCard title="Overdue" value={formatMoney(totals.overdue, "USD")} icon={AlertTriangle} tone="red" />
          </div>
          <PaymentTable
            clients={clients}
            payments={clientPayments}
            search={detailSearch}
            setSearch={setDetailSearch}
            filter={detailFilter}
            setFilter={setDetailFilter}
            onAdd={() => onAddPayment(client)}
            onEdit={onEditPayment}
            onDelete={onDeletePayment}
            onMarkPaid={onMarkPaid}
            onMarkUnpaid={onMarkUnpaid}
          />
        </div>
      </div>
    </div>
  );
}

function PaymentsPage({
  clients,
  payments,
  search,
  setSearch,
  filter,
  setFilter,
  onAdd,
  onEdit,
  onDelete,
  onMarkPaid,
  onMarkUnpaid,
}) {
  return (
    <div>
      <PageHeader
        eyebrow="Payment tracking"
        title="Payments"
        description="Search, filter, and update the payment queue that drives your freelance cash flow."
        actions={<Button onClick={onAdd}><Plus className="h-4 w-4" />Add payment</Button>}
      />
      <PaymentTable
        clients={clients}
        payments={payments}
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        onMarkPaid={onMarkPaid}
        onMarkUnpaid={onMarkUnpaid}
      />
    </div>
  );
}

function RemindersPage({ clients, payments, reminders, onSaveReminder }) {
  return (
    <div>
      <PageHeader
        eyebrow="Professional follow-ups"
        title="Reminders"
        description="Turn overdue or upcoming payments into polished messages you can send with confidence."
      />
      <ReminderGenerator clients={clients} payments={payments} onSaveReminder={onSaveReminder} />

      <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-card">
        <div className="border-b border-slate-100 p-5">
          <h3 className="text-lg font-bold text-slate-950">Saved reminders</h3>
          <p className="mt-1 text-sm text-slate-500">A lightweight record of follow-ups prepared in this workspace.</p>
        </div>
        <div className="divide-y divide-slate-100">
          {reminders.length === 0 ? (
            <div className="p-5">
              <EmptyState title="No saved reminders" description="Generate and save a reminder to build your follow-up history." />
            </div>
          ) : (
            reminders.map((reminder) => (
              <article key={reminder.id} className="p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{getClientName(clients, reminder.client_id)}</p>
                    <p className="text-sm text-slate-500">{reminder.tone} tone - {formatDate(reminder.created_at)}</p>
                  </div>
                  <StatusBadge status="unpaid" />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{reminder.message}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function PricingPage({ currentPlan, onSelect }) {
  return (
    <div>
      <PageHeader
        eyebrow="Plan limits"
        title="Pricing"
        description="Pick the payment tracking capacity that matches your freelance workload. Payment integration can be wired in later without changing the UI."
      />
      <section className="mb-6 rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-lift">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.38fr)] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-slate-300">Current workspace</p>
            <h3 className="mt-2 text-2xl font-bold">{currentPlan} plan</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Free is enough to explore the workflow. Starter is the natural next step once you are managing several unpaid client payments at the same time.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
            <p className="text-sm font-semibold text-white">Upgrade trigger</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Move up when the cost of one missed follow-up is higher than the monthly plan.
            </p>
          </div>
        </div>
      </section>
      <div className="grid gap-6 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <PricingCard key={plan.name} plan={plan} currentPlan={currentPlan} onSelect={onSelect} />
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        Billing is mocked in this frontend MVP. The layout is ready for Stripe, Lemon Squeezy, or Paddle.
      </p>
    </div>
  );
}

function SettingsPage({ user, onSave, onLogout }) {
  return (
    <div>
      <PageHeader
        eyebrow="Workspace preferences"
        title="Settings"
        description="Set the profile and billing defaults that keep payment tracking consistent."
      />
      <SettingsForm user={user} onSave={onSave} onLogout={onLogout} />
    </div>
  );
}
