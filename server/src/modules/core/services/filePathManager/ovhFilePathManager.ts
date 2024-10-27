import type { FilePathManager } from "./filePathManager";

export const ovhFilePathManagerFactory = (): FilePathManager => {
  return {
    getIntentionFilePath: (id: string, filename: string = "") => {
      return `intentions/${id}/${filename}`;
    },
    getFranceTravailIndicateurTensionStatsFilePath: () => {
      return "files/tension_departement_rome.csv";
    },
  };
};

export const ovhFilePathManager = ovhFilePathManagerFactory();
