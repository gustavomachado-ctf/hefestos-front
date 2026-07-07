export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-2 pb-1 col-span-full">
      <span
        className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 whitespace-nowrap"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        {label}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
