import { sql } from "kysely";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { getKbdClient } from "@/db/db";
import {
  countDifferenceCapaciteApprentissage,
  countDifferenceCapaciteScolaire,
} from "@/modules/utils/countCapaciteNew";
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
    .selectFrom("latestDemandeIntentionView as demande")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .where("statut", "=", DemandeStatutEnum["demande validée"])
    .where("cfd", "=", cfd)
    .select((eb) => [
      eb.ref("demande.rentreeScolaire").as("rentreeScolaire"),
      sql<number>`sum(${countDifferenceCapaciteScolaire({ eb })})`.as("scolaire"),
      sql<number>`sum(${countDifferenceCapaciteApprentissage({ eb })})`.as("apprentissage"),
    ])
    .$call((qb) => {
      if (codeRegion) {
        qb = qb.where("dataEtablissement.codeRegion", "=", codeRegion);
      }

      if (codeAcademie) {
        qb = qb.where("dataEtablissement.codeAcademie", "=", codeAcademie);
      }

      if (codeDepartement) {
        qb = qb.where("dataEtablissement.codeDepartement", "=", codeDepartement);
      }

      return qb;
    })
    .groupBy(["rentreeScolaire"])
    .orderBy(["rentreeScolaire"])
    .execute()
    .then(cleanNull);
