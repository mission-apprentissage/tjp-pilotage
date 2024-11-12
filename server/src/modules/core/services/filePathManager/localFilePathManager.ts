import { FilePathManager } from "./filePathManager";

export const localFilePathManagerFactory = (): FilePathManager => {
  return {
    getIntentionFilePath: (id: string, filename: string = "") => {
      return `./public/upload/${id}/${filename}`;
    },
    getFranceTravailIndicateurTensionDepartementStatsFilePath: () => {
      return "./public/files/tension_rome_departement.csv";
    },
    getFranceTravailIndicateurTensionRegionStatsFilePath: () => {
      return "./public/files/tension_rome_region.csv";
    },
    getFranceTravailIndicateurTensionStatsFilePath: () => {
      return "./public/files/tension_rome.csv";
    },
  };
};

export const localFilePathManager = localFilePathManagerFactory();
