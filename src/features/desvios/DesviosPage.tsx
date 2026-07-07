import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useBypassMutation } from "../../hooks/useBypass";
import { BypassFieldsEnum } from "../../types";
import type { ByPassDTO } from "../../types";
import { FormCard } from "../../components/shared/FormCard";
import { Field } from "../../components/shared/Field";

const EMPTY_FORM: ByPassDTO = {
  name: "",
  base_config_name: null,
  config_name: "",
  field: BypassFieldsEnum.URL_ACESSO,
  comparator: "ILIKE",
  value: "",
  regexp_find: null,
};

export function DesviosPage() {
  const [form, setForm] = useState<ByPassDTO>(EMPTY_FORM);
  const { mutate, loading } = useBypassMutation();

  const set = (k: keyof ByPassDTO) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    try {
      await mutate(form);
      toast.success("Desvio salvo com sucesso.");
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  return (
    <FormCard title="Desvios" icon={AlertTriangle} onSave={handleSave} loading={loading}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
        <Field label="Name" id="dev-name" value={form.name} onChange={(e) => set("name")(e.target.value)} placeholder="ex: desvio-preco" />
        <Field label="Base Config Name" id="dev-bcn" value={form.base_config_name ?? ""} onChange={(e) => set("base_config_name")(e.target.value || null)} placeholder="ex: config-principal" />
        <Field label="Config Name" id="dev-cfg" value={form.config_name} onChange={(e) => set("config_name")(e.target.value)} placeholder="ex: config-filial-sp" />

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
    </FormCard>
  );
}
