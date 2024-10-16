import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { getNormalizedSearchArray } from "../../../../utils/normalizeSearch";
import { openForRentreeScolaire } from "../../../utils/openForRentreeScolaire";
import { NsfOption } from "../getDomainesDeFormation.schema";

export const getNsfsAndFormations = (search?: string) => {
  let baseQuery = kdb
    .selectFrom("formationScolaireView as formationView")
    .leftJoin("nsf", "nsf.codeNsf", "formationView.codeNsf")
    .select((sb) => [
      sb.ref("nsf.libelleNsf").as("label"),
      sb.ref("formationView.codeNsf").as("value"),
      sb.ref("nsf.codeNsf").as("nsf"),
      sb.val("nsf").as("type"),
    ])
    .where("nsf.libelleNsf", "is not", null)
    .where((eb) => openForRentreeScolaire(eb, CURRENT_RENTREE));

  if (search) {
    const searchArray = getNormalizedSearchArray(search);

    baseQuery = baseQuery
      .where((w) =>
        w.and(
          searchArray.map((search_word) =>
            w(
              sql`unaccent(${w.ref("nsf.libelleNsf")})`,
              "ilike",
              `%${search_word}%`
            )
          )
        )
      )
      .union(
        kdb
          .selectFrom("formationScolaireView as formationView")
          .leftJoin("nsf", "nsf.codeNsf", "formationView.codeNsf")
          .where("nsf.libelleNsf", "is not", null)
          .select((sb) => [
            sb.ref("formationView.libelleFormation").as("label"),
            sb.ref("formationView.cfd").as("value"),
            sb.ref("nsf.codeNsf").as("nsf"),
            sb.val("formation").as("type"),
          ])
          .where((w) =>
            w.and(
              searchArray.map((search_word) =>
                w(
                  sql`concat(
                    unaccent(${w.ref("formationView.libelleFormation")}),
                    ' ',
                    unaccent(${w.ref("formationView.cfd")})
                  )`,
                  "ilike",
                  `%${search_word}%`
                )
              )
            )
          )
      );
  }

  return baseQuery
    .orderBy("label", "asc")
    .distinct()
    .$castTo<NsfOption>()
    .execute()
    .then(cleanNull);
};
