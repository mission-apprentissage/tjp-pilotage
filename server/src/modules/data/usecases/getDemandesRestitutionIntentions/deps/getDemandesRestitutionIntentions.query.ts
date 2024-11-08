import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";
import { CURRENT_RENTREE, MILLESIMES_IJ } from "shared";
import { getMillesimeFromCampagne } from "shared/time/millesimes";
import { z } from "zod";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { RequestUser } from "../../../../core/model/User";
import { castDemandeStatutWithoutSupprimee } from "../../../../utils/castDemandeStatut";
import {
  countDifferenceCapaciteApprentissage,
  countDifferenceCapaciteApprentissageColoree,
  countDifferenceCapaciteScolaire,
  countDifferenceCapaciteScolaireColoree,
} from "../../../../utils/countCapacite";
import { isDemandeNotDeleted } from "../../../../utils/isDemandeSelectable";
import { isRestitutionIntentionVisible } from "../../../../utils/isRestitutionIntentionVisible";
import { getNormalizedSearchArray } from "../../../../utils/normalizeSearch";
import { isScolaireIndicateurRegionSortie } from "../../../utils/isScolaire";
import { nbEtablissementFormationRegion } from "../../../utils/nbEtablissementFormationRegion";
import { selectPositionQuadrant } from "../../../utils/positionFormationRegionaleQuadrant";
import { selectTauxDevenirFavorable } from "../../../utils/tauxDevenirFavorable";
import { selectTauxInsertion6mois } from "../../../utils/tauxInsertion6mois";
import { selectTauxPoursuite } from "../../../utils/tauxPoursuite";
import { selectTauxPressionParFormationEtParRegionDemande } from "../../../utils/tauxPression";
import { FiltersSchema } from "../getDemandesRestitutionIntentions.schema";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
  millesimeSortie?: (typeof MILLESIMES_IJ)[number];
  campagne: string;
}

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
  voie,
  campagne,
  positionQuadrant,
  offset = 0,
  limit = 20,
  order = "desc",
  orderBy = "createdAt",
  search,
}: Filters) => {
  const search_array = getNormalizedSearchArray(search);
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
    .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .leftJoin(
      "academie",
      "academie.codeAcademie",
      "dataEtablissement.codeAcademie"
    )
    .leftJoin(
      "departement",
      "departement.codeDepartement",
      "dataEtablissement.codeDepartement"
    )
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
          "indicateurRegionSortie.codeDispositif",
          "=",
          "demande.codeDispositif"
        )
        .on(
          "indicateurRegionSortie.millesimeSortie",
          "=",
          getMillesimeFromCampagne(campagne)
        )
        .on(isScolaireIndicateurRegionSortie)
    )
    .leftJoin("positionFormationRegionaleQuadrant", (join) =>
      join.on((eb) =>
        eb.and([
          eb(
            eb.ref("positionFormationRegionaleQuadrant.cfd"),
            "=",
            eb.ref("demande.cfd")
          ),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.codeDispositif"),
            "=",
            eb.ref("demande.codeDispositif")
          ),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.codeRegion"),
            "=",
            eb.ref("dataEtablissement.codeRegion")
          ),
          eb(
            "positionFormationRegionaleQuadrant.millesimeSortie",
            "=",
            getMillesimeFromCampagne(campagne)
          ),
        ])
      )
    )
    .leftJoin("tauxIJNiveauDiplomeRegion", (join) =>
      join.on((eb) =>
        eb.and([
          eb(
            eb.ref("tauxIJNiveauDiplomeRegion.codeRegion"),
            "=",
            eb.ref("dataEtablissement.codeRegion")
          ),
          eb(
            eb.ref("tauxIJNiveauDiplomeRegion.codeNiveauDiplome"),
            "=",
            eb.ref("dataFormation.codeNiveauDiplome")
          ),
          eb(
            eb.ref("tauxIJNiveauDiplomeRegion.millesimeSortie"),
            "=",
            eb.ref("positionFormationRegionaleQuadrant.millesimeSortie")
          ),
        ])
      )
    )
    .selectAll("demande")
    .select((eb) => [
      "niveauDiplome.codeNiveauDiplome as codeNiveauDiplome",
      "niveauDiplome.libelleNiveauDiplome as niveauDiplome",
      "dataFormation.libelleFormation",
      "nsf.libelleNsf as libelleNsf",
      "dataEtablissement.libelleEtablissement",
      "dataEtablissement.commune as commune",
      "dataEtablissement.secteur",
      "dispositif.libelleDispositif",
      "region.libelleRegion as libelleRegion",
      "departement.libelleDepartement",
      "departement.codeDepartement as codeDepartement",
      "academie.libelleAcademie",
      "academie.codeAcademie as codeAcademie",
      "dataFormation.typeFamille",
      countDifferenceCapaciteScolaire(eb).as("differenceCapaciteScolaire"),
      countDifferenceCapaciteApprentissage(eb).as(
        "differenceCapaciteApprentissage"
      ),
      countDifferenceCapaciteScolaireColoree(eb).as(
        "differenceCapaciteScolaireColoree"
      ),
      countDifferenceCapaciteApprentissageColoree(eb).as(
        "differenceCapaciteApprentissageColoree"
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
      selectPositionQuadrant(eb).as("positionQuadrant"),
      jsonBuildObject({
        moyenneInsertionCfdRegion: eb.ref(
          "positionFormationRegionaleQuadrant.moyenneInsertionCfdRegion"
        ),
        moyennePoursuiteEtudeCfdRegion: eb.ref(
          "positionFormationRegionaleQuadrant.moyennePoursuiteEtudeCfdRegion"
        ),
        millesimeSortie: eb.ref(
          "positionFormationRegionaleQuadrant.millesimeSortie"
        ),
      }).as("positionFormationRegionaleQuadrant"),
      jsonBuildObject({
        tauxInsertion6mois: eb.ref(
          "tauxIJNiveauDiplomeRegion.tauxInsertion6mois"
        ),
        tauxPoursuite: eb.ref("tauxIJNiveauDiplomeRegion.tauxPoursuite"),
        millesimeSortie: eb.ref("tauxIJNiveauDiplomeRegion.millesimeSortie"),
      }).as("tauxIJNiveauDiplomeRegion"),
    ])
    .$call((eb) => {
      if (search)
        return eb.where((eb) =>
          eb.and(
            search_array.map((search_word) =>
              eb(
                sql`concat(
                  unaccent(${eb.ref("demande.numero")}),
                  ' ',
                  unaccent(${eb.ref("demande.cfd")}),
                  ' ',
                  unaccent(${eb.ref("dataFormation.libelleFormation")}),
                  ' ',
                  unaccent(${eb.ref("niveauDiplome.libelleNiveauDiplome")}),
                  ' ',
                  unaccent(${eb.ref("nsf.libelleNsf")}),
                  ' ',
                  unaccent(${eb.ref("dataEtablissement.libelleEtablissement")}),
                  ' ',
                  unaccent(${eb.ref("dataEtablissement.commune")}),
                  ' ',
                  unaccent(${eb.ref("region.libelleRegion")}),
                  ' ',
                  unaccent(${eb.ref("academie.libelleAcademie")}),
                  ' ',
                  unaccent(${eb.ref("departement.libelleDepartement")})
                )`,
                "ilike",
                `%${search_word}%`
              )
            )
          )
        );
      return eb;
    })
    .$call((eb) => {
      if (positionQuadrant)
        return eb.where(
          "positionFormationRegionaleQuadrant.positionQuadrant",
          "=",
          positionQuadrant
        );
      return eb;
    })
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
    .where(isRestitutionIntentionVisible({ user }))
    .offset(offset)
    .limit(limit)
    .execute();

  return {
    demandes: demandes.map((demande) =>
      cleanNull({
        ...demande,
        statut: castDemandeStatutWithoutSupprimee(demande.statut),
        createdAt: demande.createdAt?.toISOString(),
        updatedAt: demande.updatedAt?.toISOString(),
      })
    ),
    count: parseInt(demandes[0]?.count) || 0,
  };
};
