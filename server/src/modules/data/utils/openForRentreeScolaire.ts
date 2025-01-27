import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";

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
    eb("formationView.dateOuverture", "<=", sql<Date>`(${eb.ref("indicateurEntree.rentreeScolaire")} || '-09-01')::Date`),
    eb.or([
      eb(sql<number>`date_part('year',${eb.ref("formationView.dateFermeture")})`, ">", sql<number>`${eb.ref("indicateurEntree.rentreeScolaire")}::float`),
      eb("formationView.dateFermeture", "is", null),
    ]),
  ]);
};
