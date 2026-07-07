import { useState, useCallback } from "react";
import { registerService } from "../services/register";
import type { RegisterDTO } from "../types";

export function useRegisterList() {
  const [data, setData] = useState<RegisterDTO[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (config_name?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await registerService.list(config_name);
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

export function useRegisterMutation() {
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async (data: RegisterDTO) => {
    setLoading(true);
    try {
      const result = await registerService.register(data);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading };
}
