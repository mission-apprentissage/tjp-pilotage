import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";

import { kdb } from "../../../../db/db";

export const findManyInDataFormationQuery = async ({
  search,
}: {
  search: string;
}) => {
  const cleanSearch = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

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
    // TO DO : concatenner tous les champs et gérer via tableau de mots
    .where((eb) =>
      eb.and([
        eb.or([
          eb(
            sql`unaccent(${eb.ref("dataFormation.cfd")})`,
            "ilike",
            `${cleanSearch}%`
          ),
          eb(
            sql`unaccent(${eb.ref("dataFormation.libelle")})`,
            "ilike",
            `%${cleanSearch}%`
          ),
          eb(
            sql`unaccent(${eb.ref("familleMetier.cfdFamille")})`,
            "ilike",
            `${cleanSearch}%`
          ),
          eb(
            sql`unaccent(${eb.ref("familleMetier.cfdSpecialite")})`,
            "ilike",
            `${cleanSearch}%`
          ),
          eb(
            sql`unaccent(${eb.ref("familleMetier.libelleOfficielFamille")})`,
            "ilike",
            `%${cleanSearch}%`
          ),
          eb(
            sql`unaccent(${eb.ref("familleMetier.libelleOfficielSpecialite")})`,
            "ilike",
            `%${cleanSearch}%`
          ),
        ]),
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
      "dataFormation.cfd as value",
      sql<string>`CONCAT(${eb.ref("dataFormation.libelle")},
      ' (',${eb.ref("niveauDiplome.libelleNiveauDiplome")},')')`.as("label"),
      sql<boolean>`${eb.ref("dataFormation.typeFamille")} = 'specialite'`.as(
        "isSpecialite"
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
