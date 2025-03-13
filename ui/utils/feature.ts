import { publicConfig } from "@/config.public";

export const feature = {
  saisieDisabled: false,
  etablissementQuadrant: publicConfig.env !== "production",
  correction: true,
  showColorationFilter: true,
  requetesSuggerees: true,
  formationsSpecifiqueConsole: false,
};
