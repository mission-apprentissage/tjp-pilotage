import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { effectifAnnee } from "../../queries/utils/effectifAnnee";
import { selectTauxInsertion12moisAgg } from "../../queries/utils/tauxInsertion12mois";
import { selectTauxPoursuiteAgg } from "../../queries/utils/tauxPoursuite";
import { selectTauxPressionAgg } from "../../queries/utils/tauxPression";
import { selectTauxRemplissageAgg } from "../../queries/utils/tauxRemplissage";

const getBaseQuery = ({
  codeRegion,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
}: {
  codeRegion: string;
  rentreeScolaire?: string;
  millesimeSortie?: string;
}) =>
  kdb
    .selectFrom("formation")
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formation.codeFormationDiplome"
    )
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formation.codeNiveauDiplome"
    )
    .leftJoin(
      "dispositif",
      "formationEtablissement.dispositifId",
      "dispositif.codeDispositif"
    )
    .innerJoin("indicateurEntree", (join) =>
      join
        .onRef(
          "formationEtablissement.id",
          "=",
          "indicateurEntree.formationEtablissementId"
        )
        .on("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
    )
    .leftJoin("indicateurSortie", (join) =>
      join
        .onRef(
          "formationEtablissement.id",
          "=",
          "indicateurSortie.formationEtablissementId"
        )
        .on("indicateurSortie.millesimeSortie", "=", millesimeSortie)
    )
    .leftJoin(
      "etablissement",
      "etablissement.UAI",
      "formationEtablissement.UAI"
    )
    .where(
      "codeFormationDiplome",
      "not in",
      sql`(SELECT DISTINCT "ancienCFD" FROM "formationHistorique")`
    )
    .where("etablissement.codeRegion", "=", codeRegion);

export const queryFormations = async ({
  codeRegion,
  UAI,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
}: {
  codeRegion: string;
  UAI?: string[];
  rentreeScolaire?: string;
  millesimeSortie?: string;
}) => {
  const baseQuery = getBaseQuery({
    codeRegion,
    rentreeScolaire,
    millesimeSortie,
  });

  const formations = await baseQuery
    .leftJoin("indicateurSortie as isp", (join) =>
      join
        .onRef("formationEtablissement.id", "=", "isp.formationEtablissementId")
        .on("isp.millesimeSortie", "=", "2019_2020")
    )
    .leftJoin("indicateurEntree as iep", (join) =>
      join
        .onRef("formationEtablissement.id", "=", "iep.formationEtablissementId")
        .on("iep.rentreeScolaire", "=", "2021")
    )
    .select([
      "codeFormationDiplome",
      "libelleDiplome",
      "formationEtablissement.dispositifId",
      "libelleDispositif",
      "formation.codeNiveauDiplome",
      sql<number>`COUNT(etablissement."UAI")`.as("nbEtablissement"),
      selectTauxRemplissageAgg("indicateurEntree").as("tauxRemplissage"),
      sql<number>`SUM(${effectifAnnee({ alias: "indicateurEntree" })})`.as(
        "effectif"
      ),
      sql<number>`SUM(${effectifAnnee({ alias: "iep" })})`.as(
        "effectifPrecedent"
      ),
      selectTauxPressionAgg("indicateurEntree").as("tauxPression"),
      selectTauxPoursuiteAgg("indicateurSortie").as("tauxPoursuiteEtudes"),
      selectTauxPoursuiteAgg("isp").as("tauxPoursuiteEtudesPrecedent"),
      selectTauxInsertion12moisAgg("indicateurSortie").as(
        "tauxInsertion12mois"
      ),
      selectTauxInsertion12moisAgg("isp").as("tauxInsertion12moisPrecedent"),
    ])
    .where("indicateurSortie.nbInsertion12mois", "is not", null)
    .where("indicateurSortie.nbPoursuiteEtudes", "is not", null)
    .having(selectTauxInsertion12moisAgg("indicateurSortie"), "is not", null)
    .having(selectTauxPoursuiteAgg("indicateurSortie"), "is not", null)
    .having(
      UAI
        ? sql<boolean>`bool_or(etablissement."UAI" in (${sql.join(UAI)}))`
        : sql<boolean>`true`
    )
    .groupBy([
      "formation.id",
      "indicateurEntree.rentreeScolaire",
      "formationEtablissement.dispositifId",
      "dispositif.codeDispositif",
      "niveauDiplome.libelleNiveauDiplome",
    ])
    .execute();

  return formations.map(cleanNull);
};

export const queryStatsForCadran = async ({
  codeRegion,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
}: {
  codeRegion: string;
  rentreeScolaire?: string;
  millesimeSortie?: string;
}) => {
  const baseQuery = getBaseQuery({
    codeRegion,
    rentreeScolaire,
    millesimeSortie,
  });

  const stats = await baseQuery
    .select([
      selectTauxPoursuiteAgg("indicateurSortie").as("tauxPoursuiteEtudes"),
      selectTauxInsertion12moisAgg("indicateurSortie").as(
        "tauxInsertion12mois"
      ),
      selectTauxRemplissageAgg("indicateurEntree").as("tauxRemplissage"),
      sql<number>`SUM(${effectifAnnee({ alias: "indicateurEntree" })})
      `.as("effectif"),
      sql<number>`COUNT(distinct CONCAT("formationEtablissement"."cfd", "formationEtablissement"."dispositifId"))
      `.as("nbFormations"),
    ])
    .groupBy(["codeRegion"])
    .executeTakeFirst();

  return stats && cleanNull(stats);
};
