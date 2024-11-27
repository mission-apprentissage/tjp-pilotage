import { sql } from "kysely";
import type { Voie } from "shared/enum/voieEnum";

import { isFormationActionPrioritaireDataEtablissement } from "@/modules/utils/isFormationActionPrioritaire";
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
      isFormationActionPrioritaireDataEtablissement(eb).as("isFormationActionPrioritaire"),
    ])
    .$narrowType<{ voie: Voie }>()
    .orderBy(["libelleNiveauDiplome asc", "libelleFormation asc", "libelleDispositif"])
    .execute()
    .then((formations) =>
      formations.map((formation) =>
        cleanNull({
          ...formation,
          formationSpecifique: {
            isFormationActionPrioritaire: !!formation.isFormationActionPrioritaire,
          },
        })
      )
    );
