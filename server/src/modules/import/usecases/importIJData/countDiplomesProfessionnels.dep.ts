import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const countDiplomesProfessionnels = () => {
  return getKbdClient()
    .selectFrom("diplomeProfessionnel")
    .select(sb => sb.fn.countAll<number>().as("nbDiplomesProfessionnels"))
    .distinct()
    .executeTakeFirstOrThrow()
    .then(cleanNull);
};
