import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";

export const findUAIsApprentissage = async ({ cfd }: { cfd: string }) => {
  return rawDataRepository
    .findRawDatas({
      type: "offres_apprentissage",
      filter: {
        "Code du diplome ou du titre suivant la nomenclature de l'Education nationale (CodeEN)": cfd,
      },
    })
    .then((rawDatas) => {
      if (!rawDatas || !rawDatas.length) return;
      return rawDatas
        .map((rawData) => {
          if (rawData["UAI formation"]) return rawData["UAI formation"];
          if (rawData["UAI formateur"]) return rawData["UAI formateur"];
          return rawData["UAI Responsable"]!;
        })
        .filter((uai) => uai);
    });
};
