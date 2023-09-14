import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";

import { kdb } from "../../../../db/db";

export const findManyInDataFormationQuery = async ({
  search,
}: {
  search: string;
}) => {
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
    .where((eb) =>
      eb.and([
        eb.or([
          eb("dataFormation.cfd", "ilike", `${search}%`),
          eb("dataFormation.libelle", "ilike", `%${search}%`),
          eb("familleMetier.cfdFamille", "ilike", `${search}%`),
          eb("familleMetier.cfdSpecialite", "ilike", `${search}%`),
          eb("familleMetier.libelleOfficielFamille", "ilike", `%${search}%`),
          eb("familleMetier.libelleOfficielSpecialite", "ilike", `%${search}%`),
        ]),
        eb.or([
          eb("dataFormation.dateFermeture", "is", null),
          eb("dataFormation.dateFermeture", ">", sql<Date>`now()`),
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
      sql<string>`CONCAT(${eb.ref("dataFormation.libelle")},
      ' (',${eb.ref("niveauDiplome.libelleNiveauDiplome")},')')`.as("label"),
      sql<boolean>`${eb.ref("dataFormation.typeFamille")} is not null`.as(
        "isFamille"
      ),
      sql<boolean>`${eb.ref("dataFormation.typeFamille")} = '2nde_commune'`.as(
        "isSecondeCommune"
      ),
      sql<string>`
        case when ${eb.ref("dataFormation.dateFermeture")} is not null
        then to_char(${eb.ref("dataFormation.dateFermeture")}, 'dd/mm/yyyy')
        else null
        end
      `.as("dateFermeture"),
    ])
    .distinctOn("dataFormation.cfd")
    .limit(20)
    .execute();

  return formations;
};
