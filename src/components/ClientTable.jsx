import { Edit3, Eye, Search, Trash2 } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";
import { StatusBadge } from "./StatusBadge";
import { EmptyState } from "./EmptyState";
import { formatMoney, getClientStatus, getClientTotals } from "../utils/payments";

export function ClientTable({
  clients,
  payments,
  search,
  setSearch,
  onView,
  onEdit,
  onDelete,
  onAdd,
}) {
  const filteredClients = clients.filter((client) => {
    const searchText = `${client.name} ${client.email} ${client.company}`.toLowerCase();
    return searchText.includes(search.toLowerCase());
  });

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card ring-1 ring-slate-100">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <Input
          id="client-search"
          className="sm:w-80"
          icon={Search}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search clients"
        />
        <Button onClick={onAdd}>Add client</Button>
      </div>

      {filteredClients.length === 0 ? (
        <div className="p-5">
          <EmptyState
            title={search ? "No matching clients" : "No clients yet"}
            description={
              search
                ? "Try a different name, email, or company. Your client list stays searchable as it grows."
                : "Add your first client so every unpaid payment has a clear owner and contact record."
            }
            actionLabel="Add client"
            onAction={onAdd}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-gradient-to-r from-slate-50 to-white">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">
                  Client
                </th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">
                  Contact
                </th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">
                  Unpaid
                </th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-normal text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredClients.map((client) => {
                const totals = getClientTotals(payments, client.id);
                const status = getClientStatus(payments, client.id);

                return (
                  <tr key={client.id} className="transition hover:bg-brand-50/35">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-950">{client.name}</div>
                      <div className="text-sm text-slate-500">{client.company || "Independent client"}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-slate-700">{client.email}</div>
                      <div className="text-sm text-slate-500">{client.phone}</div>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-950">
                      {formatMoney(totals.unpaid, "USD")}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge type="client" status={status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onView(client)} aria-label={`View ${client.name}`}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onEdit(client)} aria-label={`Edit ${client.name}`}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(client.id)} aria-label={`Delete ${client.name}`}>
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
