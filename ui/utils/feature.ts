import { publicConfig } from "@/config.public";

export const feature = {
  saisieDisabled: false,
  etablissementQuadrant: publicConfig.env !== "production",
  correction: true,
  showColorationFilter: false,
  requetesSuggerees: true,
  formationsSpecifiqueConsole: false,
  donneesTransfoConsole: true,
};
