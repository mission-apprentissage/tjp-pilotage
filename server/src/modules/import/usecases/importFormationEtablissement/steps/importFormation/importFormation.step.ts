import { inject } from "@/utils/inject";

import { createFormation } from "./createFormation.dep";
import { findDataFormation } from "./findDataFormation.dep";

export const [importFormation] = inject(
  {
    createFormation,
    findDataFormation,
  },
  (deps) =>
    async ({ cfd }: { cfd: string }) => {
      const dataFormation = await deps.findDataFormation(cfd);
      if (!dataFormation) return;

      if (!dataFormation.dateOuverture) return;
      const formation = {
        codeFormationDiplome: dataFormation.cfd,
        rncp: dataFormation.rncp,
        libelleFormation: dataFormation.libelleFormation ?? "",
        codeNiveauDiplome: dataFormation.codeNiveauDiplome,
        dateOuverture: dataFormation.dateOuverture,
        dateFermeture: dataFormation.dateFermeture,
        libelleFiliere: dataFormation.libelleNsf,
        CPC: dataFormation.cpc,
        cpcSecteur: dataFormation.cpcSecteur,
        cpcSousSecteur: dataFormation.cpcSousSecteur,
      };
      await deps.createFormation(formation);
      return formation;
    }
);
