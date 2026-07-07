import { useState, useCallback } from "react";
import { bypassService } from "../services/bypass";
import type { ByPassDTO } from "../types";

export function useBypassList() {
  const [data, setData] = useState<ByPassDTO[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (config_name?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await bypassService.list(config_name);
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

export function useBypassMutation() {
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async (data: ByPassDTO) => {
    setLoading(true);
    try {
      const result = await bypassService.register(data);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading };
}
