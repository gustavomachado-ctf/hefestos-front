import type { InputHTMLAttributes } from "react";

export function Input({ id, ...props }: { id: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      id={id}
      className="w-full h-9 px-3 rounded-md bg-input-background border border-border text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
      {...props}
    />
  );
}
