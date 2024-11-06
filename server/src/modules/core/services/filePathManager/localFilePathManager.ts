import { FilePathManager } from "./filePathManager";

export const localFilePathManagerFactory = (): FilePathManager => {
  return {
    getIntentionFilePath: (id: string, filename: string = "") => {
      return `./public/upload/${id}/${filename}`;
    },
    getFranceTravailIndicateurTensionDepartementStatsFilePath: () => {
      return "./public/files/tension_departement_rome.csv";
    },
    getFranceTravailIndicateurTensionRegionStatsFilePath: () => {
      return "./public/files/tension_region_rome.csv";
    },
  };
};

export const localFilePathManager = localFilePathManagerFactory();
