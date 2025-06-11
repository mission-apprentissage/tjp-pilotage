import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import { getKbdClient } from "@/db/db";
import { getDateRentreeScolaire } from "@/modules/data/services/getRentreeScolaire";
import { getNormalizedSearchArray } from "@/modules/utils/searchHelpers";
import { cleanNull } from "@/utils/noNull";

export const searchEtablissementQuery = async ({
  search,
  isFormulaire = false,
  filtered,
  codeRegion,
}: {
  search: string;
  isFormulaire?: boolean;
  filtered?: boolean;
  codeRegion?: string;
}) => {
  const search_array = getNormalizedSearchArray(search);

  const etablissements = await getKbdClient()
    .selectFrom("dataEtablissement")
    .select(["dataEtablissement.uai", "dataEtablissement.libelleEtablissement", "dataEtablissement.commune"])
    .distinct()
    .where((eb) =>
      eb.and([
        eb.or([
          eb("dataEtablissement.uai", "ilike", `${search}%`),
          eb.and(
            search_array.map((search_word) =>
              eb(
                sql`concat(unaccent(${eb.ref("dataEtablissement.libelleEtablissement")}),
                  ' ',${eb.ref("dataEtablissement.commune")})`,
                "ilike",
                `%${search_word}%`
              )
            )
          ),
        ]),
      ])
    )
    .$call((q) => {
      if(isFormulaire) return q.where("dataEtablissement.typeUai", "in", ["CLG", "EREA", "LP", "LYC"]);
      return q.where("dataEtablissement.typeUai", "in", ["CLG", "EREA", "EXP", "LP", "LYC", "SEP", "TSGE"]);
    })
    .$call((q) => {
      if (!codeRegion) return q;
      return q.where("dataEtablissement.codeRegion", "=", codeRegion);
    })
    .$call((q) => {
      if (!filtered) return q;
      return q
        .innerJoin("etablissement", (join) =>
          join
            .onRef("etablissement.uai", "=", "dataEtablissement.uai")
            .on((on) =>
              on.or([
                on("etablissement.dateFermeture", "is", null),
                on("etablissement.dateFermeture", ">", sql<Date>`${getDateRentreeScolaire(CURRENT_RENTREE)}`),
              ])
            )
        )
        .innerJoin("formationEtablissement", "formationEtablissement.uai", "etablissement.uai");
    })
    .limit(20)
    .execute();

  return etablissements.map(cleanNull);
};
