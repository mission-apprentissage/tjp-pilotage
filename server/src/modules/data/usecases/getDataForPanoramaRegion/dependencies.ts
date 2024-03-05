import { sql } from "kysely";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";
import { z } from "zod";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { getMillesimePrecedent } from "../../services/getMillesime";
import { getRentreeScolairePrecedente } from "../../services/getRentreeScolaire";
import { effectifAnnee } from "../../utils/effectifAnnee";
import { hasContinuum } from "../../utils/hasContinuum";
import { notAnneeCommune } from "../../utils/notAnneeCommune";
import { notHistoriqueUnlessCoExistant } from "../../utils/notHistorique";
import { withTauxDevenirFavorableReg } from "../../utils/tauxDevenirFavorable";
import { withInsertionReg } from "../../utils/tauxInsertion6mois";
import { withPoursuiteReg } from "../../utils/tauxPoursuite";
import { selectTauxPressionAgg } from "../../utils/tauxPression";
import { selectTauxRemplissageAgg } from "../../utils/tauxRemplissage";
import { getDataForPanoramaRegionSchema } from "./getDataForPanoramaRegion.schema";

export interface Filters
  extends z.infer<typeof getDataForPanoramaRegionSchema.querystring> {
  rentreeScolaire?: string;
  millesimeSortie?: string;
}

export const getFormationsRegion = async ({
  codeRegion,
  rentreeScolaire = CURRENT_RENTREE,
  millesimeSortie = CURRENT_IJ_MILLESIME,
  codeNiveauDiplome,
  codeNsf,
  order,
  orderBy,
}: Filters) =>
  kdb
    .selectFrom("formationScolaireView as formationView")
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formationView.cfd"
    )
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formationView.codeNiveauDiplome"
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
    .leftJoin("indicateurEntree as iep", (join) =>
      join
        .onRef("formationEtablissement.id", "=", "iep.formationEtablissementId")
        .on(
          "iep.rentreeScolaire",
          "=",
          getRentreeScolairePrecedente(rentreeScolaire)
        )
    )
    .where((eb) => notHistoriqueUnlessCoExistant(eb, rentreeScolaire))
    .where(notAnneeCommune)
    .where("etablissement.codeRegion", "=", codeRegion)
    .$call((q) => {
      if (!codeNiveauDiplome) return q;
      return q.where(
        "formationView.codeNiveauDiplome",
        "in",
        codeNiveauDiplome
      );
    })
    .$call((q) => {
      if (!codeNsf) return q;
      return q.where("formationView.codeNsf", "in", codeNsf);
    })
    .select((eb) => [
      "formationView.cfd",
      "formationView.codeNiveauDiplome",
      "formationEtablissement.dispositifId as codeDispositif",
      "libelleDispositif",
      "libelleNiveauDiplome",
      sql<number>`COUNT(etablissement."UAI")`.as("nbEtablissement"),
      selectTauxRemplissageAgg("indicateurEntree").as("tauxRemplissage"),
      sql<number>`SUM(${effectifAnnee({ alias: "indicateurEntree" })})`.as(
        "effectif"
      ),
      sql<number>`SUM(${effectifAnnee({ alias: "iep" })})`.as(
        "effectifPrecedent"
      ),
      sql<string>`CONCAT(${eb.ref(
        "formationView.libelleFormation"
      )},' (',${eb.ref("niveauDiplome.libelleNiveauDiplome")}, ')')`.as(
        "libelleFormation"
      ),
      selectTauxPressionAgg("indicateurEntree", "formationView").as(
        "tauxPression"
      ),
      (eb) =>
        withInsertionReg({
          eb,
          millesimeSortie: getMillesimePrecedent(millesimeSortie),
          cfdRef: "formationEtablissement.cfd",
          codeDispositifRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }).as("tauxInsertionPrecedent"),
      (eb) =>
        withPoursuiteReg({
          eb,
          millesimeSortie: getMillesimePrecedent(millesimeSortie),
          cfdRef: "formationEtablissement.cfd",
          codeDispositifRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }).as("tauxPoursuitePrecedent"),
      (eb) =>
        withInsertionReg({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          codeDispositifRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }).as("tauxInsertion"),
      (eb) =>
        withPoursuiteReg({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          codeDispositifRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }).as("tauxPoursuite"),
      (eb) =>
        hasContinuum({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          codeDispositifRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }).as("continuum"),
      (eb) =>
        withTauxDevenirFavorableReg({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          codeDispositifRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }).as("tauxDevenirFavorable"),
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
          codeDispositifRef: "formationEtablissement.dispositifId",
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
          codeDispositifRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }),
      "is not",
      null
    )
    .groupBy([
      "formationEtablissement.cfd",
      "formationView.id",
      "formationView.cfd",
      "formationView.codeNiveauDiplome",
      "formationView.libelleFormation",
      "formationEtablissement.dispositifId",
      "dispositif.codeDispositif",
      "niveauDiplome.libelleNiveauDiplome",
    ])
    .$call((q) => {
      if (!orderBy || !order) return q;
      return q.orderBy(sql.ref(orderBy), sql`${sql.raw(order)} NULLS LAST`);
    })
    .orderBy("libelleFormation", "asc")
    .execute()
    .then(cleanNull);

export const getFilters = async ({
  codeRegion,
  codeDepartement,
}: {
  codeRegion?: string;
  codeDepartement?: string;
}) => {
  const filtersBase = kdb
    .selectFrom("niveauDiplome")
    .leftJoin(
      "formationView",
      "formationView.codeNiveauDiplome",
      "niveauDiplome.codeNiveauDiplome"
    )
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formationView.cfd"
    )
    .leftJoin(
      "etablissement",
      "etablissement.UAI",
      "formationEtablissement.UAI"
    )
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
    .orderBy("label", "asc");

  const diplomes = await filtersBase
    .select([
      "niveauDiplome.codeNiveauDiplome as value",
      "niveauDiplome.libelleNiveauDiplome as label",
    ])
    .where("formationView.codeNiveauDiplome", "is not", null)
    .execute();

  const libellesNsf = await filtersBase
    .leftJoin("nsf", "nsf.codeNsf", "formationView.codeNsf")
    .select(["nsf.libelleNsf as label", "formationView.codeNsf as value"])
    .where("nsf.libelleNsf", "is not", null)
    .execute();

  return {
    diplomes: diplomes.map(cleanNull),
    libellesNsf: libellesNsf.map(cleanNull),
  };
};

export const dependencies = { getFormationsRegion, getFilters };
