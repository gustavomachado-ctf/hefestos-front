import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Plus, Search, RefreshCw, Settings, AlertTriangle, Cpu, Building2, ArrowUpDown, ArrowUp, ArrowDown, Copy } from "lucide-react";
import Fuse from "fuse.js";
import type { RegisterDTO, ByPassDTO, JobRunnerDTO, CnpjRelationDTO } from "../../types";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "../../app/components/ui/table";
import { Badge } from "../../app/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../app/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "../../app/components/ui/dialog";
import { useIntegrations, useRefreshIntegrations } from "../../hooks/useIntegrations";
import { ConfigForm } from "./components/ConfigForm";
import { DesvioForm } from "./components/DesvioForm";
import { JobRunnerForm } from "./components/JobRunnerForm";
import { CnpjForm } from "./components/CnpjForm";

function formatCNPJ(v: string | null | undefined): string {
  if (!v) return "-";
  const d = v.replace(/\D/g, "").slice(0, 14);
  if (d.length !== 14) return v;
  return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8,12)}-${d.slice(12)}`;
}

interface SearchSection<T> {
  id: string;
  label: string;
  icon: React.ElementType;
  columns: { key: string; header: string; render: (item: T) => React.ReactNode }[];
  searchPlaceholder: string;
  detail: (item: T) => { label: string; value: React.ReactNode; copyValue?: string }[];
}

function TruncatedCell({ value }: { value: string }) {
  return (
    <span className="block max-w-[200px] truncate" title={value}>
      {value}
    </span>
  );
}

const SECTIONS: SearchSection<any>[] = [
  {
    id: "config",
    label: "Configurações Base",
    icon: Settings,
    searchPlaceholder: "Filtrar por nome da integração...",
    columns: [
      { key: "name", header: "Nome", render: (r: RegisterDTO) => <TruncatedCell value={r.name} /> },
      { key: "cnpj", header: "CNPJ", render: (r: RegisterDTO) => formatCNPJ(r.cnpj) },
      { key: "bucket_name", header: "Bucket", render: (r: RegisterDTO) => <TruncatedCell value={r.bucket_name ?? "-"} /> },
      { key: "general_queue", header: "Fila Geral", render: (r: RegisterDTO) => <TruncatedCell value={r.general_queue ?? "-"} /> },
      { key: "order_queue", header: "Fila de Pedido", render: (r: RegisterDTO) => <TruncatedCell value={r.order_queue ?? "-"} /> },
      { key: "authentication_queue", header: "Fila de Autenticação", render: (r: RegisterDTO) => <TruncatedCell value={r.authentication_queue ?? "-"} /> },
      { key: "price_ingestion_queue", header: "Fila de Preço", render: (r: RegisterDTO) => <TruncatedCell value={r.price_ingestion_queue ?? "-"} /> },
      { key: "payment_condition_queue", header: "Fila de Pagamento", render: (r: RegisterDTO) => <TruncatedCell value={r.payment_condition_queue ?? "-"} /> },
      { key: "aux_queue", header: "Fila Auxiliar", render: (r: RegisterDTO) => <TruncatedCell value={r.aux_queue ?? "-"} /> },
      { key: "pedpreco_order_queue", header: "Fila Pedpreco Pedido", render: (r: RegisterDTO) => <TruncatedCell value={r.pedpreco_order_queue ?? "-"} /> },
      { key: "pedpreco_invoice_queue", header: "Fila Pedpreco Retorno", render: (r: RegisterDTO) => <TruncatedCell value={r.pedpreco_invoice_queue ?? "-"} /> },
      { key: "job_runner_name", header: "Job Runner", render: (r: RegisterDTO) => <TruncatedCell value={r.job_runner_name ?? "-"} /> },
      { key: "use_protheus", header: "Protheus", render: (r: RegisterDTO) => (
        <Badge className={r.use_protheus
          ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700"
          : "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700"
        }>{r.use_protheus ? "Sim" : "Não"}</Badge>
      )},
    ],
    detail: (r: RegisterDTO) => [
      { label: "Nome", value: r.name },
      { label: "CNPJ", value: formatCNPJ(r.cnpj) },
      { label: "Bucket", value: r.bucket_name ?? "-" },
      { label: "Fila de Pagamento", value: r.payment_condition_queue ?? "-" },
      { label: "Fila Auxiliar", value: r.aux_queue ?? "-" },
      { label: "Fila Geral", value: r.general_queue ?? "-" },
      { label: "Fila de Pedido", value: r.order_queue ?? "-" },
      { label: "Fila de Autenticação", value: r.authentication_queue ?? "-" },
      { label: "Fila de Preço", value: r.price_ingestion_queue ?? "-" },
      { label: "Fila Pedpreco Pedido", value: r.pedpreco_order_queue ?? "-" },
      { label: "Fila Pedpreco Retorno", value: r.pedpreco_invoice_queue ?? "-" },
      { label: "Job Runner", value: r.job_runner_name ?? "-" },
      { label: "Protheus", value: r.use_protheus ? "Sim" : "Não" },
    ],
  },
  {
    id: "desvios",
    label: "Desvios",
    icon: AlertTriangle,
    searchPlaceholder: "Filtrar por nome da configuração...",
    columns: [
      { key: "name", header: "Nome", render: (b: ByPassDTO) => b.name },
      { key: "base_config_name", header: "Config Base", render: (b: ByPassDTO) => b.base_config_name ?? "-" },
      { key: "config_name", header: "Config Hecate", render: (b: ByPassDTO) => b.config_name },
      { key: "field", header: "Campo", render: (b: ByPassDTO) => <Badge variant="outline">{b.field}</Badge> },
      { key: "comparator", header: "Comparador", render: (b: ByPassDTO) => b.comparator ?? "ILIKE" },
      { key: "value", header: "Valor", render: (b: ByPassDTO) => b.value },
      { key: "regexp_find", header: "Regex", render: (b: ByPassDTO) => b.regexp_find ?? "-" },
    ],
    detail: (b: ByPassDTO) => [
      { label: "Nome", value: b.name },
      { label: "Config Base", value: b.base_config_name ?? "-" },
      { label: "Config Hecate", value: b.config_name },
      { label: "Campo", value: b.field },
      { label: "Comparador", value: b.comparator ?? "ILIKE" },
      { label: "Valor", value: b.value },
      { label: "Regex", value: b.regexp_find ?? "-" },
    ],
  },
  {
    id: "jobs",
    label: "Job Runners",
    icon: Cpu,
    searchPlaceholder: "Filtrar por nome...",
    columns: [
      { key: "name", header: "Nome", render: (j: JobRunnerDTO) => j.name },
      { key: "task_definition_id", header: "Definição da Tarefa", render: (j: JobRunnerDTO) => <TruncatedCell value={j.task_definition_id} /> },
      { key: "cluster", header: "Cluster", render: (j: JobRunnerDTO) => j.cluster },
      { key: "capacity_provider", header: "Provedor", render: (j: JobRunnerDTO) => j.capacity_provider ?? "FARGATE" },
      { key: "container_name", header: "Container", render: (j: JobRunnerDTO) => j.container_name },
      { key: "subnets", header: "Sub-redes", render: (j: JobRunnerDTO) => <TruncatedCell value={j.subnets} /> },
      { key: "security_groups", header: "Grupos de Segurança", render: (j: JobRunnerDTO) => <TruncatedCell value={j.security_groups} /> },
      { key: "assign_public_ip", header: "IP Público", render: (j: JobRunnerDTO) => (
        <Badge className={j.assign_public_ip
          ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700"
          : "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700"
        }>{j.assign_public_ip ? "Sim" : "Não"}</Badge>
      )},
    ],
    detail: (j: JobRunnerDTO) => [
      { label: "Nome", value: j.name },
      { label: "Definição da Tarefa", value: j.task_definition_id },
      { label: "Cluster", value: j.cluster },
      { label: "Provedor", value: j.capacity_provider ?? "FARGATE" },
      { label: "Container", value: j.container_name },
      { label: "Sub-redes", value: j.subnets },
      { label: "Grupos de Segurança", value: j.security_groups },
      { label: "IP Público", value: j.assign_public_ip ? "Sim" : "Não" },
    ],
  },
  {
    id: "cnpjs",
    label: "Relação de CNPJs",
    icon: Building2,
    searchPlaceholder: "Filtrar por CNPJ...",
    columns: [
      { key: "cnpj", header: "CNPJ", render: (c: CnpjRelationDTO) => formatCNPJ(c.cnpj) },
      { key: "parent_cnpj", header: "CNPJ Matriz", render: (c: CnpjRelationDTO) => formatCNPJ(c.parent_cnpj) },
    ],
    detail: (c: CnpjRelationDTO) => [
      { label: "CNPJ", value: formatCNPJ(c.cnpj) },
      { label: "CNPJ Matriz", value: formatCNPJ(c.parent_cnpj) },
    ],
  },
];

function DetailDialog({
  open, onOpenChange, title, fields,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  fields: { label: string; value: React.ReactNode; copyValue?: string }[];
}) {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const copyToClipboard = (text: string): boolean => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "0";
    ta.style.top = "0";
    ta.style.width = "0";
    ta.style.height = "0";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { /* noop */ }
    document.body.removeChild(ta);
    return ok;
  };

  const showCopied = (label: string) => {
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 1500);
  };

  const copy = (label: string, text: string) => {
    if (copyToClipboard(text)) {
      showCopied(label);
    } else {
      navigator.clipboard.writeText(text).then(
        () => showCopied(label),
        () => { /* ambos os métodos falharam */ },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-2">
          {fields.map((f) => (
            <div key={f.label} className="space-y-0.5 group">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {f.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="block text-sm text-foreground break-all flex-1">
                  {f.value}
                </span>
                <button
                  onClick={() => copy(f.label, f.copyValue ?? (typeof f.value === "string" ? f.value : ""))}
                  className="size-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer flex-shrink-0"
                  title="Copiar"
                >
                  {copiedLabel === f.label ? (
                    <span className="text-[9px] font-semibold text-green-600">OK</span>
                  ) : (
                    <Copy className="size-3" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EntitySearchSection({
  section, allData, isLoading, isFetching, fetchError,
  search, onSearchChange, onRefresh, onNew, onDetail,
  sortKey, sortDir, onSort,
}: {
  section: SearchSection<any>;
  allData: any[] | null;
  isLoading: boolean;
  isFetching: boolean;
  fetchError: Error | null;
  search: string;
  onSearchChange: (v: string) => void;
  onRefresh: () => void;
  onNew: () => void;
  onDetail: (item: any) => void;
  sortKey: string | null;
  sortDir: "asc" | "desc";
  onSort: (key: string) => void;
}) {
  const fuse = useMemo(() => {
    if (!allData) return null;
    return new Fuse(allData, {
      keys: section.columns.map((c) => c.key),
      threshold: 0.4,
      ignoreLocation: true,
    });
  }, [allData, section.columns]);

  const filtered = useMemo(() => {
    if (!allData) return null;
    const q = search.trim();
    if (!q) return allData;
    if (!fuse) return allData;

    const ql = q.toLowerCase();
    const keys = section.columns.map((c) => c.key);

    const exact = allData.filter((item: any) =>
      keys.some((k) => String(item[k] ?? "").toLowerCase() === ql),
    );
    if (exact.length > 0) return exact;

    return fuse.search(q).map((r) => r.item);
  }, [allData, search, fuse, section.columns]);

  const sorted = useMemo(() => {
    if (!filtered || sortKey === null) return filtered;
    return [...filtered].sort((a, b) => {
      const va = String(a[sortKey] ?? "").toLowerCase();
      const vb = String(b[sortKey] ?? "").toLowerCase();
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [filtered, sortKey, sortDir]);

  const visible = sorted ?? [];
  const hasData = allData !== null && allData !== undefined;
  const isEmpty = hasData && visible.length === 0;

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ArrowUpDown className="size-3 opacity-30" strokeWidth={1.5} />;
    return sortDir === "asc"
      ? <ArrowUp className="size-3" strokeWidth={2} />
      : <ArrowDown className="size-3" strokeWidth={2} />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={section.searchPlaceholder}
          className="h-9 max-w-md flex-1 px-3 rounded-md bg-input-background border border-border text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
        />
        <button
          onClick={onNew}
          className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs font-semibold tracking-wide hover:opacity-90 active:opacity-80 transition-opacity flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="size-3.5" strokeWidth={2} />
          Novo
        </button>
        <button
          onClick={onRefresh}
          disabled={isFetching}
          className="h-9 px-3 rounded-md border border-border bg-card text-muted-foreground text-xs font-semibold tracking-wide hover:bg-muted/50 active:opacity-80 disabled:opacity-50 transition-opacity flex items-center gap-1.5 cursor-pointer"
          title="Atualizar dados"
        >
          <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} strokeWidth={2} />
          {isFetching ? "Atualizando..." : "Atualizar"}
        </button>
      </div>

      {fetchError && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {fetchError.message}
        </div>
      )}

      {isLoading && !hasData && (
        <div className="rounded-md border border-border overflow-hidden animate-pulse">
          <div className="border-b border-border bg-muted/30">
            <div className="flex gap-4 px-2 py-3">
              {section.columns.map((col: any) => (
                <div
                  key={col.key}
                  className="h-3 rounded bg-muted-foreground/15"
                  style={{ width: `${Math.max(60, 120 - col.key.length * 2)}px` }}
                />
              ))}
            </div>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex gap-4 px-2 py-3 ${i % 2 === 1 ? "bg-muted/10" : ""}`}
            >
              {section.columns.map((col: any) => (
                <div
                  key={col.key}
                  className="h-3 rounded bg-muted-foreground/10"
                  style={{ width: `${Math.max(40, 100 - col.key.length * 2)}px` }}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {hasData && isEmpty && (
        <div className="rounded-md bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
          Nenhum registro encontrado.
        </div>
      )}

      {hasData && visible.length > 0 && (
        <div className="flex items-center justify-end">
          <span className="text-xs text-muted-foreground tabular-nums">
            {visible.length} {visible.length === 1 ? "registro" : "registros"}
          </span>
        </div>
      )}
      {hasData && visible.length > 0 && (
        <div className="rounded-md border border-border overflow-auto max-h-[60vh]">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow>
                {section.columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className="text-xs cursor-pointer select-none hover:bg-muted/50 transition-colors bg-card"
                    onClick={() => onSort(col.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.header}
                      <SortIcon colKey={col.key} />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((item: any, idx: number) => (
                <TableRow
                  key={idx}
                  onDoubleClick={() => onDetail(item)}
                  className={`cursor-pointer ${idx % 2 === 1 ? "bg-muted/20" : ""}`}
                >
                  {section.columns.map((col) => (
                    <TableCell key={col.key} className="text-xs py-2.5">{col.render(item)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!hasData && !isLoading && !fetchError && (
        <div className="rounded-md bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
          Digite um termo para pesquisar.
        </div>
      )}
    </div>
  );
}

export function ConsultaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const newParam = searchParams.get("new");
  const [activeTab, setActiveTab] = useState(newParam && SECTIONS.find((s) => s.id === newParam) ? newParam : "config");
  const queries = useIntegrations(activeTab);
  const refresh = useRefreshIntegrations();

  const [activeForm, setActiveForm] = useState<string | null>(newParam && SECTIONS.find((s) => s.id === newParam) ? newParam : null);

  useEffect(() => {
    if (newParam) {
      setSearchParams({}, { replace: true });
    }
  }, []);

  const [sessions, setSessions] = useState<Record<string, {
    search: string;
    sortKey: string | null;
    sortDir: "asc" | "desc";
  }>>(() => {
    const initial: Record<string, any> = {};
    for (const s of SECTIONS) {
      initial[s.id] = { search: "", sortKey: null, sortDir: "asc" };
    }
    return initial;
  });

  const [detailItem, setDetailItem] = useState<{ section: SearchSection<any>; item: any } | null>(null);

  const sectionMap: Record<string, { query: typeof queries.config; section: typeof SECTIONS[number] }> = {
    config: { query: queries.config, section: SECTIONS[0] },
    desvios: { query: queries.desvios, section: SECTIONS[1] },
    jobs: { query: queries.jobs, section: SECTIONS[2] },
    cnpjs: { query: queries.cnpjs, section: SECTIONS[3] },
  };

  const formConfig: Record<string, { title: string; icon: React.ElementType; component: React.FC<{ onSuccess?: () => void }> }> = {
    config: { title: "Nova Configuração Base", icon: Settings, component: ConfigForm },
    desvios: { title: "Novo Desvio", icon: AlertTriangle, component: DesvioForm },
    jobs: { title: "Novo Job Runner", icon: Cpu, component: JobRunnerForm },
    cnpjs: { title: "Nova Relação de CNPJ", icon: Building2, component: CnpjForm },
  };

  const handleSort = (sectionId: string, key: string) => {
    setSessions((prev) => {
      const s = prev[sectionId];
      return {
        ...prev,
        [sectionId]: {
          ...s,
          sortKey: s.sortKey === key && s.sortDir === "asc" ? key : key,
          sortDir: s.sortKey === key ? (s.sortDir === "asc" ? "desc" : "asc") : "asc",
        },
      };
    });
  };

  function handleFormSuccess() {
    setActiveForm(null);
    refresh();
  }

  return (
    <>
      <Tabs defaultValue="config" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          {SECTIONS.map((s) => (
            <TabsTrigger key={s.id} value={s.id} className="gap-2 cursor-pointer">
              <s.icon className="size-4" />
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {SECTIONS.map((s) => {
          const { query } = sectionMap[s.id];
          const session = sessions[s.id];
          return (
            <TabsContent key={s.id} value={s.id}>
              <EntitySearchSection
                section={s}
                allData={query.data ?? null}
                isLoading={query.isLoading}
                isFetching={query.isFetching}
                fetchError={query.error}
                search={session.search}
                sortKey={session.sortKey}
                sortDir={session.sortDir}
                onSort={(key) => handleSort(s.id, key)}
                onSearchChange={(v) => setSessions((prev) => ({ ...prev, [s.id]: { ...prev[s.id], search: v } }))}
                onRefresh={refresh}
                onNew={() => setActiveForm(s.id)}
                onDetail={(item) => setDetailItem({ section: s, item })}
              />
            </TabsContent>
          );
        })}
      </Tabs>

      {detailItem && (
        <DetailDialog
          open
          onOpenChange={() => setDetailItem(null)}
          title={`${detailItem.section.label} — ${detailItem.item.name ?? detailItem.item.cnpj ?? ""}`}
          fields={detailItem.section.detail(detailItem.item)}
        />
      )}

      {activeForm && (() => {
        const fc = formConfig[activeForm];
        const Icon = fc.icon;
        const FormComponent = fc.component;
        return (
          <Dialog open onOpenChange={() => setActiveForm(null)}>
            <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Icon className="size-4 text-muted-foreground" strokeWidth={1.8} />
                  {fc.title}
                </DialogTitle>
              </DialogHeader>
              <FormComponent onSuccess={handleFormSuccess} />
            </DialogContent>
          </Dialog>
        );
      })()}
    </>
  );
}
