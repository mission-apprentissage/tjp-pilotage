import { sql } from "kysely";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import {
  countDifferenceCapaciteApprentissage,
  countDifferenceCapaciteScolaire,
} from "../../../../utils/countCapacite";
import { isDemandeNotDeleted } from "../../../../utils/isDemandeSelectable";
import { isIntentionVisible } from "../../../../utils/isIntentionVisible";
import { isScolaireIndicateurRegionSortie } from "../../../utils/isScolaire";
import { nbEtablissementFormationRegion } from "../../../utils/nbEtablissementFormationRegion";
import { selectTauxDevenirFavorable } from "../../../utils/tauxDevenirFavorable";
import { selectTauxInsertion6mois } from "../../../utils/tauxInsertion6mois";
import { selectTauxPoursuite } from "../../../utils/tauxPoursuite";
import { selectTauxPressionParFormationEtParRegionDemande } from "../../../utils/tauxPression";
import { Filters } from "../getDemandesRestitutionIntentions.usecase";

export const getDemandesRestitutionIntentionsQuery = async ({
  statut,
  codeRegion,
  rentreeScolaire,
  typeDemande,
  cfd,
  codeNiveauDiplome,
  codeNsf,
  coloration,
  amiCMA,
  secteur,
  codeDepartement,
  codeAcademie,
  uai,
  user,
  millesimeSortie = CURRENT_IJ_MILLESIME,
  voie,
  campagne,
  offset = 0,
  limit = 20,
  order = "desc",
  orderBy = "createdAt",
}: Filters) => {
  const demandes = await kdb
    .selectFrom("latestDemandeIntentionView as demande")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demande.campagneId").$call((eb) => {
        if (campagne) return eb.on("campagne.annee", "=", campagne);
        return eb;
      })
    )
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("nsf", "dataFormation.codeNsf", "nsf.codeNsf")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin(
      "dispositif",
      "dispositif.codeDispositif",
      "demande.codeDispositif"
    )
    .leftJoin(
      "departement",
      "departement.codeDepartement",
      "dataEtablissement.codeDepartement"
    )
    .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .leftJoin(
      "academie",
      "academie.codeAcademie",
      "dataEtablissement.codeAcademie"
    )
    .leftJoin("familleMetier", "familleMetier.cfd", "demande.cfd")
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "dataFormation.codeNiveauDiplome"
    )
    .leftJoin("indicateurRegionSortie", (join) =>
      join
        .onRef("indicateurRegionSortie.cfd", "=", "demande.cfd")
        .onRef("indicateurRegionSortie.codeRegion", "=", "demande.codeRegion")
        .onRef(
          "indicateurRegionSortie.dispositifId",
          "=",
          "demande.codeDispositif"
        )
        .on("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
        .on(isScolaireIndicateurRegionSortie)
    )
    .selectAll("demande")
    .select((eb) => [
      "niveauDiplome.codeNiveauDiplome as codeNiveauDiplome",
      "niveauDiplome.libelleNiveauDiplome as niveauDiplome",
      "dataFormation.libelleFormation",
      "nsf.libelleNsf as libelleNsf",
      "dataEtablissement.libelleEtablissement",
      "dataEtablissement.commune as commune",
      "dispositif.libelleDispositif",
      "region.libelleRegion as libelleRegion",
      "departement.libelleDepartement",
      "departement.codeDepartement as codeDepartement",
      "academie.libelleAcademie",
      "academie.codeAcademie as codeAcademie",
      countDifferenceCapaciteScolaire(eb).as("differenceCapaciteScolaire"),
      countDifferenceCapaciteApprentissage(eb).as(
        "differenceCapaciteApprentissage"
      ),
      sql<string>`count(*) over()`.as("count"),
      selectTauxInsertion6mois("indicateurRegionSortie").as(
        "tauxInsertionRegional"
      ),
      selectTauxPoursuite("indicateurRegionSortie").as("tauxPoursuiteRegional"),
      selectTauxDevenirFavorable("indicateurRegionSortie").as(
        "tauxDevenirFavorableRegional"
      ),
      selectTauxPressionParFormationEtParRegionDemande({
        eb,
        rentreeScolaire: CURRENT_RENTREE,
      }).as("tauxPressionRegional"),
      nbEtablissementFormationRegion({
        eb,
        rentreeScolaire: CURRENT_RENTREE,
      }).as("nbEtablissement"),
    ])
    .$call((eb) => {
      if (statut) return eb.where("demande.statut", "in", statut);
      return eb;
    })
    .$call((eb) => {
      if (codeRegion) return eb.where("demande.codeRegion", "in", codeRegion);
      return eb;
    })
    .$call((eb) => {
      if (codeDepartement)
        return eb.where(
          "dataEtablissement.codeDepartement",
          "in",
          codeDepartement
        );
      return eb;
    })
    .$call((eb) => {
      if (codeAcademie)
        return eb.where("dataEtablissement.codeAcademie", "in", codeAcademie);
      return eb;
    })
    .$call((eb) => {
      if (uai) return eb.where("dataEtablissement.uai", "in", uai);
      return eb;
    })
    .$call((eb) => {
      if (rentreeScolaire && !Number.isNaN(rentreeScolaire))
        return eb.where(
          "demande.rentreeScolaire",
          "=",
          parseInt(rentreeScolaire)
        );
      return eb;
    })
    .$call((eb) => {
      if (typeDemande)
        return eb.where("demande.typeDemande", "in", typeDemande);
      return eb;
    })
    .$call((eb) => {
      if (cfd) return eb.where("demande.cfd", "in", cfd);
      return eb;
    })
    .$call((eb) => {
      if (codeNiveauDiplome)
        return eb.where(
          "dataFormation.codeNiveauDiplome",
          "in",
          codeNiveauDiplome
        );
      return eb;
    })
    .$call((eb) => {
      if (codeNsf) return eb.where("dataFormation.codeNsf", "in", codeNsf);
      return eb;
    })
    .$call((eb) => {
      if (coloration)
        return eb.where(
          "demande.coloration",
          "=",
          coloration === "true" ? sql<true>`true` : sql<false>`false`
        );
      return eb;
    })
    .$call((eb) => {
      if (amiCMA)
        return eb.where(
          "demande.amiCma",
          "=",
          amiCMA === "true" ? sql<true>`true` : sql<false>`false`
        );
      return eb;
    })
    .$call((eb) => {
      if (secteur) return eb.where("dataEtablissement.secteur", "=", secteur);
      return eb;
    })
    .$call((eb) => {
      if (voie === "apprentissage") {
        return eb.where(
          ({ eb: ebw }) =>
            sql<boolean>`abs(${ebw.ref(
              "demande.capaciteApprentissage"
            )} - ${ebw.ref("demande.capaciteApprentissageActuelle")}) > 1`
        );
      }

      if (voie === "scolaire") {
        return eb.where(
          ({ eb: ebw }) =>
            sql<boolean>`abs(${ebw.ref("demande.capaciteScolaire")} - ${ebw.ref(
              "demande.capaciteScolaireActuelle"
            )}) > 1`
        );
      }

      return eb;
    })
    .$call((q) => {
      if (!orderBy || !order) return q;
      return q.orderBy(
        sql`${sql.ref(orderBy)}`,
        sql`${sql.raw(order)} NULLS LAST`
      );
    })
    .where(isDemandeNotDeleted)
    .where(isIntentionVisible({ user }))
    .offset(offset)
    .limit(limit)
    .execute();

  return {
    demandes: demandes.map((demande) =>
      cleanNull({
        ...demande,
        createdAt: demande.createdAt?.toISOString(),
        updatedAt: demande.updatedAt?.toISOString(),
      })
    ),
    count: parseInt(demandes[0]?.count) || 0,
  };
};
