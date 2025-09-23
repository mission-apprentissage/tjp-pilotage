import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import type { DB } from "@/db/db";
import { getDateRentreeScolaire } from "@/modules/data/services/getRentreeScolaire";

export const openForRentreeScolaire = (eb: ExpressionBuilder<DB, "formationView">, rentreeScolaire: string) => {
  return eb.and([
    eb("formationView.dateOuverture", "<=", sql<Date>`${getDateRentreeScolaire(rentreeScolaire)}`),
    eb.or([
      eb(sql<string>`date_part('year',${eb.ref("formationView.dateFermeture")})`, ">", rentreeScolaire),
      eb("formationView.dateFermeture", "is", null),
    ]),
  ]);
};

export const openForRentreeScolaireIndicateurEntree = (
  eb:ExpressionBuilder<DB, "formationView" | "indicateurEntree">
) => {
  return eb.and([
    eb("formationView.dateOuverture", "<=", sql<Date>`(${CURRENT_RENTREE} || '-09-01')::Date`),
    eb.or([
      eb(sql<number>`date_part('year',${eb.ref("formationView.dateFermeture")})`, ">", sql<number>`${CURRENT_RENTREE}::float`),
      eb("formationView.dateFermeture", "is", null),
    ]),
  ]);
};
