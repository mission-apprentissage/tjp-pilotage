import { sql } from "kysely";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import { getMillesimeFromCampagne } from "shared/time/millesimes";

import { getKbdClient } from "@/db/db";
import type { Filters } from "@/modules/data/usecases/getRestitutionIntentions/getRestitutionIntentions.usecase";
import { isScolaireIndicateurRegionSortie } from "@/modules/data/utils/isScolaire";
import { isDemandeNotDeleted } from "@/modules/utils/isDemandeSelectable";
import { isRestitutionIntentionVisible } from "@/modules/utils/isRestitutionIntentionVisible";
import { getNormalizedSearchArray } from "@/modules/utils/normalizeSearch";

export const getBase = ({
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
  formationSpecifique,
  search,
}: Filters) => {
  const search_array = getNormalizedSearchArray(search);
  return getKbdClient()
    .selectFrom("latestDemandeIntentionView as demande")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demande.campagneId").$call((eb) => {
        if (campagne) return eb.on("campagne.annee", "=", campagne);
        return eb;
      })
    )
    .innerJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .innerJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .innerJoin("dispositif", "dispositif.codeDispositif", "demande.codeDispositif")
    .innerJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .innerJoin("academie", "academie.codeAcademie", "dataEtablissement.codeAcademie")
    .innerJoin("departement", "departement.codeDepartement", "dataEtablissement.codeDepartement")
    .innerJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "dataFormation.codeNiveauDiplome")
    .innerJoin("nsf", "nsf.codeNsf", "dataFormation.codeNsf")
    .leftJoin("formationScolaireView as formationView", "formationView.cfd", "demande.cfd")
    .leftJoin("indicateurRegionSortie", (join) =>
      join
        .onRef("indicateurRegionSortie.cfd", "=", "demande.cfd")
        .onRef("indicateurRegionSortie.codeRegion", "=", "demande.codeRegion")
        .onRef("indicateurRegionSortie.codeDispositif", "=", "demande.codeDispositif")
        .on("indicateurRegionSortie.millesimeSortie", "=", getMillesimeFromCampagne(campagne))
        .on(isScolaireIndicateurRegionSortie)
    )
    .leftJoin("positionFormationRegionaleQuadrant", (join) =>
      join.on((eb) =>
        eb.and([
          eb(eb.ref("positionFormationRegionaleQuadrant.cfd"), "=", eb.ref("demande.cfd")),
          eb(eb.ref("positionFormationRegionaleQuadrant.codeDispositif"), "=", eb.ref("demande.codeDispositif")),
          eb(eb.ref("positionFormationRegionaleQuadrant.codeRegion"), "=", eb.ref("dataEtablissement.codeRegion")),
          eb("positionFormationRegionaleQuadrant.millesimeSortie", "=", getMillesimeFromCampagne(campagne)),
        ])
      )
    )
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
                  unaccent(${eb.ref("formationView.libelleFormation")}),
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
        return eb.where("positionFormationRegionaleQuadrant.positionQuadrant", "=", positionQuadrant);
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
      if (codeDepartement) return eb.where("dataEtablissement.codeDepartement", "in", codeDepartement);
      return eb;
    })
    .$call((eb) => {
      if (codeAcademie) return eb.where("dataEtablissement.codeAcademie", "in", codeAcademie);
      return eb;
    })
    .$call((eb) => {
      if (uai) return eb.where("dataEtablissement.uai", "in", uai);
      return eb;
    })
    .$call((eb) => {
      if (rentreeScolaire && !Number.isNaN(rentreeScolaire))
        return eb.where("demande.rentreeScolaire", "=", parseInt(rentreeScolaire));
      return eb;
    })
    .$call((eb) => {
      if (typeDemande) return eb.where("demande.typeDemande", "in", typeDemande);
      return eb;
    })
    .$call((eb) => {
      if (cfd) return eb.where("demande.cfd", "in", cfd);
      return eb;
    })
    .$call((eb) => {
      if (codeNiveauDiplome) return eb.where("formationView.codeNiveauDiplome", "in", codeNiveauDiplome);
      return eb;
    })
    .$call((eb) => {
      if (codeNsf) return eb.where("formationView.codeNsf", "in", codeNsf);
      return eb;
    })
    .$call((eb) => {
      if (coloration)
        return eb.where("demande.coloration", "=", coloration === "true" ? sql<true>`true` : sql<false>`false`);
      return eb;
    })
    .$call((eb) => {
      if (amiCMA) return eb.where("demande.amiCma", "=", amiCMA === "true" ? sql<true>`true` : sql<false>`false`);
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
            sql<boolean>`abs(
            ${ebw.ref("demande.capaciteApprentissage")} -
            ${ebw.ref("demande.capaciteApprentissageActuelle")}
          ) > 1`
        );
      }

      if (voie === "scolaire") {
        return eb.where(
          ({ eb: ebw }) =>
            sql<boolean>`abs(
            ${ebw.ref("demande.capaciteScolaire")} -
            ${ebw.ref("demande.capaciteScolaireActuelle")}
          ) > 1`
        );
      }

      return eb;
    })
    .$call((q) => {
      if (formationSpecifique?.length) {
        if (formationSpecifique.includes(TypeFormationSpecifiqueEnum["Action prioritaire"])) {
          q = q.innerJoin("actionPrioritaire", (join) =>
            join
              .onRef("actionPrioritaire.cfd", "=", "demande.cfd")
              .onRef("actionPrioritaire.codeDispositif", "=", "demande.codeDispositif")
              .onRef("actionPrioritaire.codeRegion", "=", "demande.codeRegion")
          );
        }
        if (formationSpecifique.includes(TypeFormationSpecifiqueEnum["Transition écologique"])) {
          q = q.where("formationView.isTransitionEcologique", "=", true);
        }
        if (formationSpecifique.includes(TypeFormationSpecifiqueEnum["Transition démographique"])) {
          q = q.where("formationView.isTransitionDemographique", "=", true);
        }
        if (formationSpecifique.includes(TypeFormationSpecifiqueEnum["Transition numérique"])) {
          q = q.where("formationView.isTransitionNumerique", "=", true);
        }
      }
      return q;
    })
    .where(isDemandeNotDeleted)
    .where(isRestitutionIntentionVisible({ user }));
};
