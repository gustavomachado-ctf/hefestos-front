import { api } from "./api";
import type { RegisterDTO } from "../types";

export const registerService = {
  list(config_name?: string): Promise<RegisterDTO[]> {
    return api.get<RegisterDTO[]>("/integration/list", { config_name });
  },

  register(data: RegisterDTO): Promise<RegisterDTO> {
    return api.post<RegisterDTO>("/integration/register", data);
  },
};
