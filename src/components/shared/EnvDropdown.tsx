const ENV_STYLE = { dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700 border-amber-200" };

export function EnvDropdown() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold tracking-wide border transition-all duration-150 cursor-default select-none bg-amber-50 text-amber-700 border-amber-200">
      <span className="size-[7px] rounded-full flex-shrink-0 bg-amber-400" />
      Demo
    </div>
  );
}