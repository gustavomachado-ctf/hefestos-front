import type { ReactNode } from "react";

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5"
      style={{ fontFamily: "'DM Mono', monospace" }}
    >
      {children}
    </label>
  );
}
