import { sql } from "kysely";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import type { TypeFamille } from "shared/enum/typeFamilleEnum";
import type { VoieType } from "shared/enum/voieEnum";

import { formatFormationSpecifique } from "@/modules/utils/formatFormationSpecifique";
import { isFormationActionPrioritaire } from "@/modules/utils/isFormationActionPrioritaire";
import { isFormationRenovee } from "@/modules/utils/isFormationRenovee";
import { cleanNull } from "@/utils/noNull";

import { getBase } from "./base.dep";

export const getFormations = async ({ uai }: { uai: string }) =>
  getBase({ uai })
    .select((eb) => [
      sql<string>`
      CONCAT(
        ${eb.ref("formationEtablissement.uai")},
        ${eb.ref("formationEtablissement.cfd")},
        COALESCE(${eb.ref("formationEtablissement.codeDispositif")}, ''),
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
      isFormationActionPrioritaire({
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.codeDispositif",
        codeRegionRef: "dataEtablissement.codeRegion",
      }).as(TypeFormationSpecifiqueEnum["Action prioritaire"]),
      eb.ref("formationView.isTransitionDemographique").as(TypeFormationSpecifiqueEnum["Transition démographique"]),
      eb.ref("formationView.isTransitionEcologique").as(TypeFormationSpecifiqueEnum["Transition écologique"]),
      eb.ref("formationView.isTransitionNumerique").as(TypeFormationSpecifiqueEnum["Transition numérique"]),
      isFormationRenovee({eb}).as("isFormationRenovee"),
    ])
    .$narrowType<{
      voie: VoieType;
      typeFamille: TypeFamille;
    }>()
    .orderBy(["libelleNiveauDiplome asc", "libelleFormation asc", "libelleDispositif"])
    .execute()
    .then(cleanNull)
    .then((formations) =>
      formations.map((formation) => ({
        ...formation,
        formationSpecifique: formatFormationSpecifique(formation),
        isFormationRenovee: !!formation.isFormationRenovee,
      }))
    );
