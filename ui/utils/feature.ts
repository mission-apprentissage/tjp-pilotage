import { publicConfig } from "@/config.public";

export const feature = {
  saisieDisabled: false,
  etablissementQuadrant: publicConfig.env !== "production",
  correction: true,
  newCorrection: false,
  showColorationFilter: false,
  requetesSuggerees: true,
  formationsSpecifiqueConsole: false,
};
