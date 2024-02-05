import { rawDataRepository } from "../../repositories/rawData.repository";

export const findUAIsApprentissage = ({ cfd }: { cfd: string }) => {
  return rawDataRepository
    .findRawData({
      type: "offres_apprentissages",
      filter: {
        "Code du diplome ou du titre suivant la nomenclature de l'Education nationale (CodeEN)":
          cfd,
      },
    })
    .then((rawData) => {
      if (!rawData) return;
      if (rawData["UAI formation"]) return rawData["UAI formation"];
      if (rawData["UAI formateur"]) return rawData["UAI formateur"];
      if (rawData["UAI Responsable"]) return rawData["UAI Responsable"];
    });
};
