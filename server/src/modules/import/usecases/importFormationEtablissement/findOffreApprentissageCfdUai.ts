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
          if (rawData["Lieu: UAI"]) {
            if (rawData["Lieu: UAI"] === uai) return true;
            return false;
          }

          if (rawData["Formateur: UAI"]) {
            if (rawData["Formateur: UAI"] === uai) return true;
            return false;
          }

          return rawData["Responsable: UAI"] === uai;
        });
    });
};
