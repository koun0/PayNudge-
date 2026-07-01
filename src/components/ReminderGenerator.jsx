import { useMemo, useState } from "react";
import { Clipboard, RefreshCcw, Save } from "lucide-react";
import { Button } from "./Button";
import { Select } from "./Input";
import {
  formatMoney,
  generateReminderMessage,
  getClientName,
  getPaymentStatus,
  todayInput,
} from "../utils/payments";

const tones = ["Friendly", "Professional", "Firm", "Very polite"];

export function ReminderGenerator({ clients, payments, onSaveReminder }) {
  const activePayments = payments.filter((payment) => getPaymentStatus(payment) !== "paid");
  const [clientId, setClientId] = useState(activePayments[0]?.client_id || clients[0]?.id || "");
  const clientPayments = activePayments.filter((payment) => payment.client_id === clientId);
  const [paymentId, setPaymentId] = useState(clientPayments[0]?.id || activePayments[0]?.id || "");
  const [tone, setTone] = useState("Professional");
  const [message, setMessage] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [savedStatus, setSavedStatus] = useState("");

  const selectedClient = clients.find((client) => client.id === clientId);
  const selectedPayment = activePayments.find((payment) => payment.id === paymentId);

  const selectablePayments = useMemo(() => {
    const scoped = activePayments.filter((payment) => payment.client_id === clientId);
    return scoped.length ? scoped : activePayments;
  }, [activePayments, clientId]);

  const generate = () => {
    const nextMessage = generateReminderMessage({
      client: selectedClient,
      payment: selectedPayment,
      tone,
    });
    setMessage(nextMessage);
    setCopyStatus("");
    setSavedStatus("");
  };

  const copyMessage = async () => {
    if (!message) return;

    try {
      await navigator.clipboard.writeText(message);
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Select and copy the message manually");
    }
  };

  const saveReminder = () => {
    if (!message || !selectedClient || !selectedPayment) return;

    onSaveReminder({
      id: `reminder-${Date.now()}`,
      user_id: "user-1",
      client_id: selectedClient.id,
      payment_id: selectedPayment.id,
      tone,
      message,
      created_at: todayInput(),
    });
    setSavedStatus("Saved");
  };

  const handleClientChange = (value) => {
    setClientId(value);
    const firstPayment = activePayments.find((payment) => payment.client_id === value);
    setPaymentId(firstPayment?.id || activePayments[0]?.id || "");
    setMessage("");
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div className="panel-gradient rounded-lg border border-slate-200 bg-white p-6 shadow-card">
        <div>
          <p className="text-sm font-semibold text-brand-700">Reminder generator</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Write the follow-up without overthinking it.</h2>
          <p className="mt-2 text-sm text-slate-500">
            Pick an unpaid payment, choose the tone, and get a message that protects the client relationship.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <Select id="reminder-client" label="Select client" value={clientId} onChange={(event) => handleClientChange(event.target.value)}>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </Select>

          <Select id="reminder-payment" label="Select unpaid payment" value={paymentId} onChange={(event) => setPaymentId(event.target.value)}>
            {selectablePayments.map((payment) => (
              <option key={payment.id} value={payment.id}>
                {payment.title} - {formatMoney(payment.amount, payment.currency)} - {getClientName(clients, payment.client_id)}
              </option>
            ))}
          </Select>

          <Select id="reminder-tone" label="Reminder tone" value={tone} onChange={(event) => setTone(event.target.value)}>
            {tones.map((toneOption) => (
              <option key={toneOption} value={toneOption}>
                {toneOption}
              </option>
            ))}
          </Select>

          <Button className="w-full" onClick={generate} disabled={!selectedClient || !selectedPayment}>
            Generate reminder
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Copy-ready message</p>
            <h3 className="mt-1 text-lg font-bold text-slate-950">Ready for email, chat, or invoice notes.</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="icon" onClick={generate} aria-label="Regenerate reminder" disabled={!selectedClient || !selectedPayment}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={saveReminder} aria-label="Save reminder" disabled={!message}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-5 min-h-56 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700 shadow-inner">
          {message ||
            "Choose a client and payment, then generate a reminder. The message will include the amount, project, due date, and a professional closing."}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-medium text-slate-500">
            {copyStatus || savedStatus || "Keep the tone calm, direct, and easy to act on."}
          </div>
          <Button onClick={copyMessage} disabled={!message}>
            <Clipboard className="h-4 w-4" />
            Copy to clipboard
          </Button>
        </div>
      </div>
    </section>
  );
}
