import { useState } from "react";
import { toast } from "sonner";
import { useBypassMutation } from "../../../hooks/useBypass";
import { BypassFieldsEnum } from "../../../types";
import type { ByPassDTO } from "../../../types";
import { Field } from "../../../components/shared/Field";
import { SectionDivider } from "../../../components/shared/SectionDivider";

const EMPTY: ByPassDTO = {
  name: "",
  base_config_name: null,
  config_name: "",
  field: BypassFieldsEnum.URL_ACESSO,
  comparator: "ILIKE",
  value: "",
  regexp_find: null,
};

export function DesvioForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState<ByPassDTO>(EMPTY);
  const { mutate, loading } = useBypassMutation();

  const set = (k: keyof ByPassDTO) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    try {
      await mutate(form);
      toast.success("Desvio salvo com sucesso.");
      setForm(EMPTY);
      onSuccess?.();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  return (
    <div className="space-y-5">
      <SectionDivider label="Configuração" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <Field label="Name" id="dev-name" value={form.name} onChange={(e) => set("name")(e.target.value)} placeholder="ex: desvio-preco" />
        <Field label="Base Config Name" id="dev-bcn" value={form.base_config_name ?? ""} onChange={(e) => set("base_config_name")(e.target.value || null)} placeholder="ex: config-principal" />
        <Field label="Config Name" id="dev-cfg" value={form.config_name} onChange={(e) => set("config_name")(e.target.value)} placeholder="ex: config-filial-sp" />
      </div>

      <SectionDivider label="Regra" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <label htmlFor="dev-field" className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
            Field
          </label>
          <select
            id="dev-field"
            value={form.field}
            onChange={(e) => set("field")(e.target.value)}
            className="w-full h-9 px-3 rounded-md bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
          >
            <option value={BypassFieldsEnum.URL_ACESSO}>URL_ACESSO</option>
            <option value={BypassFieldsEnum.CODIGO_AUXILIAR}>CODIGO_AUXILIAR</option>
          </select>
        </div>
        <Field label="Comparator" id="dev-comp" value={form.comparator ?? "ILIKE"} onChange={(e) => set("comparator")(e.target.value)} placeholder="ILIKE" />
        <Field label="Value" id="dev-val" value={form.value} onChange={(e) => set("value")(e.target.value)} placeholder="ex: flag-desvio" />
        <Field label="Regexp Find" id="dev-regex" value={form.regexp_find ?? ""} onChange={(e) => set("regexp_find")(e.target.value || null)} placeholder="ex: regex de validação" />
      </div>

      <div className="flex justify-end pt-2 border-t border-border">
        <button
          onClick={handleSave}
          disabled={loading}
          className="h-9 px-5 rounded-md bg-primary text-primary-foreground text-xs font-semibold tracking-wide hover:opacity-90 active:opacity-80 disabled:opacity-50 transition-opacity flex items-center gap-1.5 cursor-pointer"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}
