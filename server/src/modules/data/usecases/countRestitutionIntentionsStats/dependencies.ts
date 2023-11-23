import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";

import { kdb } from "../../../../db/db";
import { RequestUser } from "../../../core/model/User";
import {
  countFermetures,
  countFermeturesApprentissage,
  countFermeturesSco,
  countOuvertures,
  countOuverturesApprentissage,
  countOuverturesSco,
} from "../../../utils/countCapacite";
import { isIntentionVisible } from "../../../utils/isIntentionVisible";

const countRestitutionIntentionsStatsInDB = async ({
  status,
  codeRegion,
  rentreeScolaire,
  typeDemande,
  motif,
  cfd,
  codeNiveauDiplome,
  dispositif,
  filiere,
  coloration,
  amiCMA,
  secteur,
  cfdFamille,
  codeDepartement,
  codeAcademie,
  commune,
  uai,
  compensation,
  user,
  voie,
}: {
  status?: "draft" | "submitted";
  codeRegion?: string[];
  rentreeScolaire?: string;
  typeDemande?: string[];
  motif?: string[];
  cfd?: string[];
  codeNiveauDiplome?: string[];
  dispositif?: string[];
  filiere?: string[];
  coloration?: string;
  amiCMA?: string;
  secteur?: string;
  cfdFamille?: string[];
  codeDepartement?: string[];
  codeAcademie?: string[];
  commune?: string[];
  uai?: string[];
  compensation?: string;
  user: Pick<RequestUser, "id" | "role" | "codeRegion">;
  voie?: "scolaire" | "apprentissage";
}) => {
  const countDemandes = await kdb
    .selectFrom("demande")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("familleMetier", "familleMetier.cfdSpecialite", "demande.cfd")
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`SUM(${countOuvertures(eb)} + ${countFermetures(
          eb
        )})`,
        scolaire: sql<number>`SUM(${countOuverturesSco(
          eb
        )} + ${countFermeturesSco(eb)})`,
        apprentissage: sql<number>`SUM(${countOuverturesApprentissage(
          eb
        )} + ${countFermeturesApprentissage(eb)})`,
      }).as("total")
    )
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`SUM(${countOuvertures(eb)})`,
        scolaire: sql<number>`SUM(${countOuverturesSco(eb)})`,
        apprentissage: sql<number>`SUM(${countOuverturesApprentissage(eb)})`,
      }).as("ouvertures")
    )
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`SUM(${countFermetures(eb)})`,
        scolaire: sql<number>`SUM(${countFermeturesSco(eb)})`,
        apprentissage: sql<number>`SUM(${countFermeturesApprentissage(eb)})`,
      }).as("fermetures")
    )
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`SUM(
      CASE WHEN
      ${eb.ref("demande.amiCma")} = true
      THEN ${countOuvertures(eb)}
      ELSE 0
      END
    )`,
        scolaire: sql<number>`SUM(
      CASE WHEN
      ${eb.ref("demande.amiCma")} = true
      THEN ${countOuverturesSco(eb)}
      ELSE 0
      END
    )`,
        apprentissage: sql<number>`SUM(
      CASE WHEN
      ${eb.ref("demande.amiCma")} = true
      THEN ${countOuverturesApprentissage(eb)}
      ELSE 0
      END
    )`,
      }).as("amiCMAs")
    )
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`SUM(
          CASE WHEN
          ${eb.ref("dataFormation.codeNiveauDiplome")} IN ('381', '481', '581')
          THEN ${countOuvertures(eb)}
          ELSE 0
          END
        )`,
        scolaire: sql<number>`SUM(
          CASE WHEN
          ${eb.ref("dataFormation.codeNiveauDiplome")} IN ('381', '481', '581')
          THEN ${countOuverturesSco(eb)}
          ELSE 0
          END
        )`,
        apprentissage: sql<number>`SUM(
          CASE WHEN
          ${eb.ref("dataFormation.codeNiveauDiplome")} IN ('381', '481', '581')
          THEN ${countOuverturesApprentissage(eb)}
          ELSE 0
          END
        )`,
      }).as("FCILs")
    )
    .$call((eb) => {
      if (status && status != undefined)
        return eb.where("demande.status", "=", status);
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
      if (commune) return eb.where("dataEtablissement.commune", "in", commune);
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
      if (motif)
        return eb.where((eb) =>
          eb.or(
            motif.map(
              (m) => sql<boolean>`${m} = any(${eb.ref("demande.motif")})`
            )
          )
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
      if (dispositif) return eb.where("demande.dispositifId", "in", dispositif);
      return eb;
    })
    .$call((eb) => {
      if (filiere)
        return eb.where("dataFormation.libelleFiliere", "in", filiere);
      return eb;
    })
    .$call((eb) => {
      if (cfdFamille)
        return eb.where("familleMetier.cfdFamille", "in", cfdFamille);
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
      if (compensation)
        return eb.where("demande.typeDemande", "in", [
          "ouverture_compensation",
          "augmentation_compensation",
        ]);
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
    .where(isIntentionVisible({ user }))
    .executeTakeFirstOrThrow();

  return countDemandes;
};

export const dependencies = {
  countRestitutionIntentionsStatsInDB,
};
