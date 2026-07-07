import { api } from "./api";
import type { JobRunnerDTO } from "../types";

export const jobRunnerService = {
  list(config_name?: string): Promise<JobRunnerDTO[]> {
    return api.get<JobRunnerDTO[]>("/job_runner/list", { config_name });
  },

  register(data: JobRunnerDTO): Promise<JobRunnerDTO> {
    return api.post<JobRunnerDTO>("/job_runner/register", data);
  },
};
