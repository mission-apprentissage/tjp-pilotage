import { getKbdClient } from "@/db/db";

export const countFamillesMetiers = () => {
  return getKbdClient()
    .selectFrom("familleMetier")
    .select(sb => sb.fn.countAll<number>().as("nbFamillesMetiers"))
    .distinct()
    .executeTakeFirstOrThrow();
};
