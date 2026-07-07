import { Sun, Moon } from "lucide-react";
import { HecateLogo } from "../components/shared/HecateLogo";
import { EnvDropdown } from "../components/shared/EnvDropdown";
import { NavDropdown } from "./NavDropdown";

export function Header({
  dark,
  moduleId,
  onToggleDark,
  onModuleChange,
}: {
  dark: boolean;
  moduleId: string;
  onToggleDark: () => void;
  onModuleChange: (v: string) => void;
}) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 h-[56px] bg-card border-b border-border">
      <div className="h-full mx-auto px-6 grid items-center" style={{ gridTemplateColumns: "1fr auto 1fr", maxWidth: "1600px" }}>
        <div className="flex items-center">
          <button
            onClick={onToggleDark}
            aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"}
            className="size-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 cursor-pointer"
          >
            {dark ? <Sun className="size-4" strokeWidth={1.8} /> : <Moon className="size-4" strokeWidth={1.8} />}
          </button>
        </div>

        <HecateLogo />

        <div className="flex items-center justify-end gap-2.5">
          <EnvDropdown />
          <div className="w-px h-4 bg-border mx-0.5" aria-hidden="true" />
          <NavDropdown value={moduleId} onChange={onModuleChange} />
        </div>
      </div>
    </header>
  );
}
