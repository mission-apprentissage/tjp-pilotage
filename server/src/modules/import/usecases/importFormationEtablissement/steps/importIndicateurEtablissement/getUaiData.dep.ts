import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";

export const getUaiData = async ({ uai, millesime, voie }: { uai: string; millesime: string, voie: "scolaire" | "apprentissage" | "ensemble" }) => {
  return rawDataRepository.findRawData({
    type: "ij_uai_data",
    filter: { uai, millesime, voie,  },
  });
};
