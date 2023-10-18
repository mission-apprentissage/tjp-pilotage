import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { effectifAnnee } from "../../queries/utils/effectifAnnee";
import { hasContinuum } from "../../queries/utils/hasContinuum";
import { withDevenirFavorableReg } from "../../queries/utils/tauxDevenirFavorable";
import { withInsertionReg } from "../../queries/utils/tauxInsertion6mois";
import { withPoursuiteReg } from "../../queries/utils/tauxPoursuite";
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
      (eb) =>
        withInsertionReg({ eb, millesimeSortie: "2019_2020" }).as(
          "tauxInsertion6moisPrecedent"
        ),
      (eb) =>
        withPoursuiteReg({ eb, millesimeSortie: "2019_2020" }).as(
          "tauxPoursuiteEtudesPrecedent"
        ),
      (eb) =>
        withInsertionReg({ eb, millesimeSortie }).as("tauxInsertion6mois"),
      (eb) =>
        withPoursuiteReg({ eb, millesimeSortie }).as("tauxPoursuiteEtudes"),
      (eb) => hasContinuum({ eb, millesimeSortie }).as("continuum"),
      (eb) =>
        withDevenirFavorableReg({ eb, millesimeSortie }).as(
          "tauxDevenirFavorable"
        ),
    ])
    .$narrowType<{
      tauxInsertion6mois: number;
      tauxPoursuiteEtudes: number;
      tauxDevenirFavorable: number;
    }>()
    .having((eb) => withInsertionReg({ eb, millesimeSortie }), "is not", null)
    .having((eb) => withPoursuiteReg({ eb, millesimeSortie }), "is not", null)
    .groupBy([
      "formationEtablissement.cfd",
      "formation.id",
      "indicateurEntree.rentreeScolaire",
      "formationEtablissement.dispositifId",
      "dispositif.codeDispositif",
      "niveauDiplome.libelleNiveauDiplome",
    ])
    .execute();

  return formations.map(cleanNull);
};
