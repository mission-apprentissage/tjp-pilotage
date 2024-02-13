import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import { kdb } from "../../../../db/db";
import { getDateRentreeScolaire } from "../../services/getRentreeScolaire";

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
      "formationHistorique.codeFormationDiplome"
    )
    .leftJoin(
      "formationView",
      "formationView.cfd",
      "formationHistorique.codeFormationDiplome"
    )
    .where(
      "formationView.dateOuverture",
      "<=",
      sql<Date>`${getDateRentreeScolaire(rentreeScolaire[0])}`
    )
    .select("formationHistorique.codeFormationDiplome")
    .distinct()
    .execute()
    .then((res) => res.map((r) => r.codeFormationDiplome));
};

export const getFormationsRenoveesRentreeScolaire = async ({
  rentreeScolaire = [CURRENT_RENTREE],
}: {
  rentreeScolaire?: string[];
}) => {
  return await kdb
    .selectFrom("formationHistorique")
    .leftJoin(
      "formationView",
      "formationView.cfd",
      "formationHistorique.codeFormationDiplome"
    )
    .where(
      "formationView.dateOuverture",
      "<=",
      sql<Date>`${getDateRentreeScolaire(rentreeScolaire[0])}`
    )
    .select("formationHistorique.codeFormationDiplome")
    .distinct()
    .execute()
    .then((res) => res.map((r) => r.codeFormationDiplome));
};
