import { sql } from "kysely";
import { z } from "zod";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { searchNsfFormationSchema } from "./searchNsfFormation.schema";

export const findManyInDataFormationQuery = async ({
  search,
  filters,
}: {
  search: string;
  filters: z.infer<typeof searchNsfFormationSchema.querystring>;
}) => {
  const cleanSearch = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const search_array = cleanSearch.split(" ");

  const formations = await kdb
    .selectFrom("dataFormation")
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "dataFormation.codeNiveauDiplome"
    )
    .leftJoin("familleMetier", "dataFormation.cfd", "familleMetier.cfd")
    .where((eb) => sql`LEFT(${eb.ref("dataFormation.cfd")}, 1)`, "in", [
      "0",
      "3",
      "4",
      "5",
    ])
    .where((eb) => sql`LEFT(${eb.ref("dataFormation.cfd")}, 3)`, "not in", [
      "420",
      "430",
      "010",
    ])
    .where((eb) =>
      eb.and([
        eb.and(
          search_array.map((search_word) =>
            eb(
              sql`concat(
                  unaccent(${eb.ref("dataFormation.libelleFormation")}),
                  ' ',
                  unaccent(${eb.ref("dataFormation.cfd")}),
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
          eb("dataFormation.dateFermeture", "is", null),
          eb("dataFormation.dateFermeture", ">", sql<Date>`now()`),
        ]),
        eb.or([
          eb("dataFormation.typeFamille", "is", null),
          eb("dataFormation.typeFamille", "=", "specialite"),
          eb("dataFormation.typeFamille", "=", "option"),
        ]),
      ])
    )
    .$call((q) => {
      if (filters.codeNsf) {
        return q.where("dataFormation.codeNsf", "=", filters.codeNsf);
      }
      return q;
    })
    .select((eb) => [
      "dataFormation.cfd as value",
      sql<string>`CONCAT(${eb.ref("dataFormation.libelleFormation")},
      ' (',${eb.ref("niveauDiplome.libelleNiveauDiplome")},')')`.as("label"),
    ])
    .distinctOn([
      "dataFormation.cfd",
      "dataFormation.libelleFormation",
      "niveauDiplome.libelleNiveauDiplome",
    ])
    .orderBy(["dataFormation.libelleFormation asc"])
    .limit(20)
    .execute()
    .then(cleanNull);

  return formations;
};
