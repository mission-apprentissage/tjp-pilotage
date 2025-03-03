import type { ExpressionBuilder } from "kysely";
import { TypeFamilleEnum } from "shared/enum/typeFamilleEnum";

import type { DB } from "@/db/db";

export const notAnneeCommuneFormationEtablissement = (eb: ExpressionBuilder<DB, "formationEtablissement">) => {
  return eb("formationEtablissement.cfd", "not in", eb.selectFrom("familleMetier").distinct().select("cfdFamille"));
};
export const notAnneeCommune = (eb: ExpressionBuilder<DB, "formationView">) => {
  return eb.or([
    eb("formationView.typeFamille", "not in", [TypeFamilleEnum["1ere_commune"], TypeFamilleEnum["2nde_commune"]]),
    eb("formationView.typeFamille", "is", null),
  ]);
};

export const notAnneeCommuneIndicateurRegionSortie = (eb: ExpressionBuilder<DB, "indicateurRegionSortie">) => {
  return eb("indicateurRegionSortie.cfd", "not in", eb.selectFrom("familleMetier").distinct().select("cfdFamille"));
};

export const notSpecialite = (eb: ExpressionBuilder<DB, "formationView">) => {
  return eb.or([
    eb("formationView.typeFamille", "not in", [TypeFamilleEnum["specialite"], TypeFamilleEnum["option"]]),
    eb("formationView.typeFamille", "is", null),
  ]);
};

export const notSpecialiteFormationEtablissement = (eb: ExpressionBuilder<DB, "formationEtablissement">) => {
  return eb("formationEtablissement.cfd", "not in", eb.selectFrom("familleMetier").distinct().select("cfd"));
};

export const notSpecialiteIndicateurRegionSortie = (eb: ExpressionBuilder<DB, "indicateurRegionSortie">) => {
  return eb("indicateurRegionSortie.cfd", "not in", eb.selectFrom("familleMetier").distinct().select("cfd"));
};
