import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";

import { kdb } from "../../../db/db";
import { RequestUser } from "../../core/model/User";
import {
  countDifferenceCapacite,
  countDifferenceCapaciteApprentissage,
  countDifferenceCapaciteScolaire,
} from "./utils/countCapacite.query";
import { isDemandeSelectable } from "./utils/isDemandeSelectable.query";

export const countStatsDemandes = async ({
  user,
  codeRegion,
  rentreeScolaire,
}: {
  user: Pick<RequestUser, "id" | "role" | "codeRegion">;
  codeRegion?: string[];
  rentreeScolaire?: string[];
}) => {
  const countDemandes = await kdb
    .selectFrom("demande")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .$call((eb) => {
      if (codeRegion) return eb.where("demande.codeRegion", "in", codeRegion);
      return eb;
    })
    .$call((eb) => {
      if (rentreeScolaire)
        return eb.where(
          "demande.rentreeScolaire",
          "in",
          rentreeScolaire.map(parseInt)
        );
      return eb;
    })
    .select((eb) =>
      jsonBuildObject({
        total: sql<string>`SUM(${countDifferenceCapacite(eb)})`,
        scolaire: sql<string>`SUM(${countDifferenceCapaciteScolaire(eb)})`,
        apprentissage: sql<string>`SUM(${countDifferenceCapaciteApprentissage(
          eb
        )})`,
      }).as("total")
    )
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`SUM(
          CASE WHEN
          ${eb.ref(
            "demande.typeDemande"
          )} IN ('ouverture_nette','ouverture_compensation')
          THEN ${countDifferenceCapacite(eb)}
          ELSE 0
          END
        )`,
        scolaire: sql<number>`SUM(
          CASE WHEN
          ${eb.ref(
            "demande.typeDemande"
          )} IN ('ouverture_nette','ouverture_compensation')
          THEN ${countDifferenceCapaciteScolaire(eb)}
          ELSE 0
          END
        )`,
        apprentissage: sql<number>`SUM(
          CASE WHEN
          ${eb.ref(
            "demande.typeDemande"
          )} IN ('ouverture_nette','ouverture_compensation')
          THEN ${countDifferenceCapaciteApprentissage(eb)}
          ELSE 0
          END
        )`,
      }).as("ouvertures")
    )
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`SUM(
        CASE WHEN
        ${eb.ref("demande.typeDemande")} = 'fermeture'
        THEN ${countDifferenceCapacite(eb)}
        ELSE 0
        END
      )`,
        scolaire: sql<number>`SUM(
        CASE WHEN
        ${eb.ref("demande.typeDemande")} = 'fermeture'
        THEN ${countDifferenceCapaciteScolaire(eb)}
        ELSE 0
        END
      )`,
        apprentissage: sql<number>`SUM(
        CASE WHEN
        ${eb.ref("demande.typeDemande")} = 'fermeture'
        THEN ${countDifferenceCapaciteApprentissage(eb)}
        ELSE 0
        END
      )`,
      }).as("fermetures")
    )
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`SUM(
          CASE WHEN
          ${eb.ref(
            "demande.typeDemande"
          )} IN ('augmentation_nette','augmentation_compensation')
          THEN ${countDifferenceCapacite(eb)}
          ELSE 0
          END
        )`,
        scolaire: sql<number>`SUM(
          CASE WHEN
          ${eb.ref(
            "demande.typeDemande"
          )} IN ('augmentation_nette','augmentation_compensation')
          THEN ${countDifferenceCapaciteScolaire(eb)}
          ELSE 0
          END
        )`,
        apprentissage: sql<number>`SUM(
          CASE WHEN
          ${eb.ref(
            "demande.typeDemande"
          )} IN ('augmentation_nette','augmentation_compensation')
          THEN ${countDifferenceCapaciteApprentissage(eb)}
          ELSE 0
          END
        )`,
      }).as("augmentations")
    )
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`SUM(
      CASE WHEN
      ${eb.ref("demande.typeDemande")} = 'diminution'
      THEN ${countDifferenceCapacite(eb)}
      ELSE 0
      END
    )`,
        scolaire: sql<number>`SUM(
      CASE WHEN
      ${eb.ref("demande.typeDemande")} = 'diminution'
      THEN ${countDifferenceCapaciteScolaire(eb)}
      ELSE 0
      END
    )`,
        apprentissage: sql<number>`SUM(
      CASE WHEN
      ${eb.ref("demande.typeDemande")} = 'diminution'
      THEN ${countDifferenceCapaciteApprentissage(eb)}
      ELSE 0
      END
    )`,
      }).as("diminutions")
    )
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`SUM(
      CASE WHEN
      ${eb.ref("demande.amiCma")} = true
      THEN ${countDifferenceCapacite(eb)}
      ELSE 0
      END
    )`,
        scolaire: sql<number>`SUM(
      CASE WHEN
      ${eb.ref("demande.amiCma")} = true
      THEN ${countDifferenceCapaciteScolaire(eb)}
      ELSE 0
      END
    )`,
        apprentissage: sql<number>`SUM(
      CASE WHEN
      ${eb.ref("demande.amiCma")} = true
      THEN ${countDifferenceCapaciteApprentissage(eb)}
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
          THEN ${countDifferenceCapacite(eb)}
          ELSE 0
          END
        )`,
        scolaire: sql<number>`SUM(
          CASE WHEN
          ${eb.ref("dataFormation.codeNiveauDiplome")} IN ('381', '481', '581')
          THEN ${countDifferenceCapaciteScolaire(eb)}
          ELSE 0
          END
        )`,
        apprentissage: sql<number>`SUM(
          CASE WHEN
          ${eb.ref("dataFormation.codeNiveauDiplome")} IN ('381', '481', '581')
          THEN ${countDifferenceCapaciteApprentissage(eb)}
          ELSE 0
          END
        )`,
      }).as("FCILs")
    )
    .where(isDemandeSelectable({ user }))
    .executeTakeFirstOrThrow();

  return countDemandes;
};
