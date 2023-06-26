import { rawDataRepository } from "../../../../repositories/rawData.repository";

export const findNFormationDiplome = ({ cfd }: { cfd: string }) => {
  return rawDataRepository.findRawData({
    type: "nFormationDiplome_",
    filter: { FORMATION_DIPLOME: cfd },
  });
};
