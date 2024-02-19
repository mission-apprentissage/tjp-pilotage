import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { getDateRentreeScolaire } from "../../services/getRentreeScolaire";

export const findManyInDataEtablissementsQuery = async ({
  search,
  filtered,
  codeRegion,
}: {
  search: string;
  filtered?: boolean;
  codeRegion?: string;
}) => {
  const search_array = search.split(" ");

  const etablissements = await kdb
    .selectFrom("dataEtablissement")
    .select([
      "dataEtablissement.uai",
      "dataEtablissement.libelleEtablissement",
      "dataEtablissement.commune",
    ])
    .where((eb) =>
      eb.and([
        eb("dataEtablissement.typeUai", "in", [
          "CLG",
          "EREA",
          "EXP",
          "LP",
          "LYC",
          "SEP",
          "TSGE",
        ]),
        eb.or([
          eb("dataEtablissement.uai", "ilike", `${search}%`),
          eb.and(
            search_array.map((search_word) =>
              eb(
                sql`concat(unaccent(${eb.ref(
                  "dataEtablissement.libelleEtablissement"
                )}),
                  ' ',${eb.ref("dataEtablissement.commune")})`,
                "ilike",
                `%${search_word
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")}%`
              )
            )
          ),
        ]),
      ])
    )
    .$call((q) => {
      if (!codeRegion) return q;
      return q.where("dataEtablissement.codeRegion", "=", codeRegion);
    })
    .$call((q) => {
      if (!filtered) return q;
      return q
        .innerJoin("etablissement", (join) =>
          join
            .onRef("etablissement.UAI", "=", "dataEtablissement.uai")
            .on((on) =>
              on.or([
                on("etablissement.dateFermeture", "is", null),
                on(
                  "etablissement.dateFermeture",
                  ">",
                  sql<Date>`${getDateRentreeScolaire(CURRENT_RENTREE)}`
                ),
              ])
            )
        )
        .innerJoin(
          "formationEtablissement",
          "formationEtablissement.UAI",
          "etablissement.UAI"
        );
    })
    .limit(20)
    .execute();

  return etablissements.map(cleanNull);
};
