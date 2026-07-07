import type { InputHTMLAttributes } from "react";
import { FieldLabel } from "./FieldLabel";
import { Input } from "./Input";

export function Field({ label, id, ...props }: { label: string; id: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} {...props} />
    </div>
  );
}
