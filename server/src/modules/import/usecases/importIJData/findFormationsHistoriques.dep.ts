import type { NFormationDiplomeLine } from "@/modules/import/fileTypes/NFormationDiplome";
import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";
import { inject } from "@/utils/inject";

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

export const [findFormationsHistoriques] = inject(
  {
    findRawData: rawDataRepository.findRawData,
  },
  (deps) =>
    async ({ cfd }: { cfd: string }) => {
      const formationData = await deps.findRawData({
        type: "nFormationDiplome_",
        filter: { FORMATION_DIPLOME: cfd },
      });
      if (!formationData) return;

      return toAncienCfds({ formationData });
    }
);
