import { CheckCircle2, Edit3, RotateCcw, Search, Trash2 } from "lucide-react";
import { Button } from "./Button";
import { Input, Select } from "./Input";
import { StatusBadge } from "./StatusBadge";
import { EmptyState } from "./EmptyState";
import {
  formatDate,
  formatMoney,
  getClientName,
  getPaymentDisplayStatus,
  getPaymentStatus,
} from "../utils/payments";

export function PaymentTable({
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
  const filteredPayments = payments.filter((payment) => {
    const clientName = getClientName(clients, payment.client_id);
    const status = getPaymentDisplayStatus(payment);
    const matchesSearch = `${clientName} ${payment.title}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card ring-1 ring-slate-100">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,20rem)_12rem]">
          <Input
            id="payment-search"
            icon={Search}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by client or project"
          />
          <Select id="payment-filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="due-soon">Due Soon</option>
            <option value="overdue">Overdue</option>
          </Select>
        </div>
        <Button onClick={onAdd}>Add payment</Button>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="p-5">
          <EmptyState
            title={search || filter !== "all" ? "No matching payments" : "No payments yet"}
            description={
              search || filter !== "all"
                ? "Adjust the search or status filter to find a payment in your queue."
                : "Add a payment as soon as project terms are confirmed so due dates never depend on memory."
            }
            actionLabel="Add payment"
            onAction={onAdd}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-gradient-to-r from-slate-50 to-white">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">
                  Payment
                </th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">
                  Client
                </th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">
                  Due date
                </th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-normal text-slate-500">
                  Amount
                </th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-normal text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredPayments.map((payment) => {
                const status = getPaymentDisplayStatus(payment);
                const baseStatus = getPaymentStatus(payment);
                return (
                  <tr key={payment.id} className="transition hover:bg-brand-50/35">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-950">{payment.title}</div>
                      <div className="max-w-xs truncate text-sm text-slate-500">{payment.notes}</div>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                      {getClientName(clients, payment.client_id)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{formatDate(payment.due_date)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-bold text-slate-950">
                      {formatMoney(payment.amount, payment.currency)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {baseStatus === "paid" ? (
                          <Button variant="ghost" size="icon" onClick={() => onMarkUnpaid(payment.id)} aria-label="Mark unpaid">
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" onClick={() => onMarkPaid(payment.id)} aria-label="Mark paid">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => onEdit(payment)} aria-label={`Edit ${payment.title}`}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(payment.id)} aria-label={`Delete ${payment.title}`}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
