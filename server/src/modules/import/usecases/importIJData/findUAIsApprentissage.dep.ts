import { rawDataRepository } from "../../repositories/rawData.repository";

export const findUAIsApprentissage = ({ cfd }: { cfd: string }) => {
  return rawDataRepository
    .findRawDatas({
      type: "offres_apprentissage",
      filter: {
        "Code du diplome ou du titre suivant la nomenclature de l'Education nationale (CodeEN)":
          cfd,
      },
    })
    .then((rawDatas) => {
      if (!rawDatas || !rawDatas.length) return;
      return rawDatas
        .map((rawData) =>
          rawData["UAI formation"]
            ? rawData["UAI formation"]
            : rawData["UAI formateur"]
            ? rawData["UAI formateur"]
            : rawData["UAI Responsable"]
        )
        .filter((uai) => uai);
    });
};
