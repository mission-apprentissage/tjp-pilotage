// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";

import type { NFormationDiplomeLine } from "@/modules/import/fileTypes/NFormationDiplome";
import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";

import { createFormationHistorique } from "./createFormationHistorique.dep";
import { findDataFormation } from "./findDataFormation.dep";

const ancienDiplomeFields = [
  "ANCIEN_DIPLOME_1",
  "ANCIEN_DIPLOME_2",
  "ANCIEN_DIPLOME_3",
  "ANCIEN_DIPLOME_4",
  "ANCIEN_DIPLOME_5",
  "ANCIEN_DIPLOME_6",
  "ANCIEN_DIPLOME_7",
] as const;

const toAncienCfds = ({ formationData }: { formationData: NFormationDiplomeLine }) =>
  ancienDiplomeFields.map((field) => formationData[field]).filter((item): item is string => !!item);

const isOldFormation = (dateFermeture: Date | undefined) => {
  return dateFermeture && dateFermeture?.getFullYear() < 2018;
};

export const [importFormationHistorique] = inject(
  {
    createFormationHistorique,
    findRawData: rawDataRepository.findRawData,
    findDataFormation,
  },
  (deps) =>
    async ({ cfd, voie = "scolaire" }: { cfd: string; voie?: string }) => {
      const formationData = await deps.findRawData({
        type: "nFormationDiplome_",
        filter: { FORMATION_DIPLOME: cfd },
      });
      if (!formationData) return;

      const ancienCfds = toAncienCfds({ formationData });

      for (const ancienCfd of ancienCfds) {
        const dataFormation = await deps.findDataFormation(ancienCfd);
        if (!dataFormation?.dateOuverture) continue;
        const ancienneFormation = {
          nouveauCFD: cfd,
          codeFormationDiplome: ancienCfd,
          voie,
          libelleFormation: dataFormation.libelleFormation,
          codeNiveauDiplome: dataFormation.codeNiveauDiplome,
          dateOuverture: dataFormation.dateOuverture,
          dateFermeture: dataFormation.dateFermeture,
          libelleFiliere: dataFormation.libelleNsf,
          CPC: dataFormation.cpc,
          cpcSecteur: dataFormation.cpcSecteur,
          cpcSousSecteur: dataFormation.cpcSousSecteur,
        };

        if (isOldFormation(ancienneFormation.dateFermeture)) continue;
        await deps.createFormationHistorique(ancienneFormation);
      }

      return ancienCfds;
    }
);
