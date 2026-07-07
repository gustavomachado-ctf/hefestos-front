import { FieldLabel } from "./FieldLabel";

export function Toggle({ label, id, checked, onChange }: {
  label: string; id: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between h-9">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 ${
          checked ? "bg-primary" : "bg-switch-background"
        }`}
      >
        <span
          className={`inline-block size-[14px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-[18px]" : "translate-x-[3px]"
          }`}
        />
      </button>
    </div>
  );
}
