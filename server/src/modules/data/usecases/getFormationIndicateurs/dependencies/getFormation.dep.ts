import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";
import { getDateRentreeScolaire } from "shared/utils/getRentreeScolaire";

import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const getFormation = async ({ cfd }: { cfd: string }) => {
  return getKbdClient()
    .selectFrom("formationView")
    .innerJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
    .innerJoin("nsf", "nsf.codeNsf", "formationView.codeNsf")
    .select(["formationView.libelleFormation", "formationView.cfd"])
    .where((eb) =>
      eb.or([
        eb("dateFermeture", "is", null),
        eb("dateFermeture", ">", sql<Date>`${getDateRentreeScolaire(CURRENT_RENTREE)}`),
      ])
    )
    .where("formationView.cfd", "=", cfd)
    .select((sb) => [sb.ref("formationView.libelleFormation").as("libelle"), sb.ref("formationView.cfd").as("cfd")])
    .executeTakeFirst()
    .then(cleanNull);
};
