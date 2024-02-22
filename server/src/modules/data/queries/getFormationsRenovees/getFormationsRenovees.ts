import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import { kdb } from "../../../../db/db";
import { getDateRentreeScolaire } from "../../services/getRentreeScolaire";
import { isScolaireFormationHistorique } from "../../utils/isScolaire";

export const getFormationsRenoveesEnseignees = async ({
  rentreeScolaire = [CURRENT_RENTREE],
}: {
  rentreeScolaire?: string[];
}) => {
  return await kdb
    .selectFrom("formationHistorique")
    .innerJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formationHistorique.cfd"
    )
    .leftJoin(
      "formationScolaireView as formationView",
      "formationView.cfd",
      "formationHistorique.cfd"
    )
    .where(
      "formationView.dateOuverture",
      "<=",
      sql<Date>`${getDateRentreeScolaire(rentreeScolaire[0])}`
    )
    .select("formationHistorique.cfd")
    .where(isScolaireFormationHistorique)
    .distinct()
    .execute()
    .then((res) => res.map((r) => r.cfd));
};

export const getFormationsRenoveesRentreeScolaire = async ({
  rentreeScolaire = [CURRENT_RENTREE],
}: {
  rentreeScolaire?: string[];
}) => {
  return await kdb
    .selectFrom("formationHistorique")
    .leftJoin("formationView", "formationView.cfd", "formationHistorique.cfd")
    .where(
      "formationView.dateOuverture",
      "<=",
      sql<Date>`${getDateRentreeScolaire(rentreeScolaire[0])}`
    )
    .select("formationHistorique.cfd")
    .where(isScolaireFormationHistorique)
    .distinct()
    .execute()
    .then((res) => res.map((r) => r.cfd));
};
