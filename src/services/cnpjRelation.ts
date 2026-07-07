import { api } from "./api";
import type { CnpjRelationDTO } from "../types";

export const cnpjRelationService = {
  list(supplier_cnpj?: string): Promise<CnpjRelationDTO[]> {
    return api.get<CnpjRelationDTO[]>("/cnpj_relation/list", { supplier_cnpj });
  },

  register(data: CnpjRelationDTO): Promise<CnpjRelationDTO> {
    return api.post<CnpjRelationDTO>("/cnpj_relation/register", data);
  },
};
