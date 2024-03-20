import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";
import { z } from "zod";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import {
  countFermetures,
  countFermeturesApprentissage,
  countFermeturesSco,
  countOuvertures,
  countOuverturesApprentissage,
  countOuverturesSco,
} from "../../../utils/countCapacite";
import { isDemandeNotDeleted } from "../../../utils/isDemandeSelectable";
import { isIntentionVisible } from "../../../utils/isIntentionVisible";
import { countRestitutionIntentionsStatsSchema } from "./countRestitutionIntentionsStats.schema";

export interface Filters
  extends z.infer<typeof countRestitutionIntentionsStatsSchema.querystring> {
  user: RequestUser;
}

const countRestitutionIntentionsStatsInDB = async ({
  statut,
  codeRegion,
  rentreeScolaire,
  typeDemande,
  motif,
  cfd,
  codeNiveauDiplome,
  codeDispositif,
  CPC,
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
  codeNsf,
}: Filters) => {
  const countDemandes = await kdb
    .selectFrom("demande")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("familleMetier", "familleMetier.cfd", "demande.cfd")
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`
        COALESCE(
          SUM(
            ${countOuvertures(eb)} +
            ${countFermetures(eb)}
          ),
          0
        )`,
        scolaire: sql<number>`
        COALESCE(
          SUM(
            ${countOuverturesSco(eb)} +
            ${countFermeturesSco(eb)}
          ),
          0
        )`,
        apprentissage: sql<number>`
        COALESCE(
          SUM(
            ${countOuverturesApprentissage(eb)} +
            ${countFermeturesApprentissage(eb)}
          ),
          0
        )`,
      }).as("total")
    )
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`COALESCE(SUM(${countOuvertures(eb)}),0)`,
        scolaire: sql<number>`COALESCE(SUM(${countOuverturesSco(eb)}),0)`,
        apprentissage: sql<number>`COALESCE(
          SUM(${countOuverturesApprentissage(eb)}),0
        )`,
      }).as("ouvertures")
    )
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`COALESCE(SUM(${countFermetures(eb)}),0)`,
        scolaire: sql<number>`COALESCE(SUM(${countFermeturesSco(eb)}),0)`,
        apprentissage: sql<number>`COALESCE(
          SUM(${countFermeturesApprentissage(eb)}),0
        )`,
      }).as("fermetures")
    )
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`
        COALESCE(
          SUM(
            CASE WHEN
            ${eb.ref("demande.amiCma")} = true
            THEN ${countOuvertures(eb)}
            ELSE 0
            END
          ),
          0
        )`,
        scolaire: sql<number>`
        COALESCE(
          SUM(
            CASE WHEN
            ${eb.ref("demande.amiCma")} = true
            THEN ${countOuverturesSco(eb)}
            ELSE 0
            END
          ),
          0
        )`,
        apprentissage: sql<number>`
        COALESCE(
          SUM(
            CASE WHEN
            ${eb.ref("demande.amiCma")} = true
            THEN ${countOuverturesApprentissage(eb)}
            ELSE 0
            END
          ),
          0
        )`,
      }).as("amiCMAs")
    )
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`
        COALESCE(
          SUM(
            CASE WHEN
            ${eb.ref(
              "dataFormation.codeNiveauDiplome"
            )} IN ('381', '481', '581')
            THEN ${countOuvertures(eb)}
            ELSE 0
            END
          ),
          0
        )`,
        scolaire: sql<number>`
        COALESCE(
          SUM(
            CASE WHEN
            ${eb.ref(
              "dataFormation.codeNiveauDiplome"
            )} IN ('381', '481', '581')
            THEN ${countOuverturesSco(eb)}
            ELSE 0
            END
          ),
          0
        )`,
        apprentissage: sql<number>`
        COALESCE(
          SUM(
            CASE WHEN
            ${eb.ref(
              "dataFormation.codeNiveauDiplome"
            )} IN ('381', '481', '581')
            THEN ${countOuverturesApprentissage(eb)}
            ELSE 0
            END
          ),
          0
        )`,
      }).as("FCILs")
    )
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
      if (codeDispositif)
        return eb.where("demande.codeDispositif", "in", codeDispositif);
      return eb;
    })
    .$call((eb) => {
      if (CPC) return eb.where("dataFormation.cpc", "in", CPC);
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
    .$call((eb) => {
      if (codeNsf && codeNsf.length > 0) {
        return eb.where("dataFormation.codeNsf", "in", codeNsf);
      }

      return eb;
    })
    .where(isDemandeNotDeleted)
    .where(isIntentionVisible({ user }))
    .executeTakeFirstOrThrow()
    .then(cleanNull);

  return countDemandes;
};

export const dependencies = {
  countRestitutionIntentionsStatsInDB,
};
