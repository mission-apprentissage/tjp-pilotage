import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findManyInDataFormationQuery = async ({
  search,
}: {
  search: string;
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
    .leftJoin(
      "familleMetier",
      "dataFormation.cfd",
      "familleMetier.cfdSpecialite"
    )
    // .where("dataFormation.cfd", "not in", ["48120001", "48130001"])
    .where((eb) => sql`LEFT(${eb.ref("dataFormation.cfd")}, 3)`, "not in", [
      "420",
      "430",
    ])
    .where((eb) =>
      eb.and([
        eb.and(
          search_array.map((search_word) =>
            eb(
              sql`concat(
                  unaccent(${eb.ref("dataFormation.libelle")}),
                  ' ',
                  unaccent(${eb.ref("dataFormation.cfd")}),
                  ' ',
                  unaccent(${eb.ref("niveauDiplome.libelleNiveauDiplome")}),
                  ' ',
                  unaccent(${eb.ref("familleMetier.cfdFamille")}),
                  ' ',
                  unaccent(${eb.ref("familleMetier.cfdSpecialite")}),
                  ' ',
                  unaccent(${eb.ref("familleMetier.libelleOfficielFamille")}),
                  ' ',
                  unaccent(${eb.ref("familleMetier.libelleOfficielSpecialite")})
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
      sql`LEFT(${"dataFormation.cfd"}, 3)`.as("toto"),
      "dataFormation.cfd as value",
      sql<string>`CONCAT(${eb.ref("dataFormation.libelle")},
      ' (',${eb.ref("niveauDiplome.libelleNiveauDiplome")},')',
      ' (',${eb.ref("dataFormation.cfd")},')')`.as("label"),
      sql<boolean>`${eb.ref("dataFormation.typeFamille")} = 'specialite'`.as(
        "isSpecialite"
      ),
      sql<boolean>`${eb("dataFormation.codeNiveauDiplome", "in", [
        "381",
        "481",
        "581",
      ])}`.as("isFCIL"),
      sql<string | null>`
        case when ${eb.ref("dataFormation.dateFermeture")} is not null
        then to_char(${eb.ref("dataFormation.dateFermeture")}, 'dd/mm/yyyy')
        else null
        end
      `.as("dateFermeture"),
    ])
    .distinctOn("dataFormation.cfd")
    .limit(20)
    .execute()
    .then(cleanNull);

  console.log(formations[0].toto);

  return formations;
};
