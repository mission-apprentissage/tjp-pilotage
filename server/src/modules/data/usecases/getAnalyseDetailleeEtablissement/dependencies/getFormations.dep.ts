import { sql } from "kysely";

import { cleanNull } from "../../../../../utils/noNull";
import { getBase } from "./base.dep";

export const getFormations = async ({
  uai,
  codeNiveauDiplome,
}: {
  uai: string;
  codeNiveauDiplome?: string[];
}) =>
  getBase({ uai })
    .select((eb) => [
      sql<string>`CONCAT(
        ${eb.ref("dataEtablissement.uai")},
        ${eb.ref("dataFormation.cfd")},
        COALESCE(${eb.ref("formationEtablissement.dispositifId")},''),
        ${eb.ref("formationEtablissement.voie")}
      )`.as("offre"),
      "libelleNiveauDiplome",
      "libelleFormation",
      "voie",
      "libelleDispositif",
      "dataFormation.codeNiveauDiplome",
      "dataFormation.cfd",
      "codeDispositif",
      "dataFormation.typeFamille",
    ])
    .orderBy([
      "libelleNiveauDiplome asc",
      "libelleFormation asc",
      "libelleDispositif",
    ])
    .$call((q) => {
      if (codeNiveauDiplome?.length)
        return q.where(
          "dataFormation.codeNiveauDiplome",
          "in",
          codeNiveauDiplome
        );
      return q;
    })
    .execute()
    .then(cleanNull);
