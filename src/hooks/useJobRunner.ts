import { useState, useCallback } from "react";
import { jobRunnerService } from "../services/jobRunner";
import type { JobRunnerDTO } from "../types";

export function useJobRunnerList() {
  const [data, setData] = useState<JobRunnerDTO[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (config_name?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await jobRunnerService.list(config_name);
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

export function useJobRunnerMutation() {
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async (data: JobRunnerDTO) => {
    setLoading(true);
    try {
      const result = await jobRunnerService.register(data);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading };
}
