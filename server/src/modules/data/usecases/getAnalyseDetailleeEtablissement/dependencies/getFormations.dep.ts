import { sql } from "kysely";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import type { Voie } from "shared/enum/voieEnum";

import { isFormationActionPrioritaireDataEtablissement } from "@/modules/utils/isFormationActionPrioritaire";
import { cleanNull } from "@/utils/noNull";

import { getBase } from "./base.dep";

export const getFormations = async ({ uai }: { uai: string }) =>
  getBase({ uai })
    .select((eb) => [
      sql<string>`CONCAT(
        ${eb.ref("formationEtablissement.uai")},
        ${eb.ref("formationEtablissement.cfd")},
        COALESCE(${eb.ref("formationEtablissement.codeDispositif")},''),
        ${eb.ref("formationEtablissement.voie")}
      )`.as("offre"),
      "formationEtablissement.voie",
      "formationEtablissement.cfd",
      "formationEtablissement.codeDispositif",
      "formationView.libelleFormation",
      "formationView.codeNiveauDiplome",
      "formationView.dateOuverture",
      "formationView.typeFamille",
      "dispositif.libelleDispositif",
      "niveauDiplome.libelleNiveauDiplome",
      isFormationActionPrioritaireDataEtablissement(eb).as(TypeFormationSpecifiqueEnum["Action prioritaire"]),
      eb.ref("formationView.isTransitionDemographique").as(TypeFormationSpecifiqueEnum["Transition démographique"]),
      eb.ref("formationView.isTransitionEcologique").as(TypeFormationSpecifiqueEnum["Transition écologique"]),
      eb.ref("formationView.isTransitionNumerique").as(TypeFormationSpecifiqueEnum["Transition numérique"]),
    ])
    .$narrowType<{ voie: Voie }>()
    .orderBy(["libelleNiveauDiplome asc", "libelleFormation asc", "libelleDispositif"])
    .execute()
    .then((formations) =>
      formations.map((formation) =>
        cleanNull({
          ...formation,
          formationSpecifique: {
            [TypeFormationSpecifiqueEnum["Action prioritaire"]]:
              !!formation[TypeFormationSpecifiqueEnum["Action prioritaire"]],
            [TypeFormationSpecifiqueEnum["Transition démographique"]]:
              !!formation[TypeFormationSpecifiqueEnum["Transition démographique"]],
            [TypeFormationSpecifiqueEnum["Transition écologique"]]:
              !!formation[TypeFormationSpecifiqueEnum["Transition écologique"]],
            [TypeFormationSpecifiqueEnum["Transition numérique"]]:
              !!formation[TypeFormationSpecifiqueEnum["Transition numérique"]],
          },
        })
      )
    );
