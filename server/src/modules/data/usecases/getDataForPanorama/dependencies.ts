import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { effectifAnnee } from "../../queries/utils/effectifAnnee";
import { hasContinuum } from "../../queries/utils/hasContinuum";
import { withPositionQuadrant } from "../../queries/utils/positionQuadrant";
import { withTauxDevenirFavorableReg } from "../../queries/utils/tauxDevenirFavorable";
import { withInsertionReg } from "../../queries/utils/tauxInsertion6mois";
import { withPoursuiteReg } from "../../queries/utils/tauxPoursuite";
import { selectTauxPressionAgg } from "../../queries/utils/tauxPression";
import { selectTauxRemplissageAgg } from "../../queries/utils/tauxRemplissage";

const queryFormations = ({
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
  orderBy,
}: {
  rentreeScolaire?: string;
  millesimeSortie?: string;
  orderBy?: { column: string; order: "asc" | "desc" };
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
    .leftJoin("indicateurEntree as iep", (join) =>
      join
        .onRef("formationEtablissement.id", "=", "iep.formationEtablissementId")
        .on("iep.rentreeScolaire", "=", "2021")
    )
    .select((eb) => [
      "codeFormationDiplome",
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
      sql<string>`CONCAT(${eb.ref("formation.libelleDiplome")},' (',${eb.ref("niveauDiplome.libelleNiveauDiplome")}, ')')`.as("libelleDiplome"),
      selectTauxPressionAgg("indicateurEntree").as("tauxPression"),
      (eb) =>
        withInsertionReg({
          eb,
          millesimeSortie: "2019_2020",
          cfdRef: "formationEtablissement.cfd",
          dispositifIdRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }).as("tauxInsertionPrecedent"),
      (eb) =>
        withPoursuiteReg({
          eb,
          millesimeSortie: "2019_2020",
          cfdRef: "formationEtablissement.cfd",
          dispositifIdRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }).as("tauxPoursuitePrecedent"),
      (eb) =>
        withInsertionReg({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          dispositifIdRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }).as("tauxInsertion"),
      (eb) =>
        withPoursuiteReg({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          dispositifIdRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }).as("tauxPoursuite"),
      (eb) =>
        hasContinuum({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          dispositifIdRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }).as("continuum"),
      (eb) =>
        withTauxDevenirFavorableReg({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          dispositifIdRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }).as("tauxDevenirFavorable"),
      (eb) =>
        withPositionQuadrant({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          dispositifIdRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }).as("positionQuadrant"),
    ])
    .$narrowType<{
      tauxInsertion: number;
      tauxPoursuite: number;
      tauxDevenirFavorable: number;
    }>()
    .having(
      (eb) =>
        withInsertionReg({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          dispositifIdRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }),
      "is not",
      null
    )
    .having(
      (eb) =>
        withPoursuiteReg({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          dispositifIdRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }),
      "is not",
      null
    )
    .groupBy([
      "formationEtablissement.cfd",
      "formation.id",
      "indicateurEntree.rentreeScolaire",
      "formationEtablissement.dispositifId",
      "dispositif.codeDispositif",
      "niveauDiplome.libelleNiveauDiplome",
    ])
    .$call((q) => {
      if (!orderBy) return q;
      return q.orderBy(
        sql.ref(orderBy.column),
        sql`${sql.raw(orderBy.order)} NULLS LAST`
      );
    })
    .orderBy("libelleDiplome", "asc")

export const queryFormationsRegion = async ({
  codeRegion,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
  orderBy
}: {
  codeRegion: string;
  rentreeScolaire?: string;
  millesimeSortie?: string;
  orderBy?: { column: string; order: "asc" | "desc" };
}) => {

  console.log(orderBy)
  const formations = await queryFormations({ rentreeScolaire, millesimeSortie, orderBy })
    .where("etablissement.codeRegion", "=", codeRegion)
    .execute();

  return formations.map(cleanNull);
};

export const queryFormationsDepartement = async ({
  codeDepartement,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
  orderBy
}: {
  codeDepartement: string;
  rentreeScolaire?: string;
  millesimeSortie?: string;
  orderBy?: { column: string; order: "asc" | "desc" };
}) => {
  const formations = await queryFormations({ rentreeScolaire, millesimeSortie, orderBy })
    .where("etablissement.codeDepartement", "=", codeDepartement)
    .execute();

  return formations.map(cleanNull);
};
