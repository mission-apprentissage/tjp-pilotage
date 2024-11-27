import { sql } from "kysely";
import type { FormationSchema } from "shared/routes/schemas/get.etablissement.uai.analyse-detaillee.schema";
import type { z } from "zod";

import { cleanNull } from "@/utils/noNull";

import { getBase } from "./base.dep";

export const getFormations = async ({ uai }: { uai: string }) =>
  getBase({ uai })
    .select((eb) => [
      sql<string>`CONCAT(
        ${eb.ref("dataEtablissement.uai")},
        ${eb.ref("dataFormation.cfd")},
        COALESCE(${eb.ref("formationEtablissement.codeDispositif")},''),
        ${eb.ref("formationEtablissement.voie")}
      )`.as("offre"),
      "libelleNiveauDiplome",
      "libelleFormation",
      "voie",
      "libelleDispositif",
      "dataFormation.codeNiveauDiplome",
      "dataFormation.cfd",
      "dataFormation.dateOuverture",
      "formationEtablissement.codeDispositif",
      "dataFormation.typeFamille",
      "dispositif.libelleDispositif",
    ])
    .orderBy(["libelleNiveauDiplome asc", "libelleFormation asc", "libelleDispositif"])
    .$castTo<z.infer<typeof FormationSchema>>()
    .execute()
    .then(cleanNull);
