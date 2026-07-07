import { useNavigate } from "react-router";
import { Search, Settings, AlertTriangle, Cpu, Building2, ArrowRight } from "lucide-react";

const ACTIONS = [
  {
    label: "Consultar",
    description: "Visualizar e pesquisar integrações, desvios, job runners e relações de CNPJ",
    icon: Search,
    to: "/consulta",
    accent: "text-blue-500",
  },
  { label: "Nova Configuração Base", description: "Criar uma nova configuração de integração", icon: Settings, to: "/consulta?new=config", accent: "text-amber-500" },
  { label: "Novo Desvio", description: "Adicionar uma regra de desvio para bypass", icon: AlertTriangle, to: "/consulta?new=desvios", accent: "text-orange-500" },
  { label: "Novo Job Runner", description: "Cadastrar um novo job runner ECS", icon: Cpu, to: "/consulta?new=jobs", accent: "text-purple-500" },
  { label: "Nova Relação de CNPJ", description: "Vincular um CNPJ a uma matriz", icon: Building2, to: "/consulta?new=cnpjs", accent: "text-emerald-500" },
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          Bem-vindo ao Hefestos
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-lg">
          Gerencie suas integrações, desvios, job runners e relações de CNPJ em um único lugar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => navigate(action.to)}
              className="group flex flex-col items-start gap-3 p-5 rounded-xl bg-card border border-border hover:border-ring/50 hover:shadow-sm transition-all text-left cursor-pointer"
            >
              <div className={`size-10 rounded-lg bg-muted flex items-center justify-center ${action.accent}`}>
                <Icon className="size-5" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-foreground">{action.label}</span>
                  <ArrowRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -ml-1" strokeWidth={2} />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
