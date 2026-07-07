import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router";
import { Toaster } from "sonner";
import { Home, Search } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { Header } from "../layouts/Header";
import { HomePage } from "../features/home/HomePage";
import { ConsultaPage } from "../features/consulta/ConsultaPage";
import { NotFoundPage } from "../features/not-found/NotFoundPage";

const MODULE_ROUTES: Record<string, { label: string; icon: React.ElementType }> = {
  "/": { label: "Início", icon: Home },
  "/consulta": { label: "Consultar", icon: Search },
};

const VALID_PATHS = ["/", "/consulta"];

function CurrentModuleLabel({ pathname }: { pathname: string }) {
  const mod = MODULE_ROUTES[pathname] ?? MODULE_ROUTES["/"];
  const Icon = mod.icon;
  return (
    <>
      <p
        className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        <span className="inline-block size-[6px] rounded-full bg-amber-400" />
        Demo
        <span className="opacity-40 mx-0.5">/</span>
        {mod.label}
      </p>
      <h2 className="text-[22px] font-semibold text-foreground tracking-tight flex items-center gap-2.5">
        <Icon className="size-5 text-muted-foreground" strokeWidth={1.8} />
        {mod.label}
      </h2>
    </>
  );
}

export default function App() {
  const [dark, setDark] = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();

  const isKnownRoute = VALID_PATHS.includes(location.pathname);
  const moduleId = location.pathname === "/consulta" ? "consulta" : "home";

  function handleModuleChange(v: string) {
    const idToRoute: Record<string, string> = {
      home: "/",
      consulta: "/consulta",
    };
    navigate(idToRoute[v] ?? "/");
  }

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Toaster position="bottom-right" richColors />

      <Header
        dark={dark}
        moduleId={moduleId}
        onToggleDark={() => setDark((d: boolean) => !d)}
        onModuleChange={handleModuleChange}
      />

      <main className="pt-[56px] min-h-screen">
        <div className="mx-auto px-6 py-8" style={{ maxWidth: "1600px" }}>
          {isKnownRoute && (
            <div className="mb-6">
              <CurrentModuleLabel pathname={location.pathname} />
            </div>
          )}

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/consulta" element={<ConsultaPage />} />
            <Route path="/desvios" element={<Navigate to="/" replace />} />
            <Route path="/jobs" element={<Navigate to="/" replace />} />
            <Route path="/cnpjs" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          {isKnownRoute && (
            <div className="mt-6 flex items-center justify-end">
              <span className="text-[11px] text-muted-foreground/50" style={{ fontFamily: "'DM Mono', monospace" }}>
                hefestos · demo · v0.1.0
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
