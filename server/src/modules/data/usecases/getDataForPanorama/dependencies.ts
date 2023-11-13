import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { effectifAnnee } from "../../queries/utils/effectifAnnee";
import { getMillesimePrecedent } from "../../queries/utils/getMillesime";
import { hasContinuum } from "../../queries/utils/hasContinuum";
import { notHistorique } from "../../queries/utils/notHistorique";
import { withPositionQuadrant } from "../../queries/utils/positionQuadrant";
import { withTauxDevenirFavorableReg } from "../../queries/utils/tauxDevenirFavorable";
import { withInsertionReg } from "../../queries/utils/tauxInsertion6mois";
import { withPoursuiteReg } from "../../queries/utils/tauxPoursuite";
import { selectTauxPressionAgg } from "../../queries/utils/tauxPression";
import { selectTauxRemplissageAgg } from "../../queries/utils/tauxRemplissage";

const queryFormations = ({
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
  codesNiveauxDiplomes,
  libellesFilieres,
  orderBy,
}: {
  rentreeScolaire?: string;
  millesimeSortie?: string;
  codesNiveauxDiplomes?: string[];
  libellesFilieres?: string[];
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
    .leftJoin("indicateurEntree", (join) =>
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
    .where(notHistorique)
    .$call((q) => {
      if (!codesNiveauxDiplomes) return q;
      return q.where("formation.codeNiveauDiplome", "in", codesNiveauxDiplomes)
    })
    .$call((q) => {
      if (!libellesFilieres) return q;
      return q.where("formation.libelleFiliere", "in", libellesFilieres)
    })
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
          millesimeSortie: getMillesimePrecedent(millesimeSortie),
          cfdRef: "formationEtablissement.cfd",
          dispositifIdRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }).as("tauxInsertionPrecedent"),
      (eb) =>
        withPoursuiteReg({
          eb,
          millesimeSortie: getMillesimePrecedent(millesimeSortie),
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
          codesNiveauxDiplomes
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
    .orderBy("libelleNiveauDiplome", "asc")

export const queryFormationsRegion = async ({
  codeRegion,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
  codesNiveauxDiplomes,
  libellesFilieres,
  orderBy
}: {
  codeRegion: string;
  rentreeScolaire?: string;
  millesimeSortie?: string;
  codesNiveauxDiplomes?: string[];
  libellesFilieres?: string[];
  orderBy?: { column: string; order: "asc" | "desc" };
}) => {
  const formations = await queryFormations({ rentreeScolaire, millesimeSortie, codesNiveauxDiplomes, libellesFilieres, orderBy })
    .where("etablissement.codeRegion", "=", codeRegion)
    .execute();

  return formations.map(cleanNull);
};

export const queryFormationsDepartement = async ({
  codeDepartement,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
  codesNiveauxDiplomes,
  libellesFilieres,
  orderBy
}: {
  codeDepartement: string;
  rentreeScolaire?: string;
  millesimeSortie?: string;
  codesNiveauxDiplomes?: string[];
  libellesFilieres?: string[];
  orderBy?: { column: string; order: "asc" | "desc" };
}) => {
  const formations = await queryFormations({ rentreeScolaire, millesimeSortie, codesNiveauxDiplomes, libellesFilieres, orderBy })
    .where("etablissement.codeDepartement", "=", codeDepartement)
    .execute();

  return formations.map(cleanNull);
};

export const getFilters = async ({
  codeRegion,
  codeDepartement
}: {
  codeRegion?: string;
  codeDepartement?: string;
}) => {
  const filtersBase = kdb.
    selectFrom("niveauDiplome")
    .leftJoin("formation", "formation.codeNiveauDiplome", "niveauDiplome.codeNiveauDiplome")
    .leftJoin("formationEtablissement", "formationEtablissement.cfd", "formation.codeFormationDiplome")
    .leftJoin("etablissement", "etablissement.UAI", "formationEtablissement.UAI")
    .$call((eb) => {
      if (!codeRegion) return eb;
      return eb.where("etablissement.codeRegion", "=", codeRegion);
    })
    .$call((eb) => {
      if (!codeDepartement) return eb;
      return eb.where("etablissement.codeDepartement", "=", codeDepartement);
    })
    .distinct()
    .$castTo<{ label: string; value: string }>()


  const diplomes = await filtersBase
    .select([
      "niveauDiplome.codeNiveauDiplome as value",
      "niveauDiplome.libelleNiveauDiplome as label"
    ])
    .where("formation.codeNiveauDiplome", "is not", null)
    .execute();

  const filieres = await filtersBase
    .select([
      "formation.libelleFiliere as label",
      "formation.libelleFiliere as value",
    ])
    .where("formation.libelleFiliere", "is not", null)
    .execute();


  return {
    diplomes: diplomes.map(cleanNull),
    filieres: filieres.map(cleanNull)
  }
}
