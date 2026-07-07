import type { ReactNode, ElementType } from "react";

export function FormCard({ title, icon: Icon, onSave, loading, children }: {
  title: string;
  icon: ElementType;
  onSave: () => void;
  loading?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Icon className="size-4 text-muted-foreground" strokeWidth={1.8} />
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        <button
          onClick={onSave}
          disabled={loading}
          className="h-8 px-4 rounded-md bg-primary text-primary-foreground text-xs font-semibold tracking-wide hover:opacity-90 active:opacity-80 disabled:opacity-50 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
