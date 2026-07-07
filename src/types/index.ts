export interface RegisterDTO {
  name: string;
  cnpj?: string | null;
  bucket_name?: string | null;
  payment_condition_queue?: string | null;
  aux_queue?: string | null;
  general_queue?: string | null;
  order_queue?: string | null;
  authentication_queue?: string | null;
  price_ingestion_queue?: string | null;
  pedpreco_order_queue?: string | null;
  pedpreco_invoice_queue?: string | null;
  job_runner_name?: string | null;
  use_protheus?: boolean;
}

export enum BypassFieldsEnum {
  URL_ACESSO = "URL_ACESSO",
  CODIGO_AUXILIAR = "CODIGO_AUXILIAR",
}

export interface ByPassDTO {
  name: string;
  base_config_name?: string | null;
  config_name: string;
  field: BypassFieldsEnum;
  comparator?: string;
  value: string;
  regexp_find?: string | null;
}

export interface JobRunnerDTO {
  name: string;
  task_definition_id: string;
  cluster: string;
  capacity_provider?: string;
  container_name: string;
  subnets: string;
  security_groups: string;
  assign_public_ip: boolean;
}

export interface CnpjRelationDTO {
  cnpj: string;
  parent_cnpj: string;
}
