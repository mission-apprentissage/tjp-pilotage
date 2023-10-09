import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";

import { kdb } from "../../../db/db";
import { RequestUser } from "../../core/model/User";
import {
  countDifferenceCapaciteAbs,
  countDifferenceCapaciteApprentissageAbs,
  countDifferenceCapaciteScolaireAbs,
} from "./utils/countCapacite.query";
import { isDemandeSelectable } from "./utils/isDemandeSelectable.query";

export const countStatsDemandes = async ({
  user,
  codeRegion,
  rentreeScolaire,
}: {
  user: Pick<RequestUser, "id" | "role" | "codeRegion">;
  codeRegion?: string[];
  rentreeScolaire?: string;
}) => {
  const countDemandes = await kdb
    .selectFrom("demande")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .$call((eb) => {
      if (codeRegion) return eb.where("demande.codeRegion", "in", codeRegion);
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
    .select((eb) =>
      jsonBuildObject({
        total: sql<number>`SUM(${countDifferenceCapaciteAbs(eb)})`,
        scolaire: sql<number>`SUM(${countDifferenceCapaciteScolaireAbs(eb)})`,
        apprentissage: sql<number>`SUM(${countDifferenceCapaciteApprentissageAbs(
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
          THEN ${countDifferenceCapaciteAbs(eb)}
          ELSE 0
          END
        )`,
        scolaire: sql<number>`SUM(
          CASE WHEN
          ${eb.ref(
            "demande.typeDemande"
          )} IN ('ouverture_nette','ouverture_compensation')
          THEN ${countDifferenceCapaciteScolaireAbs(eb)}
          ELSE 0
          END
        )`,
        apprentissage: sql<number>`SUM(
          CASE WHEN
          ${eb.ref(
            "demande.typeDemande"
          )} IN ('ouverture_nette','ouverture_compensation')
          THEN ${countDifferenceCapaciteApprentissageAbs(eb)}
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
        THEN ${countDifferenceCapaciteAbs(eb)}
        ELSE 0
        END
      )`,
        scolaire: sql<number>`SUM(
        CASE WHEN
        ${eb.ref("demande.typeDemande")} = 'fermeture'
        THEN ${countDifferenceCapaciteScolaireAbs(eb)}
        ELSE 0
        END
      )`,
        apprentissage: sql<number>`SUM(
        CASE WHEN
        ${eb.ref("demande.typeDemande")} = 'fermeture'
        THEN ${countDifferenceCapaciteApprentissageAbs(eb)}
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
          THEN ${countDifferenceCapaciteAbs(eb)}
          ELSE 0
          END
        )`,
        scolaire: sql<number>`SUM(
          CASE WHEN
          ${eb.ref(
            "demande.typeDemande"
          )} IN ('augmentation_nette','augmentation_compensation')
          THEN ${countDifferenceCapaciteScolaireAbs(eb)}
          ELSE 0
          END
        )`,
        apprentissage: sql<number>`SUM(
          CASE WHEN
          ${eb.ref(
            "demande.typeDemande"
          )} IN ('augmentation_nette','augmentation_compensation')
          THEN ${countDifferenceCapaciteApprentissageAbs(eb)}
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
      THEN ${countDifferenceCapaciteAbs(eb)}
      ELSE 0
      END
    )`,
        scolaire: sql<number>`SUM(
      CASE WHEN
      ${eb.ref("demande.typeDemande")} = 'diminution'
      THEN ${countDifferenceCapaciteScolaireAbs(eb)}
      ELSE 0
      END
    )`,
        apprentissage: sql<number>`SUM(
      CASE WHEN
      ${eb.ref("demande.typeDemande")} = 'diminution'
      THEN ${countDifferenceCapaciteApprentissageAbs(eb)}
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
      THEN ${countDifferenceCapaciteAbs(eb)}
      ELSE 0
      END
    )`,
        scolaire: sql<number>`SUM(
      CASE WHEN
      ${eb.ref("demande.amiCma")} = true
      THEN ${countDifferenceCapaciteScolaireAbs(eb)}
      ELSE 0
      END
    )`,
        apprentissage: sql<number>`SUM(
      CASE WHEN
      ${eb.ref("demande.amiCma")} = true
      THEN ${countDifferenceCapaciteApprentissageAbs(eb)}
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
          THEN ${countDifferenceCapaciteAbs(eb)}
          ELSE 0
          END
        )`,
        scolaire: sql<number>`SUM(
          CASE WHEN
          ${eb.ref("dataFormation.codeNiveauDiplome")} IN ('381', '481', '581')
          THEN ${countDifferenceCapaciteScolaireAbs(eb)}
          ELSE 0
          END
        )`,
        apprentissage: sql<number>`SUM(
          CASE WHEN
          ${eb.ref("dataFormation.codeNiveauDiplome")} IN ('381', '481', '581')
          THEN ${countDifferenceCapaciteApprentissageAbs(eb)}
          ELSE 0
          END
        )`,
      }).as("FCILs")
    )
    .where(isDemandeSelectable({ user }))
    .executeTakeFirstOrThrow();

  return countDemandes;
};
