const now = new Date();

const toDateInput = (date) => date.toISOString().slice(0, 10);

const addDays = (days) => {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return toDateInput(date);
};

export const demoUser = {
  id: "user-1",
  name: "Maya Bennett",
  email: "maya@paynudge.demo",
  plan: "Free",
  default_currency: "USD",
  created_at: "2026-01-04",
};

export const initialClients = [
  {
    id: "client-1",
    user_id: "user-1",
    name: "John Carter",
    email: "john@carterstudio.com",
    phone: "+1 415 555 0183",
    company: "Carter Studio",
    notes: "Logo package completed and final files delivered.",
    created_at: "2026-05-04",
  },
  {
    id: "client-2",
    user_id: "user-1",
    name: "Sarah Miles",
    email: "sarah@milescollective.com",
    phone: "+1 646 555 0121",
    company: "Miles Collective",
    notes: "Website redesign launch support included.",
    created_at: "2026-05-16",
  },
  {
    id: "client-3",
    user_id: "user-1",
    name: "Amine Studio",
    email: "billing@aminestudio.co",
    phone: "+212 522 555 221",
    company: "Amine Studio",
    notes: "Prefers concise email updates after delivery.",
    created_at: "2026-05-29",
  },
  {
    id: "client-4",
    user_id: "user-1",
    name: "Lina Coaching",
    email: "lina@linacoaching.com",
    phone: "+1 310 555 0144",
    company: "Lina Coaching",
    notes: "Monthly marketing and landing page support.",
    created_at: "2026-06-08",
  },
];

export const initialPayments = [
  {
    id: "payment-1",
    user_id: "user-1",
    client_id: "client-1",
    title: "Logo Design",
    amount: 150,
    currency: "USD",
    due_date: addDays(-9),
    status: "unpaid",
    notes: "Final logo suite delivered with usage guide.",
    created_at: addDays(-28),
    paid_at: null,
  },
  {
    id: "payment-2",
    user_id: "user-1",
    client_id: "client-2",
    title: "Website Redesign",
    amount: 600,
    currency: "USD",
    due_date: addDays(12),
    status: "unpaid",
    notes: "Second milestone for responsive redesign.",
    created_at: addDays(-18),
    paid_at: null,
  },
  {
    id: "payment-3",
    user_id: "user-1",
    client_id: "client-3",
    title: "Video Editing",
    amount: 250,
    currency: "USD",
    due_date: addDays(-5),
    status: "paid",
    notes: "Paid after final revision package.",
    created_at: addDays(-20),
    paid_at: addDays(-2),
  },
  {
    id: "payment-4",
    user_id: "user-1",
    client_id: "client-4",
    title: "Landing Page",
    amount: 300,
    currency: "USD",
    due_date: addDays(3),
    status: "unpaid",
    notes: "Due soon after copy approval.",
    created_at: addDays(-7),
    paid_at: null,
  },
];

export const initialReminders = [
  {
    id: "reminder-1",
    user_id: "user-1",
    client_id: "client-1",
    payment_id: "payment-1",
    tone: "Professional",
    message:
      "Hi John Carter, I hope you are doing well. Just a quick reminder that the payment of $150.00 for Logo Design was due recently. Please let me know if you need me to resend any details. Thanks.",
    created_at: addDays(-1),
  },
];

export const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    cadence: "/month",
    description: "For new freelancers who need a clean place to track a few open payments.",
    features: ["3 active payments", "Basic dashboard", "Manual reminders"],
  },
  {
    name: "Starter",
    price: "$5",
    cadence: "/month",
    description: "For steady client work where follow-ups and payment status need a repeatable system.",
    features: ["25 active payments", "Reminder generator", "Client tracking"],
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$12",
    cadence: "/month",
    description: "For growing freelance businesses managing more clients, projects, and payment cycles.",
    features: [
      "Unlimited payments",
      "Multiple reminder tones",
      "Advanced dashboard",
      "Priority features",
    ],
  },
];
