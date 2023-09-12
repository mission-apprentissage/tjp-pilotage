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
        eb.or([
          eb("dataEtablissement.typeUai", "=", "CLG"),
          eb("dataEtablissement.typeUai", "=", "EREA"),
          eb("dataEtablissement.typeUai", "=", "EXP"),
          eb("dataEtablissement.typeUai", "=", "LP"),
          eb("dataEtablissement.typeUai", "=", "LYC"),
          eb("dataEtablissement.typeUai", "=", "SEP"),
          eb("dataEtablissement.typeUai", "=", "TSGE"),
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
