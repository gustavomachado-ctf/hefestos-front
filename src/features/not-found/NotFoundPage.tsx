import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span
        className="text-[120px] font-bold leading-none tracking-tight text-muted-foreground/10 select-none"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        404
      </span>
      <h1 className="mt-4 text-xl font-semibold text-foreground">
        Página não encontrada
      </h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        O endpoint que você está procurando não existe ou foi movido.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-8 h-9 px-5 rounded-md bg-primary text-primary-foreground text-xs font-semibold tracking-wide hover:opacity-90 active:opacity-80 transition-opacity flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="size-3.5" strokeWidth={2} />
        Voltar ao início
      </button>
    </div>
  );
}
