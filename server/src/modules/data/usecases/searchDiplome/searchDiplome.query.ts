import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import type { searchDiplomeSchema } from "shared/routes/schemas/get.diplome.search.search.schema";
import type { z } from "zod";

import { getKbdClient } from "@/db/db";
import { getNormalizedSearchArray } from "@/modules/utils/normalizeSearch";
import { cleanNull } from "@/utils/noNull";

export const findManyInDataFormationQuery = async ({
  search,
  filters,
}: {
  search: string;
  filters: z.infer<typeof searchDiplomeSchema.querystring>;
}) => {
  const search_array = getNormalizedSearchArray(search);

  const formations = await getKbdClient()
    .selectFrom("dataFormation")
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "dataFormation.codeNiveauDiplome")
    .leftJoin("familleMetier", "dataFormation.cfd", "familleMetier.cfd")
    .innerJoin("dispositif", "dispositif.codeNiveauDiplome", "niveauDiplome.codeNiveauDiplome")
    .where((eb) => sql`LEFT(${eb.ref("dataFormation.cfd")}, 3)`, "in", [
      "320", // BTS
      "381", // FCIL
      "400", // BAC PRO
      "450", // BP
      "461", // MC
      "481", // FCIL
      "500", // CAP
      "561", // MC
      "581", // FCIL
      "241", // DNMADE
      "401", // BMA
    ])
    // exlcusion des CFD d'années communes en CAP et BAC PRO (40030002, 40020005, 50020006, 50030001)
    .where("dataFormation.cfd", "not in", ["40030002", "40020005", "50020006", "50030001"])
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
              `%${search_word}%`,
            ),
          ),
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
      ]),
    )
    .$call((q) => {
      if (filters.codeNsf) {
        return q.where("dataFormation.codeNsf", "=", filters.codeNsf);
      }
      return q;
    })
    .select((eb) =>
      eb
        .case()
        .when("dataFormation.codeNiveauDiplome", "in", [
          "450", // BP]
        ])
        .then(
          jsonArrayFrom(
            eb
              .selectFrom("dispositif")
              .select(["libelleDispositif", "codeDispositif"])
              .whereRef("dispositif.codeNiveauDiplome", "=", "dataFormation.codeNiveauDiplome")
              .distinctOn("codeDispositif"),
          ),
        )
        .else(
          jsonArrayFrom(
            eb
              .selectFrom("dispositif")
              .select(["libelleDispositif", "codeDispositif"])
              .leftJoin("rawData", (join) =>
                join
                  .onRef(sql`"data"->>'DISPOSITIF_FORMATION'`, "=", "dispositif.codeDispositif")
                  .on("rawData.type", "=", "nMef"),
              )
              .whereRef(sql`"data"->>'FORMATION_DIPLOME'`, "=", "dataFormation.cfd")
              .distinctOn("codeDispositif"),
          ),
        )
        .end()
        .as("dispositifs"),
    )
    .select((eb) => [
      "dataFormation.cfd as value",
      sql<string>`CONCAT(${eb.ref("dataFormation.libelleFormation")},
      ' (',${eb.ref("niveauDiplome.libelleNiveauDiplome")},')',
      ' (',${eb.ref("dataFormation.cfd")},')')`.as("label"),
      sql<boolean>`${eb.ref("dataFormation.typeFamille")} = 'specialite'`.as("isSpecialite"),
      sql<boolean>`${eb.ref("dataFormation.typeFamille")} = 'option'`.as("isOption"),
      sql<boolean>`${eb.ref("dataFormation.typeFamille")} = '1ere_commune'`.as("is1ereCommune"),
      sql<boolean>`${eb.ref("dataFormation.typeFamille")} = '2nde_commune'`.as("is2ndeCommune"),
      sql<boolean>`${eb("dataFormation.codeNiveauDiplome", "in", ["381", "481", "581"])}`.as("isFCIL"),
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
    .distinctOn(["dataFormation.cfd", "dataFormation.libelleFormation", "niveauDiplome.libelleNiveauDiplome"])
    .orderBy(["niveauDiplome.libelleNiveauDiplome", "dataFormation.libelleFormation asc"])
    .limit(20)
    .execute()
    .then(cleanNull);

  return formations;
};
