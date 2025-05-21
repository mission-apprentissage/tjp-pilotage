import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import { getKbdClient } from "@/db/db";
import { getDateRentreeScolaire } from "@/modules/data/services/getRentreeScolaire";
import { isScolaireFormationHistorique } from "@/modules/data/utils/isScolaire";

export const getFormationsScolairesRenoveesQuery = async ({
  rentreeScolaire = [CURRENT_RENTREE],
}: {
  rentreeScolaire?: string[];
}) => {
  return await getKbdClient()
    .selectFrom("formationHistorique")
    .leftJoin("formationView", "formationView.cfd", "formationHistorique.cfd")
    .where("formationView.dateOuverture", "<=", sql<Date>`${getDateRentreeScolaire(rentreeScolaire[0])}`)
    .select("formationHistorique.cfd")
    .where(isScolaireFormationHistorique)
    .distinct()
    .execute()
    .then((res) => res.map((r) => r.cfd));
};
