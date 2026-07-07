import { useState, useCallback } from "react";
import { cnpjRelationService } from "../services/cnpjRelation";
import type { CnpjRelationDTO } from "../types";

export function useCnpjRelationList() {
  const [data, setData] = useState<CnpjRelationDTO[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (supplier_cnpj?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cnpjRelationService.list(supplier_cnpj);
      setData(result);
    } catch (err) {
      setError((err as Error).message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetch };
}

export function useCnpjRelationMutation() {
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async (data: CnpjRelationDTO) => {
    setLoading(true);
    try {
      const result = await cnpjRelationService.register(data);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading };
}
