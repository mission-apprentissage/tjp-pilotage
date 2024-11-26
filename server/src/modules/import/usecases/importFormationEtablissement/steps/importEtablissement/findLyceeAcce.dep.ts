import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";

export const findLyceeACCE = async ({ uai }: { uai: string }) => {
  return rawDataRepository.findRawData({
    type: "lyceesACCE",
    filter: { numero_uai: uai },
  });
};
