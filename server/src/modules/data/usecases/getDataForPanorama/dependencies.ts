import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { effectifAnnee } from "../../queries/utils/effectifAnnee";
import { selectTauxDevenirFavorable } from "../../queries/utils/tauxDevenirFavorable";
import { selectTauxInsertion6mois } from "../../queries/utils/tauxInsertion6mois";
import { selectTauxPoursuite } from "../../queries/utils/tauxPoursuite";
import { selectTauxPressionAgg } from "../../queries/utils/tauxPression";
import { selectTauxRemplissageAgg } from "../../queries/utils/tauxRemplissage";

export const queryFormations = async ({
  codeRegion,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
}: {
  codeRegion: string;
  rentreeScolaire?: string;
  millesimeSortie?: string;
}) => {
  const formations = await kdb
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
    .leftJoin("indicateurRegionSortie", (join) =>
      join
        .onRef("indicateurRegionSortie.cfd", "=", "formationEtablissement.cfd")
        .onRef(
          "indicateurRegionSortie.dispositifId",
          "=",
          "formationEtablissement.dispositifId"
        )
        .on("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
        .on("indicateurRegionSortie.codeRegion", "=", codeRegion)
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
    .where("etablissement.codeRegion", "=", codeRegion)
    .leftJoin("indicateurRegionSortie as IRSP", (join) =>
      join
        .onRef("IRSP.cfd", "=", "formationEtablissement.cfd")
        .onRef("IRSP.dispositifId", "=", "formationEtablissement.dispositifId")
        .on("IRSP.millesimeSortie", "=", "2019_2020")
        .on("IRSP.codeRegion", "=", codeRegion)
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
      "libelleNiveauDiplome",
      "formation.codeNiveauDiplome",
      "formation.libelleFiliere",
      "formation.CPC",
      "formation.CPCSecteur",
      "formation.CPCSousSecteur",
      sql<number>`COUNT(etablissement."UAI")`.as("nbEtablissement"),
      selectTauxRemplissageAgg("indicateurEntree").as("tauxRemplissage"),
      sql<number>`SUM(${effectifAnnee({ alias: "indicateurEntree" })})`.as(
        "effectif"
      ),
      sql<number>`SUM(${effectifAnnee({ alias: "iep" })})`.as(
        "effectifPrecedent"
      ),
      selectTauxPressionAgg("indicateurEntree").as("tauxPression"),
      selectTauxInsertion6mois("IRSP").as("tauxInsertion6moisPrecedent"),
      selectTauxPoursuite("IRSP").as("tauxPoursuiteEtudesPrecedent"),
      selectTauxInsertion6mois("indicateurRegionSortie").as(
        "tauxInsertion6mois"
      ),
      selectTauxPoursuite("indicateurRegionSortie").as("tauxPoursuiteEtudes"),
      selectTauxDevenirFavorable("indicateurRegionSortie").as(
        "tauxDevenirFavorable"
      ),
    ])
    .where(selectTauxInsertion6mois("indicateurRegionSortie"), "is not", null)
    .where(selectTauxPoursuite("indicateurRegionSortie"), "is not", null)
    .groupBy([
      "formationEtablissement.cfd",
      "formation.id",
      "indicateurEntree.rentreeScolaire",
      "formationEtablissement.dispositifId",
      "dispositif.codeDispositif",
      "niveauDiplome.libelleNiveauDiplome",
      "indicateurRegionSortie.nbInsertion6mois",
      "indicateurRegionSortie.nbPoursuiteEtudes",
      "indicateurRegionSortie.effectifSortie",
      "indicateurRegionSortie.nbSortants",
      "IRSP.nbInsertion6mois",
      "IRSP.nbPoursuiteEtudes",
      "IRSP.effectifSortie",
      "IRSP.nbSortants",
    ])
    .execute();

  return formations.map(cleanNull);
};
