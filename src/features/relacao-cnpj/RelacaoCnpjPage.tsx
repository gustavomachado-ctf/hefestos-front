import { useState } from "react";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { useCnpjRelationMutation } from "../../hooks/useCnpjRelation";
import type { CnpjRelationDTO } from "../../types";
import { FormCard } from "../../components/shared/FormCard";
import { Field } from "../../components/shared/Field";

const EMPTY_FORM: CnpjRelationDTO = {
  cnpj: "",
  parent_cnpj: "",
};

export function RelacaoCnpjPage() {
  const [form, setForm] = useState<CnpjRelationDTO>(EMPTY_FORM);
  const { mutate, loading } = useCnpjRelationMutation();

  const set = (k: keyof CnpjRelationDTO) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    try {
      await mutate(form);
      toast.success("CNPJ salvo com sucesso.");
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  return (
    <FormCard title="Relação de CNPJs" icon={Building2} onSave={handleSave} loading={loading}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <Field label="CNPJ" id="cnpj-val" value={form.cnpj} onChange={(e) => set("cnpj")(e.target.value)} placeholder="00.000.000/0000-00" />
        <Field label="Parent CNPJ" id="cnpj-parent" value={form.parent_cnpj} onChange={(e) => set("parent_cnpj")(e.target.value)} placeholder="00.000.000/0000-00" />
      </div>
    </FormCard>
  );
}
