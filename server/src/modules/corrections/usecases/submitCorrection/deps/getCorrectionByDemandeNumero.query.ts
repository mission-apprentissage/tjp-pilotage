import { getKbdClient } from "@/db/db";

export const getCorrectionByDemandeNumeroQuery = async (demandeNumero: string) => {
  const correction = await getKbdClient()
    .selectFrom("correction")
    .selectAll()
    .where("demandeNumero", "=", demandeNumero)
    .limit(1)
    .executeTakeFirst();

  return correction;
};
