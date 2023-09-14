import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findManyInDataEtablissementsQuery = async ({
  search,
}: {
  search: string;
}) => {
  const search_array = search.split(" ");

  const etablissements = await kdb
    .selectFrom("dataEtablissement")
    .select([
      "dataEtablissement.uai",
      "dataEtablissement.libelle",
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
                sql`concat(${eb.ref("dataEtablissement.libelle")},' ',${eb.ref(
                  "dataEtablissement.commune"
                )})`,
                "ilike",
                `%${search_word}%`
              )
            )
          ),
        ]),
      ])
    )
    .limit(20)
    .execute();

  return etablissements.map(cleanNull);
};
