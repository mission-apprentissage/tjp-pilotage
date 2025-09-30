import type { FilePathManager } from "./filePathManager";

export const localFilePathManagerFactory = (): FilePathManager => {
  return {
    getLegacyIntentionFilePath: (_id: string, _filename: string = "") => {
      return "";
    },
    getDemandeFilePath: (id: string, filename: string = "") => {
      return `./public/upload/${id}/${filename}`;
    },
    getFranceTravailIndicateurTensionDepartementStatsFilePath: () => {
      return "./static/files/tension_rome_departement.csv";
    },
    getFranceTravailIndicateurTensionRegionStatsFilePath: () => {
      return "./static/files/tension_rome_region.csv";
    },
    getFranceTravailIndicateurTensionStatsFilePath: () => {
      return "./static/files/tension_rome.csv";
    },
    getIJRegionDataFilePath: () => {
      return `./static/files/ij_region_data.csv`;
    },
    getIJUaiDataFilePath: () => {
      return `./static/files/ij_uai_data.csv`;
    },
  };
};

export const localFilePathManager = localFilePathManagerFactory();
