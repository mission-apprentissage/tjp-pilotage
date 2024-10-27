import type { FilePathManager } from "./filePathManager";

export const localFilePathManagerFactory = (): FilePathManager => {
  return {
    getIntentionFilePath: (id: string, filename: string = "") => {
      return `./public/upload/${id}/${filename}`;
    },
    getFranceTravailIndicateurTensionStatsFilePath: () => {
      return "./public/files/tension_departement_rome.csv";
    },
  };
};

export const localFilePathManager = localFilePathManagerFactory();
