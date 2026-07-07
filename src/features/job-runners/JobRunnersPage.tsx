import { useState } from "react";
import { Cpu } from "lucide-react";
import { toast } from "sonner";
import { useJobRunnerMutation } from "../../hooks/useJobRunner";
import type { JobRunnerDTO } from "../../types";
import { FormCard } from "../../components/shared/FormCard";
import { Field } from "../../components/shared/Field";
import { Toggle } from "../../components/shared/Toggle";

const EMPTY_FORM: JobRunnerDTO = {
  name: "",
  task_definition_id: "",
  cluster: "",
  capacity_provider: "FARGATE",
  container_name: "",
  subnets: "",
  security_groups: "",
  assign_public_ip: false,
};

export function JobRunnersPage() {
  const [form, setForm] = useState<JobRunnerDTO>(EMPTY_FORM);
  const { mutate, loading } = useJobRunnerMutation();

  const set = (k: keyof JobRunnerDTO) => (v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    try {
      await mutate(form);
      toast.success("Job Runner salvo com sucesso.");
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  return (
    <FormCard title="Job Runners" icon={Cpu} onSave={handleSave} loading={loading}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
        <Field label="Name" id="jr-name" value={form.name} onChange={(e) => set("name")(e.target.value)} placeholder="ex: runner-prod-01" />
        <Field label="Task Definition ID" id="jr-td" value={form.task_definition_id} onChange={(e) => set("task_definition_id")(e.target.value)} placeholder="arn:ecs:..." />
        <Field label="Cluster" id="jr-cluster" value={form.cluster} onChange={(e) => set("cluster")(e.target.value)} placeholder="ex: cluster-prod" />
        <Field label="Capacity Provider" id="jr-cp" value={form.capacity_provider ?? "FARGATE"} onChange={(e) => set("capacity_provider")(e.target.value)} placeholder="FARGATE" />
        <Field label="Container Name" id="jr-container" value={form.container_name} onChange={(e) => set("container_name")(e.target.value)} placeholder="ex: hecate-worker" />
        <Field label="Subnets" id="jr-subnets" value={form.subnets} onChange={(e) => set("subnets")(e.target.value)} placeholder="subnet-xxx,subnet-yyy" />
        <Field label="Security Groups" id="jr-sgs" value={form.security_groups} onChange={(e) => set("security_groups")(e.target.value)} placeholder="sg-xxx" />
        <div className="flex flex-col justify-end">
          <Toggle label="Assign Public IP" id="jr-pip" checked={form.assign_public_ip} onChange={(v) => set("assign_public_ip")(v)} />
        </div>
      </div>
    </FormCard>
  );
}
