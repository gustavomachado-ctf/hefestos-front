import { api } from "./api";
import type { ByPassDTO } from "../types";

export const bypassService = {
  list(config_name?: string): Promise<ByPassDTO[]> {
    return api.get<ByPassDTO[]>("/bypass/list", { config_name });
  },

  register(data: ByPassDTO): Promise<ByPassDTO> {
    return api.post<ByPassDTO>("/bypass/register", data);
  },
};
