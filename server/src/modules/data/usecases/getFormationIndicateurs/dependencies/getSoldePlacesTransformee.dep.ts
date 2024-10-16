import { sql } from "kysely";

import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const getSoldePlacesTransformee = async ({
  cfd,
  codeRegion,
  codeAcademie,
  codeDepartement,
}: {
  cfd: string;
  codeRegion?: string;
  codeAcademie?: string;
  codeDepartement?: string;
}) =>
  getKbdClient()
    .selectFrom("latestDemandeIntentionView")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "latestDemandeIntentionView.uai")
    .where("statut", "=", "demande validée")
    .where("cfd", "=", cfd)
    .select((sb) => [
      sb.ref("latestDemandeIntentionView.rentreeScolaire").as("rentreeScolaire"),
      sql<number>`sum(${sb.ref("latestDemandeIntentionView.capaciteScolaire")} - ${sb.ref(
        "latestDemandeIntentionView.capaciteScolaireActuelle"
      )})`.as("scolaire"),
      sql<number>`sum(${sb.ref("latestDemandeIntentionView.capaciteApprentissage")} - ${sb.ref(
        "latestDemandeIntentionView.capaciteApprentissageActuelle"
      )})`.as("apprentissage"),
    ])
    .$if(!!codeRegion, (qb) => qb.where("dataEtablissement.codeRegion", "=", codeRegion!))
    .$if(!!codeAcademie, (qb) => qb.where("dataEtablissement.codeAcademie", "=", codeAcademie!))
    .$if(!!codeDepartement, (qb) => qb.where("dataEtablissement.codeDepartement", "=", codeDepartement!))
    .groupBy(["rentreeScolaire"])
    .orderBy(["rentreeScolaire"])
    .execute()
    .then(cleanNull);
