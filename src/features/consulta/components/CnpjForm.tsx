import { useState } from "react";
import { toast } from "sonner";
import { useCnpjRelationMutation } from "../../../hooks/useCnpjRelation";
import type { CnpjRelationDTO } from "../../../types";
import { Field } from "../../../components/shared/Field";

const EMPTY: CnpjRelationDTO = {
  cnpj: "",
  parent_cnpj: "",
};

export function CnpjForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState<CnpjRelationDTO>(EMPTY);
  const { mutate, loading } = useCnpjRelationMutation();

  const set = (k: keyof CnpjRelationDTO) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    try {
      await mutate(form);
      toast.success("Relação de CNPJ salva com sucesso.");
      setForm(EMPTY);
      onSuccess?.();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <Field label="CNPJ" id="cnpj-val" value={form.cnpj} onChange={(e) => set("cnpj")(e.target.value)} placeholder="00.000.000/0000-00" />
        <Field label="Parent CNPJ" id="cnpj-parent" value={form.parent_cnpj} onChange={(e) => set("parent_cnpj")(e.target.value)} placeholder="00.000.000/0000-00" />
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
