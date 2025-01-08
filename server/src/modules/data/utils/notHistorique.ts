import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";

import type { DB } from "@/db/db";
import { getDateRentreeScolaire } from "@/modules/data/services/getRentreeScolaire";

import { isScolaireFormationHistorique } from "./isScolaire";

export const notHistorique = (eb: ExpressionBuilder<DB, "formationEtablissement">) => {
  return eb(
    "formationEtablissement.cfd",
    "not in",
    eb.selectFrom("formationHistorique").distinct().select("ancienCFD").where(isScolaireFormationHistorique),
  );
};

export const notHistoriqueFormation = (eb: ExpressionBuilder<DB, "formationView">) => {
  return eb(
    "formationView.cfd",
    "not in",
    eb.selectFrom("formationHistorique").distinct().select("ancienCFD").where(isScolaireFormationHistorique),
  );
};

export const notHistoriqueIndicateurRegionSortie = (eb: ExpressionBuilder<DB, "indicateurRegionSortie">) => {
  return eb(
    "indicateurRegionSortie.cfd",
    "not in",
    eb.selectFrom("formationHistorique").distinct().select("ancienCFD").where(isScolaireFormationHistorique),
  );
};

export const isHistoriqueCoExistant = (eb: ExpressionBuilder<DB, "formationView">, rentreeScolaire: string) => {
  return sql<boolean>`${eb.and([
    eb(
      "formationView.cfd",
      "in",
      eb.selectFrom("formationHistorique").distinct().select("ancienCFD").where(isScolaireFormationHistorique),
    ),
    eb("formationView.dateFermeture", "is not", null),
    eb("formationView.dateFermeture", ">", sql<Date>`${getDateRentreeScolaire(rentreeScolaire)}`),
  ])}`;
};

export const notHistoriqueUnlessCoExistant = (eb: ExpressionBuilder<DB, "formationView">, rentreeScolaire: string) => {
  return eb.or([
    eb("formationView.dateFermeture", "is", null),
    eb("formationView.dateFermeture", ">", sql<Date>`${getDateRentreeScolaire(rentreeScolaire)}`),
  ]);
};

export const notHistoriqueUnlessCoExistantFormationEtablissement = (
  eb: ExpressionBuilder<DB, "formationEtablissement">,
  rentreeScolaire: string,
) => {
  return eb(
    "formationEtablissement.cfd",
    "not in",
    eb
      .selectFrom("formationScolaireView as formationView")
      .distinct()
      .select("cfd")
      .where((eb) =>
        eb.and([
          eb("formationView.dateFermeture", "is not", null),
          eb("formationView.dateFermeture", "<=", sql<Date>`${getDateRentreeScolaire(rentreeScolaire)}`),
        ]),
      ),
  );
};

export const notHistoriqueUnlessCoExistantIndicateurRegionSortie = (
  eb: ExpressionBuilder<DB, "indicateurRegionSortie">,
  rentreeScolaire: string,
) => {
  return eb(
    "indicateurRegionSortie.cfd",
    "not in",
    eb
      .selectFrom("formationScolaireView as formationView")
      .distinct()
      .select("cfd")
      .where((eb) =>
        eb.and([
          eb("formationView.dateFermeture", "is not", null),
          eb("formationView.dateFermeture", "<=", sql<Date>`${getDateRentreeScolaire(rentreeScolaire)}`),
        ]),
      ),
  );
};
