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
    .innerJoin("formationEtablissement", "formationEtablissement.cfd", "formationHistorique.cfd")
    // @ts-expect-error
    .leftJoin("formationScolaireView as formationView", "formationView.cfd", "formationHistorique.cfd")
    // @ts-expect-error
    .where("formationView.dateOuverture", "<=", sql<Date>`${getDateRentreeScolaire(rentreeScolaire[0])}`)
    .select("formationHistorique.cfd")
    .where(isScolaireFormationHistorique)
    .distinct()
    .execute()
    // @ts-expect-error
    .then((res) => res.map((r) => r.cfd));
};

export const getFormationsRenoveesRentreeScolaireQuery = async ({
  rentreeScolaire = [CURRENT_RENTREE],
}: {
  rentreeScolaire?: string[];
}) => {
  return await getKbdClient()
    .selectFrom("formationHistorique")
    // @ts-expect-error
    .leftJoin("formationView", "formationView.cfd", "formationHistorique.cfd")
    // @ts-expect-error
    .where("formationView.dateOuverture", "<=", sql<Date>`${getDateRentreeScolaire(rentreeScolaire[0])}`)
    .select("formationHistorique.cfd")
    .where(isScolaireFormationHistorique)
    .distinct()
    .execute()
    // @ts-expect-error
    .then((res) => res.map((r) => r.cfd));
};
