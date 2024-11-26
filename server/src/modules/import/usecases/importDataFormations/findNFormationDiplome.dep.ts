import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";

export const findNFormationDiplome = async ({ cfd }: { cfd: string }) => {
  return rawDataRepository.findRawData({
    type: "nFormationDiplome_",
    filter: { FORMATION_DIPLOME: cfd },
  });
};
