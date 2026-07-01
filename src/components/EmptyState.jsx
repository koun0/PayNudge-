import { FileSearch } from "lucide-react";
import { Button } from "./Button";

export function EmptyState({ title, description, actionLabel, onAction, icon: Icon = FileSearch }) {
  return (
    <div className="panel-gradient rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-white text-brand-700 shadow-sm ring-1 ring-slate-200">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {actionLabel && (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
