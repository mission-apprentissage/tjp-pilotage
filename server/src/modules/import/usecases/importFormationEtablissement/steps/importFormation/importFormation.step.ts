import { inject } from "injecti";

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
        libelleDiplome: dataFormation.libelle ?? "",
        codeNiveauDiplome: dataFormation.codeNiveauDiplome,
        dateOuverture: dataFormation.dateOuverture,
        dateFermeture: dataFormation.dateFermeture,
        libelleFiliere: dataFormation.libelleFiliere,
        CPC: dataFormation.cpc,
        CPCSecteur: dataFormation.cpcSecteur,
        CPCSousSecteur: dataFormation.cpcSousSecteur,
      };
      await deps.createFormation(formation);
      return formation;
    }
);
