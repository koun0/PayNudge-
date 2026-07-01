import { useState } from "react";
import { Building2, Mail, Phone, UserRound } from "lucide-react";
import { Button } from "./Button";
import { Input, TextArea } from "./Input";

const blankClient = {
  name: "",
  email: "",
  phone: "",
  company: "",
  notes: "",
};

export function AddClientForm({ initialClient, onSave, onCancel }) {
  const [client, setClient] = useState(initialClient || blankClient);
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setClient((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!client.name.trim()) nextErrors.name = "Client name is required.";
    if (!client.email.trim()) nextErrors.email = "Email is required.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    onSave({
      ...client,
      id: initialClient?.id || `client-${Date.now()}`,
      user_id: initialClient?.user_id || "user-1",
      created_at: initialClient?.created_at || new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="client-name"
          label="Client name"
          icon={UserRound}
          value={client.name}
          onChange={(event) => updateField("name", event.target.value)}
          error={errors.name}
          placeholder="Sarah Miles"
        />
        <Input
          id="client-email"
          label="Email"
          type="email"
          icon={Mail}
          value={client.email}
          onChange={(event) => updateField("email", event.target.value)}
          error={errors.email}
          placeholder="client@company.com"
        />
        <Input
          id="client-phone"
          label="Phone number"
          icon={Phone}
          value={client.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder="+1 555 0100"
        />
        <Input
          id="client-company"
          label="Company name"
          icon={Building2}
          value={client.company}
          onChange={(event) => updateField("company", event.target.value)}
          placeholder="Miles Collective"
        />
      </div>
      <TextArea
        id="client-notes"
        label="Notes"
        value={client.notes}
        onChange={(event) => updateField("notes", event.target.value)}
        placeholder="Add billing preferences, project context, or follow-up notes."
      />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialClient ? "Save changes" : "Add client"}</Button>
      </div>
    </form>
  );
}
