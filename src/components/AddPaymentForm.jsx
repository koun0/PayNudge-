import { useMemo, useState } from "react";
import { CalendarDays, CircleDollarSign, FileText } from "lucide-react";
import { Button } from "./Button";
import { Input, Select, TextArea } from "./Input";
import { currencyOptions, getPaymentStatus, todayInput } from "../utils/payments";

const blankPayment = (defaultCurrency) => ({
  client_id: "",
  title: "",
  amount: "",
  currency: defaultCurrency || "USD",
  due_date: todayInput(),
  status: "unpaid",
  notes: "",
});

export function AddPaymentForm({
  clients,
  initialPayment,
  preselectedClientId,
  defaultCurrency,
  activePaymentCount,
  activePaymentLimit = 3,
  onSave,
  onCancel,
}) {
  const [payment, setPayment] = useState(
    initialPayment || { ...blankPayment(defaultCurrency), client_id: preselectedClientId || "" },
  );
  const [errors, setErrors] = useState({});

  const currentIsActive = initialPayment ? getPaymentStatus(initialPayment) !== "paid" : false;
  const nextIsActive = payment.status !== "paid";
  const limitReached = activePaymentCount >= activePaymentLimit && nextIsActive && !currentIsActive;
  const derivedStatus = useMemo(() => getPaymentStatus(payment), [payment]);

  const updateField = (field, value) => {
    setPayment((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!payment.client_id) nextErrors.client_id = "Choose a client.";
    if (!payment.title.trim()) nextErrors.title = "Payment title is required.";
    if (!payment.amount || Number(payment.amount) <= 0) nextErrors.amount = "Enter an amount above 0.";
    if (!payment.due_date) nextErrors.due_date = "Choose a due date.";
    if (limitReached) nextErrors.limit = "The Free plan includes 3 active unpaid payments.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    onSave({
      ...payment,
      amount: Number(payment.amount),
      id: initialPayment?.id || `payment-${Date.now()}`,
      user_id: initialPayment?.user_id || "user-1",
      created_at: initialPayment?.created_at || todayInput(),
      paid_at: payment.status === "paid" ? initialPayment?.paid_at || todayInput() : null,
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          id="payment-client"
          label="Client"
          value={payment.client_id}
          onChange={(event) => updateField("client_id", event.target.value)}
          error={errors.client_id}
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </Select>
        <Input
          id="payment-title"
          label="Project/payment title"
          icon={FileText}
          value={payment.title}
          onChange={(event) => updateField("title", event.target.value)}
          error={errors.title}
          placeholder="Website Redesign"
        />
        <Input
          id="payment-amount"
          label="Amount"
          type="number"
          min="0"
          step="0.01"
          icon={CircleDollarSign}
          value={payment.amount}
          onChange={(event) => updateField("amount", event.target.value)}
          error={errors.amount}
          placeholder="600"
        />
        <Select
          id="payment-currency"
          label="Currency"
          value={payment.currency}
          onChange={(event) => updateField("currency", event.target.value)}
        >
          {currencyOptions.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </Select>
        <Input
          id="payment-due-date"
          label="Due date"
          type="date"
          icon={CalendarDays}
          value={payment.due_date}
          onChange={(event) => updateField("due_date", event.target.value)}
          error={errors.due_date}
        />
        <Select
          id="payment-status"
          label="Status"
          value={payment.status}
          onChange={(event) => updateField("status", event.target.value)}
          helper={`Displayed status: ${derivedStatus === "overdue" ? "Overdue" : derivedStatus === "paid" ? "Paid" : "Unpaid"}`}
        >
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
        </Select>
      </div>
      <TextArea
        id="payment-notes"
        label="Notes"
        value={payment.notes}
        onChange={(event) => updateField("notes", event.target.value)}
        placeholder="Add invoice, scope, or delivery notes."
      />
      {errors.limit && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          {errors.limit} Upgrade to Starter to track up to 25 active payments.
        </div>
      )}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialPayment ? "Save changes" : "Save payment"}</Button>
      </div>
    </form>
  );
}
