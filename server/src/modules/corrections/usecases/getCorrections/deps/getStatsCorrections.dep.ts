// @ts-nocheck -- TODO

import { sql } from "kysely";
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
  search,
}: Filters) => {
  const search_array = getNormalizedSearchArray(search);

  const statsCorrections = await getKbdClient
    .selectFrom("correction")
    .leftJoin("latestDemandeView as demande", "demande.numero", "correction.intentionNumero")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("departement", "departement.codeDepartement", "dataEtablissement.codeDepartement")
    .leftJoin("academie", "academie.codeAcademie", "dataEtablissement.codeAcademie")
    .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .leftJoin("dispositif", "dispositif.codeDispositif", "demande.codeDispositif")
    .leftJoin("user", "user.id", "demande.createdBy")
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "dataFormation.codeNiveauDiplome")
    .leftJoin("nsf", "nsf.codeNsf", "dataFormation.codeNsf")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demande.campagneId").$call((eb) => {
        if (campagne) return eb.on("campagne.annee", "=", campagne);
        return eb;
      })
    )
    .select((eb) => [
      eb.fn.count<number>("correction.id").as("nbCorrections"),
      sql<number>`SUM(${eb.ref("correction.capaciteScolaire")}-${eb.ref("demande.capaciteScolaire")})`.as(
        "ecartScolaire"
      ),
      sql<number>`SUM(${eb.ref("correction.capaciteApprentissage")}-${eb.ref("demande.capaciteApprentissage")})`.as(
        "ecartApprentissage"
      ),
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("correction.raison")} = ${RaisonCorrectionEnum["report"]} THEN 1 ELSE 0 END
        ),
      0)`.as("nbReports"),
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("correction.raison")} = ${RaisonCorrectionEnum["annulation"]} THEN 1 ELSE 0 END
        ),
      0)`.as("nbAnnulations"),
      sql<number>`COALESCE(
        SUM(
          CASE WHEN ${eb.ref("correction.raison")} = ${RaisonCorrectionEnum["modification_capacite"]} THEN 1 ELSE 0 END
        ),
      0)`.as("nbModifications"),
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
    .where(isDemandeSelectable({ user }))
    .executeTakeFirstOrThrow();

  return statsCorrections;
};
