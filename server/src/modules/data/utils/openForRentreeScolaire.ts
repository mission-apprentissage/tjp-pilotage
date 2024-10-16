import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../../db/db";
import { getDateRentreeScolaire } from "../services/getRentreeScolaire";

export const openForRentreeScolaire = (
  eb: ExpressionBuilder<DB, "formationView">,
  rentreeScolaire: string
) => {
  return eb.and([
    eb(
      "formationView.dateOuverture",
      "<=",
      sql<Date>`${getDateRentreeScolaire(rentreeScolaire)}`
    ),
    eb.or([
      eb(
        sql<string>`date_part('year',${eb.ref("formationView.dateFermeture")})`,
        ">",
        rentreeScolaire
      ),
      eb("formationView.dateFermeture", "is", null),
    ]),
  ]);
};
