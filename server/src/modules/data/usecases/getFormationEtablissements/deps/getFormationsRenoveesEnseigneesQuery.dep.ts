import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import { getKbdClient } from "@/db/db";
import { getDateRentreeScolaire } from "@/modules/data/services/getRentreeScolaire";
import { isScolaireFormationHistorique } from "@/modules/data/utils/isScolaire";

export const getFormationsRenoveesEnseigneesQuery = async ({
  rentreeScolaire = [CURRENT_RENTREE],
}: {
  rentreeScolaire?: string[];
}) => {
  return await getKbdClient()
    .selectFrom("formationHistorique")
    .leftJoin("formationScolaireView as formationView", "formationView.cfd", "formationHistorique.cfd")
    .innerJoin("formationEtablissement", (join) =>
      join
        .onRef("formationEtablissement.cfd", "=", "formationView.cfd")
        .onRef("formationEtablissement.voie", "=", "formationView.voie")
    )
    .where("formationView.dateOuverture", "<=", sql<Date>`${getDateRentreeScolaire(rentreeScolaire[0])}`)
    .select("formationHistorique.cfd")
    .where(isScolaireFormationHistorique)
    .distinct()
    .execute()
    .then((res) => res.map((r) => r.cfd));
};
