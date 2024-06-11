import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";
import { getDateRentreeScolaire } from "shared/utils/getRentreeScolaire";
import { z } from "zod";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { openForRentreeScolaire } from "../../utils/openForRentreeScolaire";
import { searchNsfFormationSchema } from "./searchNsfFormation.schema";

export const findManyInDataFormationQuery = async ({
  search,
  filters,
}: {
  search: string;
  filters: z.infer<typeof searchNsfFormationSchema.querystring>;
}) => {
  console.log(getDateRentreeScolaire(CURRENT_RENTREE));
  const cleanSearch = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const search_array = cleanSearch.split(" ");

  const formations = await kdb
    .selectFrom("formationView")
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formationView.codeNiveauDiplome"
    )
    .leftJoin("familleMetier", "formationView.cfd", "familleMetier.cfd")
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formationView.cfd"
    )
    .where((eb) =>
      eb.and([
        eb.and(
          search_array.map((search_word) =>
            eb(
              sql`concat(
                  unaccent(${eb.ref("formationView.libelleFormation")}),
                  ' ',
                  unaccent(${eb.ref("formationView.cfd")}),
                  ' ',
                  unaccent(${eb.ref("niveauDiplome.libelleNiveauDiplome")}),
                  ' ',
                  unaccent(${eb.ref("familleMetier.cfdFamille")}),
                  ' ',
                  unaccent(${eb.ref("familleMetier.cfd")}),
                  ' ',
                  unaccent(${eb.ref("familleMetier.libelleFamille")})
                )`,
              "ilike",
              `%${search_word
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")}%`
            )
          )
        ),
        eb.or([
          eb("formationView.typeFamille", "is", null),
          eb("formationView.typeFamille", "=", "specialite"),
          eb("formationView.typeFamille", "=", "option"),
        ]),
      ])
    )
    .$call((q) => {
      if (filters.codeNsf) {
        return q.where("formationView.codeNsf", "=", filters.codeNsf);
      }
      return q;
    })
    .select((eb) => [
      "formationView.cfd",
      "formationView.libelleFormation",
      "niveauDiplome.libelleNiveauDiplome",
      eb.fn
        .agg<string[]>("array_agg", ["formationEtablissement.voie"])
        .as("voies"),
      sql<string | null>`
        case when ${eb.ref("formationView.dateFermeture")} is not null
        then to_char(${eb.ref("formationView.dateFermeture")}, 'dd/mm/yyyy')
        else null
        end
      `.as("dateFermeture"),
    ])
    .distinctOn([
      "formationView.cfd",
      "formationView.libelleFormation",
      "niveauDiplome.libelleNiveauDiplome",
    ])
    .groupBy([
      "formationView.cfd",
      "formationView.libelleFormation",
      "niveauDiplome.libelleNiveauDiplome",
      "formationView.dateFermeture",
    ])
    .where((eb) => openForRentreeScolaire(eb, CURRENT_RENTREE))
    .orderBy(["formationView.libelleFormation asc"])
    .limit(20)
    .execute()
    .then(cleanNull);

  return formations;
};
