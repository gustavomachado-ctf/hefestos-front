import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronDown, Check, Home, Search } from "lucide-react";

const MODULES = [
  { id: "home", label: "Início", icon: Home, route: "/" },
  { id: "consulta", label: "Consultar", icon: Search, route: "/consulta" },
];

export function NavDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const current = MODULES.find((m) => m.id === value) ?? MODULES[0];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSelect(id: string) {
    const mod = MODULES.find((m) => m.id === id);
    if (mod) {
      onChange(id);
      navigate(mod.route);
    }
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 px-3 py-1.5 min-w-[160px] rounded-md text-sm font-medium bg-card border border-border text-foreground hover:bg-muted transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <current.icon className="size-3.5 text-muted-foreground flex-shrink-0" strokeWidth={1.8} />
        <span className="flex-1 text-left">{current.label}</span>
        <ChevronDown className={`size-3.5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} strokeWidth={2} />
      </button>
      {open && (
        <div role="listbox" className="absolute right-0 top-full mt-1.5 w-[200px] bg-card border border-border rounded-lg shadow-md py-1 z-50">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            const isActive = mod.id === value;
            return (
              <button
                key={mod.id}
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(mod.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive ? "bg-accent text-foreground font-medium" : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon className={`size-3.5 flex-shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} strokeWidth={1.8} />
                <span className="flex-1 text-left">{mod.label}</span>
                {isActive && <Check className="size-3.5 text-primary opacity-70 flex-shrink-0" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
