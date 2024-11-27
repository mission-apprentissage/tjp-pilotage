import { sql } from "kysely";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import { MAX_LIMIT } from "shared/utils/maxLimit";

import { getKbdClient } from "@/db/db";
import type { Filters } from "@/modules/corrections/usecases/getCorrections/getCorrections.usecase";
import { isScolaireIndicateurRegionSortie } from "@/modules/data/utils/isScolaire";
import { nbEtablissementFormationRegion } from "@/modules/data/utils/nbEtablissementFormationRegion";
import { selectTauxDevenirFavorable } from "@/modules/data/utils/tauxDevenirFavorable";
import { selectTauxInsertion6mois } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuite } from "@/modules/data/utils/tauxPoursuite";
import { selectTauxPressionParFormationEtParRegionDemande } from "@/modules/data/utils/tauxPression";
import { isDemandeNotDeleted, isDemandeSelectable } from "@/modules/utils/isDemandeSelectable";
import { isFormationActionPrioritaireDemande } from "@/modules/utils/isFormationActionPrioritaire";
import { getNormalizedSearchArray } from "@/modules/utils/normalizeSearch";
import { cleanNull } from "@/utils/noNull";

export const getCorrectionsQuery = async ({
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
  formationSpecifique,
  offset = 0,
  limit = MAX_LIMIT,
  order = "desc",
  orderBy = "createdAt",
  search,
}: Filters) => {
  const search_array = getNormalizedSearchArray(search);

  const corrections = await getKbdClient()
    .selectFrom("correction")
    .innerJoin("latestDemandeView as demande", "demande.numero", "correction.intentionNumero")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demande.campagneId").$call((eb) => {
        if (campagne) return eb.on("campagne.annee", "=", campagne);
        return eb;
      })
    )
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("nsf", "dataFormation.codeNsf", "nsf.codeNsf")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("dispositif", "dispositif.codeDispositif", "demande.codeDispositif")
    .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .leftJoin("academie", "academie.codeAcademie", "dataEtablissement.codeAcademie")
    .leftJoin("departement", "departement.codeDepartement", "dataEtablissement.codeDepartement")
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "dataFormation.codeNiveauDiplome")
    .leftJoin("indicateurRegionSortie", (join) =>
      join
        .onRef("indicateurRegionSortie.cfd", "=", "demande.cfd")
        .onRef("indicateurRegionSortie.codeRegion", "=", "demande.codeRegion")
        .onRef("indicateurRegionSortie.codeDispositif", "=", "demande.codeDispositif")
        .on("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
        .on(isScolaireIndicateurRegionSortie)
    )
    .leftJoin("user", "user.id", "demande.createdBy")
    .select((eb) => [
      eb.fn.count<number>("correction.id").over().as("count"),
      "demande.uai",
      "demande.cfd",
      "demande.codeDispositif",
      "demande.codeRegion",
      sql<string>`
        CONCAT(
          ${eb.ref("user.firstname")},
          ' ',
          ${eb.ref("user.lastname")}
        )`.as("userName"),
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
      selectTauxInsertion6mois("indicateurRegionSortie").as("tauxInsertionRegional"),
      selectTauxPoursuite("indicateurRegionSortie").as("tauxPoursuiteRegional"),
      selectTauxDevenirFavorable("indicateurRegionSortie").as("tauxDevenirFavorableRegional"),
      selectTauxPressionParFormationEtParRegionDemande({
        eb,
        rentreeScolaire: CURRENT_RENTREE,
      }).as("tauxPressionRegional"),
      nbEtablissementFormationRegion({
        eb,
        rentreeScolaire: CURRENT_RENTREE,
      }).as("nbEtablissement"),
      eb.fn
        .coalesce(
          sql<number>`
            ${eb.ref("correction.capaciteScolaire")} -
            ${eb.ref("demande.capaciteScolaire")}
          `,
          eb.val(0)
        )
        .as("ecartScolaire"),

      eb.fn
        .coalesce(
          sql<number>`
            ${eb.ref("correction.capaciteApprentissage")} -
            ${eb.ref("demande.capaciteApprentissage")}
          `,
          eb.val(0)
        )
        .as("ecartApprentissage"),
      "correction.capaciteScolaire as capaciteScolaireCorrigee",
      "correction.capaciteApprentissage as capaciteApprentissageCorrigee",
      "correction.intentionNumero",
      "correction.raison as raisonCorrection",
      "correction.motif as motifCorrection",
      "correction.autreMotif as autreMotifCorrection",
      "correction.createdAt",
      "correction.updatedAt",
      "correction.commentaire",
      isFormationActionPrioritaireDemande(eb).as("isFormationActionPrioritaire"),
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
      if (codeNiveauDiplome) return eb.where("dataFormation.codeNiveauDiplome", "in", codeNiveauDiplome);
      return eb;
    })
    .$call((eb) => {
      if (codeNsf) return eb.where("dataFormation.codeNsf", "in", codeNsf);
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
      if (formationSpecifique?.length) {
        if (formationSpecifique.includes(TypeFormationSpecifiqueEnum["Action prioritaire"])) {
          return q.innerJoin("actionPrioritaire", (join) =>
            join
              .onRef("actionPrioritaire.cfd", "=", "demande.cfd")
              .onRef("actionPrioritaire.codeDispositif", "=", "demande.codeDispositif")
              .onRef("actionPrioritaire.codeRegion", "=", "demande.codeRegion")
          );
        }
      }
      return q;
    })
    .$call((q) => {
      if (!orderBy || !order) return q;
      return q.orderBy(sql`${sql.ref(orderBy)}`, sql`${sql.raw(order)} NULLS LAST`);
    })
    .where(isDemandeSelectable({ user }))
    .where(isDemandeNotDeleted)
    .offset(offset)
    .limit(limit)
    .execute();

  const campagnes = await getKbdClient().selectFrom("campagne").selectAll().orderBy("annee desc").execute();

  return {
    corrections: corrections.map((correction) =>
      cleanNull({
        ...correction,
        createdAt: correction.createdAt?.toISOString(),
        updatedAt: correction.updatedAt?.toISOString(),
        formationSpecifique: {
          isFormationActionPrioritaire: !!correction.isFormationActionPrioritaire,
        },
      })
    ),
    campagnes: campagnes.map(cleanNull),
    count: corrections[0]?.count || 0,
  };
};
