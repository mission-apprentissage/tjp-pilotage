import { ANNEE_CHOMAGE } from "shared";

import { getKbdClient } from "@/db/db";

export const getTauxChomage = async () => {
  const result = await getKbdClient()
    .selectFrom("indicateurRegion")
    .where("indicateurRegion.rentreeScolaire", "=", ANNEE_CHOMAGE)
    .select(sb => sb.fn.avg("tauxChomage").as("tauxChomage"))
    .executeTakeFirstOrThrow();


  return result.tauxChomage ? Number(result.tauxChomage) / 100 : undefined;
};
