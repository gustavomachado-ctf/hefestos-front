import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { registerService } from "../services/register";
import { bypassService } from "../services/bypass";
import { jobRunnerService } from "../services/jobRunner";
import { cnpjRelationService } from "../services/cnpjRelation";
import type { RegisterDTO, ByPassDTO, JobRunnerDTO, CnpjRelationDTO } from "../types";

const STALE_TIME = 10 * 60 * 1000;
const GC_TIME = 20 * 60 * 1000;

function asArray<T>(v: T[] | T): T[] {
  return Array.isArray(v) ? v : v ? [v] : [];
}

export function useIntegrations(activeSection: string) {
  const [activated, setActivated] = useState(() => new Set([activeSection]));

  useEffect(() => {
    setActivated((prev) => {
      if (prev.has(activeSection)) return prev;
      return new Set(prev).add(activeSection);
    });
  }, [activeSection]);

  const config = useQuery<RegisterDTO[]>({
    queryKey: ["integrations", "config"],
    queryFn: () => registerService.list().then(asArray),
    enabled: activated.has("config"),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });

  const desvios = useQuery<ByPassDTO[]>({
    queryKey: ["integrations", "desvios"],
    queryFn: () => bypassService.list().then(asArray),
    enabled: activated.has("desvios"),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });

  const jobs = useQuery<JobRunnerDTO[]>({
    queryKey: ["integrations", "jobs"],
    queryFn: () => jobRunnerService.list().then(asArray),
    enabled: activated.has("jobs"),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });

  const cnpjs = useQuery<CnpjRelationDTO[]>({
    queryKey: ["integrations", "cnpjs"],
    queryFn: () => cnpjRelationService.list().then(asArray),
    enabled: activated.has("cnpjs"),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });

  return { config, desvios, jobs, cnpjs };
}

export function useRefreshIntegrations() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["integrations"] });
}
