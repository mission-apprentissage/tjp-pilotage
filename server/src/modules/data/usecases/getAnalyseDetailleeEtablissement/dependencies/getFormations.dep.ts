import { sql } from "kysely";
import { z } from "zod";

import { cleanNull } from "../../../../../utils/noNull";
import { FormationSchema } from "../getAnalyseDetailleeEtablissement.schema";
import { getBase } from "./base.dep";

export const getFormations = async ({
  uai,
  codeNiveauDiplome,
  voie,
}: {
  uai: string;
  codeNiveauDiplome?: string[];
  voie?: string[];
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
      "dataFormation.dateOuverture",
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
        q = q.where("dataFormation.codeNiveauDiplome", "in", codeNiveauDiplome);

      if (voie?.length) {
        q = q.where("formationEtablissement.voie", "in", voie);
      }

      return q;
    })
    .$castTo<z.infer<typeof FormationSchema>>()
    .execute()
    .then(cleanNull);
