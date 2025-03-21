import { FIRST_ANNEE_CAMPAGNE } from "shared";

import { getKbdClient } from "@/db/db";

export const getRentreesPilotage = async () => getKbdClient()
  .selectFrom("indicateurEntree")
  .select("rentreeScolaire")
  .distinct()
  .where("rentreeScolaire", ">", FIRST_ANNEE_CAMPAGNE)
  .orderBy("rentreeScolaire", "desc")
  .execute()
  .then((rs) => rs.map(({rentreeScolaire}) => rentreeScolaire));
