import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";

import { kdb } from "../../../db/db";
import { RequestUser } from "../../core/model/User";
import {
  countFermetures,
  countFermeturesApprentissage,
  countFermeturesSco,
  countOuvertures,
  countOuverturesApprentissage,
  countOuverturesSco,
} from "./utils/countCapacite.query";
import { isStatsDemandeVisible } from "./utils/isStatsDemandesVisible";

export const countStatsDemandes = async ({
  user,
  status,
  codeRegion,
  codeAcademie,
  codeDepartement,
  rentreeScolaire,
  codeNiveauDiplome,
  coloration,
  secteur,
}: {
  user: Pick<RequestUser, "id" | "role" | "codeRegion">;
  status?: "draft" | "submitted";
  codeRegion?: string[];
  codeAcademie?: string[];
  codeDepartement?: string[];
  rentreeScolaire?: string;
  codeNiveauDiplome?: string[];
  coloration?: string;
  secteur?: string;
}) => {
  const countDemandes = await kdb
    .selectFrom("demande")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .$call((eb) => {
      if (status && status != undefined) return eb.where("demande.status", "=", status);
      return eb;
    })
    .$call((eb) => {
      if (codeRegion) return eb.where("demande.codeRegion", "in", codeRegion);
      return eb;
    })
    .$call((eb) => {
      if (codeAcademie) return eb.where("dataEtablissement.codeAcademie", "in", codeAcademie);
      return eb;
    })
    .$call((eb) => {
      if (codeDepartement) return eb.where("dataEtablissement.codeDepartement", "in", codeDepartement);
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
      if (codeNiveauDiplome)
        return eb.where(
          "dataFormation.codeNiveauDiplome",
          "in",
          codeNiveauDiplome
        );
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
      if (secteur) return eb.where("dataEtablissement.secteur", "=", secteur);
      return eb;
    })
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
    .where(isStatsDemandeVisible({ user }))
    .executeTakeFirstOrThrow();

  return countDemandes;
};
