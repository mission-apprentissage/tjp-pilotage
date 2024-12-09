import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";

export const findDiplomesProfessionnels = async ({ offset, limit }: { offset: number; limit: number }) => {
  return rawDataRepository.findRawDatas({
    type: "diplomesProfessionnels",
    offset,
    limit,
  });
};
