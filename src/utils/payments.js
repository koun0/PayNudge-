export const statusLabels = {
  paid: "Paid",
  unpaid: "Unpaid",
  "due-soon": "Due Soon",
  overdue: "Overdue",
};

export const currencyOptions = ["USD", "EUR", "GBP", "MAD", "CAD", "AUD"];

export const formatMoney = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

export const formatDate = (dateString) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));

export const todayInput = () => new Date().toISOString().slice(0, 10);

export const getPaymentStatus = (payment) => {
  if (payment.status === "paid") return "paid";

  // Keep overdue logic derived from the due date so the whole app stays consistent.
  const today = todayInput();
  if (payment.due_date < today) return "overdue";

  return "unpaid";
};

export const isActivePayment = (payment) => getPaymentStatus(payment) !== "paid";

export const isDueThisWeek = (payment) => {
  if (getPaymentStatus(payment) === "paid") return false;

  const today = new Date(`${todayInput()}T00:00:00`);
  const due = new Date(`${payment.due_date}T00:00:00`);
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  return diffDays >= 0 && diffDays <= 7;
};

export const getPaymentDisplayStatus = (payment) => {
  const status = getPaymentStatus(payment);
  if (status === "unpaid" && isDueThisWeek(payment)) return "due-soon";
  return status;
};

export const getClientName = (clients, clientId) =>
  clients.find((client) => client.id === clientId)?.name || "Unknown client";

export const getClientPayments = (payments, clientId) =>
  payments.filter((payment) => payment.client_id === clientId);

export const getClientStatus = (payments, clientId) => {
  const clientPayments = getClientPayments(payments, clientId);
  if (clientPayments.some((payment) => getPaymentStatus(payment) === "overdue")) {
    return "Overdue";
  }
  if (clientPayments.some((payment) => getPaymentStatus(payment) === "unpaid")) {
    return "Has unpaid";
  }
  return "Clear";
};

export const getClientTotals = (payments, clientId) => {
  const clientPayments = getClientPayments(payments, clientId);

  return clientPayments.reduce(
    (totals, payment) => {
      if (getPaymentStatus(payment) === "paid") {
        totals.paid += Number(payment.amount);
      } else {
        totals.unpaid += Number(payment.amount);
      }

      if (getPaymentStatus(payment) === "overdue") {
        totals.overdue += Number(payment.amount);
      }

      return totals;
    },
    { paid: 0, unpaid: 0, overdue: 0 },
  );
};

export const generateReminderMessage = ({ client, payment, tone }) => {
  if (!client || !payment) return "";

  const amount = formatMoney(payment.amount, payment.currency);
  const dueDate = formatDate(payment.due_date);

  const openers = {
    Friendly: `Hi ${client.name}, hope you are doing well.`,
    Professional: `Hello ${client.name}, I hope you are doing well.`,
    Firm: `Hello ${client.name}, I am following up regarding an outstanding payment.`,
    "Very polite": `Hi ${client.name}, I hope your week is going well.`,
  };

  const closers = {
    Friendly: "Please let me know if you need me to resend any details. Thanks.",
    Professional:
      "Please let me know when I can expect the payment or if you need any details resent. Thank you.",
    Firm: "Please arrange payment as soon as possible or let me know immediately if anything is blocking it.",
    "Very polite":
      "Whenever you have a moment, please let me know if you need anything from my side. Thank you very much.",
  };

  return `${openers[tone]} Just a quick reminder that the payment of ${amount} for ${payment.title} was due on ${dueDate}. ${closers[tone]}`;
};
