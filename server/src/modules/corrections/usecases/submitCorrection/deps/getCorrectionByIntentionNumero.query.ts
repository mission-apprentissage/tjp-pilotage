import { getKbdClient } from "@/db/db";

export const getCorrectionByIntentionNumeroQuery = async (intentionNumero: string) => {
  const correction = await getKbdClient()
    .selectFrom("correction")
    .selectAll()
    .where("intentionNumero", "=", intentionNumero)
    .limit(1)
    .executeTakeFirst();

  return correction;
};
