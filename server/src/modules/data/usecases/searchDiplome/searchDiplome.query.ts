import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { getNormalizedSearchArray } from "../../../utils/normalizeSearch";

export const searchDiplomeQuery = async ({ search }: { search: string }) => {
  const search_array = getNormalizedSearchArray(search);

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
              `%${search_word}%`
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
    .select((eb) =>
      jsonArrayFrom(
        eb
          .selectFrom("dispositif")
          .select(["libelleDispositif", "codeDispositif"])
          .leftJoin("rawData", (join) =>
            join
              .onRef(
                sql`"data"->>'DISPOSITIF_FORMATION'`,
                "=",
                "dispositif.codeDispositif"
              )
              .on("rawData.type", "=", "nMef")
          )
          .whereRef(sql`"data"->>'FORMATION_DIPLOME'`, "=", "dataFormation.cfd")
          .distinctOn("codeDispositif")
      ).as("dispositifs")
    )
    .select((eb) => [
      "dataFormation.cfd as value",
      sql<string>`CONCAT(${eb.ref("dataFormation.libelleFormation")},
      ' (',${eb.ref("niveauDiplome.libelleNiveauDiplome")},')',
      ' (',${eb.ref("dataFormation.cfd")},')')`.as("label"),
      sql<boolean>`${eb.ref("dataFormation.typeFamille")} = 'specialite'`.as(
        "isSpecialite"
      ),
      sql<boolean>`${eb.ref("dataFormation.typeFamille")} = 'option'`.as(
        "isOption"
      ),
      sql<boolean>`${eb.ref("dataFormation.typeFamille")} = '1ere_commune'`.as(
        "is1ereCommune"
      ),
      sql<boolean>`${eb.ref("dataFormation.typeFamille")} = '2nde_commune'`.as(
        "is2ndeCommune"
      ),
      sql<boolean>`${eb("dataFormation.codeNiveauDiplome", "in", [
        "381",
        "481",
        "581",
      ])}`.as("isFCIL"),
      "dataFormation.libelleFormation",
      "niveauDiplome.libelleNiveauDiplome",
      "dataFormation.cfd",
      sql<string | null>`
        case when ${eb.ref("dataFormation.dateFermeture")} is not null
        then to_char(${eb.ref("dataFormation.dateFermeture")}, 'dd/mm/yyyy')
        else null
        end
      `.as("dateFermeture"),
    ])
    .distinctOn([
      "dataFormation.cfd",
      "dataFormation.libelleFormation",
      "niveauDiplome.libelleNiveauDiplome",
    ])
    .orderBy([
      "niveauDiplome.libelleNiveauDiplome",
      "dataFormation.libelleFormation asc",
    ])
    .limit(20)
    .execute()
    .then(cleanNull);

  return formations;
};
