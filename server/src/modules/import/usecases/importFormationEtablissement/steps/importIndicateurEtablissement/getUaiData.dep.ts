import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";

export const getUaiData = async ({ uai, millesime }: { uai: string; millesime: string }) => {
  return rawDataRepository.findRawData({
    type: "ij",
    //@ts-ignore
    filter: { uai, millesime },
  });
};
