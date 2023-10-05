import { sql } from "kysely";

import { kdb } from "../../../db/db";
import { RequestUser } from "../../core/model/User";
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
    .select((eb) => sql<string>`count(${eb.ref("demande.id")})`.as("total"))
    .select((eb) =>
      sql<string>`SUM(CASE WHEN ${eb.ref(
        "demande.status"
      )} = 'draft' THEN 1 ELSE 0 END)`.as("draft")
    )
    .select((eb) =>
      sql<string>`SUM(CASE WHEN ${eb.ref(
        "demande.status"
      )} = 'submitted' THEN 1 ELSE 0 END)`.as("submitted")
    )
    .select((eb) =>
      sql<string>`SUM(CASE WHEN ${eb.ref(
        "demande.typeDemande"
      )} IN ('ouverture_nette','ouverture_compensation') THEN 1 ELSE 0 END)`.as(
        "ouvertures"
      )
    )
    .select((eb) =>
      sql<string>`SUM(CASE WHEN ${eb.ref(
        "demande.typeDemande"
      )} = 'fermeture' THEN 1 ELSE 0 END)`.as("fermetures")
    )
    .select((eb) =>
      sql<string>`SUM(CASE WHEN ${eb.ref(
        "demande.typeDemande"
      )} IN ('augmentation_nette','augmentation_compensation') THEN 1 ELSE 0 END)`.as(
        "augmentations"
      )
    )
    .select((eb) =>
      sql<string>`SUM(CASE WHEN ${eb.ref(
        "demande.typeDemande"
      )} = 'diminution' THEN 1 ELSE 0 END)`.as("diminutions")
    )
    .select((eb) =>
      sql<string>`SUM(CASE WHEN ${eb.ref(
        "demande.amiCma"
      )} = true THEN 1 ELSE 0 END)`.as("amiCMAs")
    )
    .select((eb) =>
      sql<string>`SUM(CASE WHEN ${eb.ref(
        "dataFormation.codeNiveauDiplome"
      )} in ('381', '481', '581') THEN 1 ELSE 0 END)`.as("FCILs")
    )
    .where(isDemandeSelectable({ user }))
    .executeTakeFirstOrThrow();

  return countDemandes;
};
