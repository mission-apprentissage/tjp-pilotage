import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import { getKbdClient } from "@/db/db";
import type { NsfOption } from "@/modules/data/usecases/getDomainesDeFormation/getDomainesDeFormation.schema";
import { openForRentreeScolaire } from "@/modules/data/utils/openForRentreeScolaire";
import { getNormalizedSearchArray } from "@/modules/utils/normalizeSearch";
import { cleanNull } from "@/utils/noNull";

export const getNsfsAndFormations = async (search?: string) => {
  let baseQuery = getKbdClient()
    .selectFrom("formationView")
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
          searchArray.map((search_word) => w(sql`unaccent(${w.ref("nsf.libelleNsf")})`, "ilike", `%${search_word}%`))
        )
      )
      .union(
        getKbdClient()
          .selectFrom("formationView")
          .leftJoin("nsf", "nsf.codeNsf", "formationView.codeNsf")
          .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
          .where("nsf.libelleNsf", "is not", null)
          .select((sb) => [
            sql<string>`concat( ${sb.ref(
              "niveauDiplome.libelleNiveauDiplome"
            )}, ' - ', ${sb.ref("formationView.libelleFormation")})`.as("label"),
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

  return baseQuery.orderBy("label", "asc").distinct().$castTo<NsfOption>().execute().then(cleanNull);
};
