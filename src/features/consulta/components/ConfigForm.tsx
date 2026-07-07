import { useState } from "react";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { useRegisterMutation } from "../../../hooks/useRegister";
import type { RegisterDTO } from "../../../types";
import { Field } from "../../../components/shared/Field";
import { Toggle } from "../../../components/shared/Toggle";
import { SectionDivider } from "../../../components/shared/SectionDivider";

const EMPTY: RegisterDTO = {
  name: "",
  cnpj: null,
  bucket_name: null,
  payment_condition_queue: null,
  aux_queue: null,
  general_queue: null,
  order_queue: null,
  authentication_queue: null,
  price_ingestion_queue: null,
  pedpreco_order_queue: null,
  pedpreco_invoice_queue: null,
  job_runner_name: null,
  use_protheus: true,
};

export function ConfigForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState<RegisterDTO>(EMPTY);
  const { mutate, loading } = useRegisterMutation();

  const set = (k: keyof RegisterDTO) => (v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    try {
      await mutate(form);
      toast.success("Configuração Base salva com sucesso.");
      setForm(EMPTY);
      onSuccess?.();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  return (
    <div className="space-y-5">
      <SectionDivider label="Identificação" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <Field label="Name" id="cfg-name" value={form.name} onChange={(e) => set("name")(e.target.value)} placeholder="ex: config-principal" />
        <Field label="CNPJ" id="cfg-cnpj" value={form.cnpj ?? ""} onChange={(e) => set("cnpj")(e.target.value || null)} placeholder="00.000.000/0000-00" />
        <Field label="Bucket Name" id="cfg-bucket" value={form.bucket_name ?? ""} onChange={(e) => set("bucket_name")(e.target.value || null)} placeholder="s3://meu-bucket" />
      </div>

      <SectionDivider label="Filas" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <Field label="Payment Condition Queue" id="cfg-pcq" value={form.payment_condition_queue ?? ""} onChange={(e) => set("payment_condition_queue")(e.target.value || null)} placeholder="nome-da-fila" />
        <Field label="Aux Queue" id="cfg-aq" value={form.aux_queue ?? ""} onChange={(e) => set("aux_queue")(e.target.value || null)} placeholder="nome-da-fila" />
        <Field label="General Queue" id="cfg-gq" value={form.general_queue ?? ""} onChange={(e) => set("general_queue")(e.target.value || null)} placeholder="nome-da-fila" />
        <Field label="Order Queue" id="cfg-oq" value={form.order_queue ?? ""} onChange={(e) => set("order_queue")(e.target.value || null)} placeholder="nome-da-fila" />
        <Field label="Authentication Queue" id="cfg-auq" value={form.authentication_queue ?? ""} onChange={(e) => set("authentication_queue")(e.target.value || null)} placeholder="nome-da-fila" />
        <Field label="Price Ingestion Queue" id="cfg-piq" value={form.price_ingestion_queue ?? ""} onChange={(e) => set("price_ingestion_queue")(e.target.value || null)} placeholder="nome-da-fila" />
        <Field label="Pedpreco Order Queue" id="cfg-poq" value={form.pedpreco_order_queue ?? ""} onChange={(e) => set("pedpreco_order_queue")(e.target.value || null)} placeholder="nome-da-fila" />
        <Field label="Pedpreco Invoice Queue" id="cfg-piq2" value={form.pedpreco_invoice_queue ?? ""} onChange={(e) => set("pedpreco_invoice_queue")(e.target.value || null)} placeholder="nome-da-fila" />
      </div>

      <SectionDivider label="Integração" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <Field label="Job Runner Name" id="cfg-jrn" value={form.job_runner_name ?? ""} onChange={(e) => set("job_runner_name")(e.target.value || null)} placeholder="ex: runner-prod-01" />
        <Toggle label="Use Protheus" id="cfg-protheus" checked={form.use_protheus ?? true} onChange={(v) => set("use_protheus")(v)} />
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
