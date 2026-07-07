import { toast } from "sonner";

export function useApiToast() {
  function success(msg: string) {
    toast.success(msg);
  }

  function error(err: unknown) {
    const message =
      err instanceof Error ? err.message : "Erro inesperado";
    toast.error(message);
  }

  return { success, error };
}
