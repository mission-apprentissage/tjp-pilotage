import { ExpressionBuilder } from "kysely";

import { DB } from "../../../db/db";

export const notAnneeCommuneFormationEtablissement = (
  eb: ExpressionBuilder<DB, "formationEtablissement">
) => {
  return eb(
    "formationEtablissement.cfd",
    "not in",
    eb.selectFrom("familleMetier").distinct().select("cfdFamille")
  );
};
export const notAnneeCommune = (eb: ExpressionBuilder<DB, "formationView">) => {
  return eb.or([
    eb.and([
      eb("formationView.typeFamille", "<>", "2nde_commune"),
      eb("formationView.typeFamille", "<>", "1ere_commune"),
    ]),
    eb("formationView.typeFamille", "is", null),
  ]);
};

export const notAnneeCommuneIndicateurRegionSortie = (
  eb: ExpressionBuilder<DB, "indicateurRegionSortie">
) => {
  return eb(
    "indicateurRegionSortie.cfd",
    "not in",
    eb.selectFrom("familleMetier").distinct().select("cfdFamille")
  );
};

export const notSpecialite = (eb: ExpressionBuilder<DB, "formationView">) => {
  return eb.or([
    eb("formationView.typeFamille", "<>", "specialite"),
    eb("formationView.typeFamille", "is", null),
  ]);
};

export const notSpecialiteFormationEtablissement = (
  eb: ExpressionBuilder<DB, "formationEtablissement">
) => {
  return eb(
    "formationEtablissement.cfd",
    "not in",
    eb.selectFrom("familleMetier").distinct().select("cfdSpecialite")
  );
};

export const notSpecialiteIndicateurRegionSortie = (
  eb: ExpressionBuilder<DB, "indicateurRegionSortie">
) => {
  return eb(
    "indicateurRegionSortie.cfd",
    "not in",
    eb.selectFrom("familleMetier").distinct().select("cfdSpecialite")
  );
};
