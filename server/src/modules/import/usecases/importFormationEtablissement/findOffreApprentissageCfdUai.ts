import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";

export const findOffreApprentissageCfdUai = async ({ cfd, uai }: { cfd: string, uai: string }) => {
  return await rawDataRepository
    .findRawDatas({
      type: "offres_apprentissage",
      filter: {
        "Formation: code CFD": cfd,
      },
    })
    .then((rawDatas) => {
      if (!rawDatas || !rawDatas.length) return;
      return rawDatas
        .filter((rawData) => {
          if (rawData["Lieu: UAI"] === uai) return true;
          if (rawData["Formateur: UAI"] === uai) return true;
          return rawData["Responsable: UAI"] === uai;
        });
    });
};
