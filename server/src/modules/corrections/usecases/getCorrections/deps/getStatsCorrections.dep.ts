import { sql } from "kysely";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import { RaisonCorrectionEnum } from "shared/enum/raisonCorrectionEnum";

import { getKbdClient } from "@/db/db";
import type { Filters } from "@/modules/corrections/usecases/getCorrections/getCorrections.usecase";
import { isDemandeSelectable } from "@/modules/utils/isDemandeSelectable";
import { getNormalizedSearchArray } from "@/modules/utils/normalizeSearch";

export const getStatsCorrectionsQuery = async ({
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
  formationSpecifique,
  search,
}: Filters) => {
  const search_array = getNormalizedSearchArray(search);

  const statsCorrections = await getKbdClient()
    .selectFrom("correction")
    .innerJoin("latestDemandeView as demande", "demande.numero", "correction.intentionNumero")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demande.campagneId").$call((eb) => {
        if (campagne) return eb.on("campagne.annee", "=", campagne);
        return eb;
      })
    )
    .leftJoin("formationScolaireView as formationView", "formationView.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("departement", "departement.codeDepartement", "dataEtablissement.codeDepartement")
    .leftJoin("academie", "academie.codeAcademie", "dataEtablissement.codeAcademie")
    .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .leftJoin("dispositif", "dispositif.codeDispositif", "demande.codeDispositif")
    .leftJoin("user", "user.id", "demande.createdBy")
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
    .leftJoin("nsf", "nsf.codeNsf", "formationView.codeNsf")
    .select((eb) => [
      eb.fn.count<number>("correction.id").as("nbCorrections"),
      eb.fn
        .coalesce(
          eb.fn.sum<number>(
            sql<number>`${eb.ref("correction.capaciteScolaire")}-${eb.ref("demande.capaciteScolaire")}`
          ),
          eb.val(0)
        )
        .as("ecartScolaire"),
      eb.fn
        .coalesce(
          eb.fn.sum<number>(
            sql<number>`
            ${eb.ref("correction.capaciteApprentissage")} -
            ${eb.ref("demande.capaciteApprentissage")}
          `
          ),
          eb.val(0)
        )
        .as("ecartApprentissage"),
      eb.fn
        .coalesce(
          eb.fn.sum<number>(
            eb.case().when("correction.raison", "=", RaisonCorrectionEnum["report"]).then(1).else(0).end()
          ),
          eb.val(0)
        )
        .as("nbReports"),
      eb.fn
        .coalesce(
          eb.fn.sum<number>(
            eb.case().when("correction.raison", "=", RaisonCorrectionEnum["annulation"]).then(1).else(0).end()
          ),
          eb.val(0)
        )
        .as("nbAnnulations"),
      eb.fn
        .coalesce(
          eb.fn.sum<number>(
            eb
              .case()
              .when("correction.raison", "=", RaisonCorrectionEnum["modification_capacite"])
              .then(1)
              .else(0)
              .end()
          ),
          eb.val(0)
        )
        .as("nbModifications"),
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
            sql<boolean>`ABS(
              ${ebw.ref("demande.capaciteApprentissage")} -
              ${ebw.ref("demande.capaciteApprentissageActuelle")}
            ) > 1`
        );
      }
      if (voie === "scolaire") {
        return eb.where(
          ({ eb: ebw }) =>
            sql<boolean>`ABS(
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
          return q.innerJoin("actionPrioritaire", (join) =>
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
    .where(isDemandeSelectable({ user }))
    .executeTakeFirstOrThrow();

  return statsCorrections;
};
