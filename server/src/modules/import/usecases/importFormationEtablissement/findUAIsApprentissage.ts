import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";

export const findUAIsApprentissage = async ({ cfd }: { cfd: string }) => {
  return rawDataRepository
    .findRawDatas({
      type: "offres_apprentissage",
      filter: {
        "Formation: code CFD": cfd,
      },
    })
    .then((rawDatas) => {
      if (!rawDatas || !rawDatas.length) return;
      return rawDatas
        .map((rawData) => {
          if (rawData["Lieu: UAI"]) return rawData["Lieu: UAI"];
          if (rawData["Formateur: UAI"]) return rawData["Formateur: UAI"];
          return rawData["Responsable: UAI"]!;
        })
        .filter((uai) => uai);
    });
};
