import { ExpressionBuilder, sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";
import { cleanNull } from "../../../../utils/noNull";
import { selectTauxInsertion12moisAgg } from "../utils/tauxInsertion12mois";
import { selectTauxPoursuiteAgg } from "../utils/tauxPoursuite";
import { selectTauxPressionAgg } from "../utils/tauxPression";

function withReg({
  eb,
  rentreeScolaire,
  millesimeSortie,
}: {
  eb: ExpressionBuilder<DB, "formationEtablissement" | "etablissement">;
  rentreeScolaire: string;
  millesimeSortie: string;
}) {
  return jsonObjectFrom(
    eb
      .selectFrom("formationEtablissement as subFE")
      .innerJoin("indicateurEntree as subIE", (join) =>
        join
          .onRef("subFE.id", "=", "subIE.formationEtablissementId")
          .on("subIE.rentreeScolaire", "=", rentreeScolaire)
      )
      .innerJoin("indicateurSortie as subIS", (join) =>
        join
          .onRef("subFE.id", "=", "subIS.formationEtablissementId")
          .on("subIS.millesimeSortie", "=", millesimeSortie)
      )
      .innerJoin("etablissement as subEtab", "subEtab.UAI", "subFE.UAI")
      .whereRef("subFE.cfd", "=", "formationEtablissement.cfd")
      .whereRef(
        "subFE.dispositifId",
        "=",
        "formationEtablissement.dispositifId"
      )
      .whereRef("subEtab.codeRegion", "=", "etablissement.codeRegion")
      .select([
        selectTauxPressionAgg("subIE").as("tauxPression"),
        selectTauxInsertion12moisAgg("subIS").as("tauxInsertion12mois"),
        selectTauxPoursuiteAgg("subIS").as("tauxPoursuiteEtudes"),
      ])
      .groupBy(["cfd", "dispositifId"])
  ).as("indicateursRegionaux");
}
export const getEtablissement = async ({
  uai,
  millesimeSortie = "2020_2021",
  rentreeScolaire = "2022",
}: {
  uai: string;
  millesimeSortie?: string;
  rentreeScolaire?: string;
}) => {
  const etablissement = await kdb
    .selectFrom("etablissement")
    .leftJoin("indicateurEtablissement", (join) =>
      join
        .onRef("etablissement.UAI", "=", "indicateurEtablissement.UAI")
        .on("indicateurEtablissement.millesime", "=", millesimeSortie)
    )
    .leftJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .select("etablissement.UAI as uai")
    .$narrowType<{ uai: string }>()
    .select([
      "libelleEtablissement",
      "valeurAjoutee",
      "region.libelleRegion",
      "region.codeRegion",
    ])
    .select((eb) =>
      jsonArrayFrom(
        eb
          .selectFrom("formationEtablissement")
          .innerJoin("indicateurEntree", (join) =>
            join
              .onRef(
                "formationEtablissement.id",
                "=",
                "indicateurEntree.formationEtablissementId"
              )
              .on("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
          )
          .innerJoin(
            "formation",
            "formation.codeFormationDiplome",
            "formationEtablissement.cfd"
          )
          .innerJoin(
            "etablissement as e",
            "e.UAI",
            "formationEtablissement.UAI"
          )
          .select([
            "formation.libelleDiplome",
            "formationEtablissement.cfd",
            "formationEtablissement.dispositifId",
            sql<number>`NULLIF((jsonb_extract_path("indicateurEntree"."effectifs","indicateurEntree"."anneeDebut"::text)), 'null')::INT
            `.as("effectif"),
          ])
          .select((eb) => withReg({ eb, rentreeScolaire, millesimeSortie }))
          .whereRef("formationEtablissement.UAI", "=", "etablissement.UAI")
          .groupBy([
            "formation.libelleDiplome",
            "formationEtablissement.cfd",
            "formationEtablissement.dispositifId",
            "indicateurEntree.effectifs",
            "indicateurEntree.anneeDebut",
          ])
      ).as("formations")
    )
    .where("etablissement.UAI", "=", uai)
    .groupBy([
      "etablissement.codeRegion",
      "etablissement.UAI",
      "etablissement.libelleEtablissement",
      "indicateurEtablissement.valeurAjoutee",
      "region.codeRegion",
    ])
    .executeTakeFirst();

  return (
    etablissement &&
    cleanNull({
      ...etablissement,
      formations: etablissement.formations.map(cleanNull),
    })
  );
};
