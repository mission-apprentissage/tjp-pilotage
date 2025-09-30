import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";

export const getUaiData = async ({ uai, millesime, voie, cfd, mefstat }: { uai: string; millesime: string, voie: "scolaire" | "apprentissage", cfd?: string, mefstat?:string }) => {
  return rawDataRepository.findRawData({
    type: "ij_uai_data",
    filter: { uai, millesime, voie, cfd, mefstat },
  });
};
