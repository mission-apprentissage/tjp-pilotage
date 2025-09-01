import { publicConfig } from "@/config.public";

export const feature = {
  saisieDisabled: false,
  etablissementQuadrant: publicConfig.env !== "production",
  correction: false,
  showColorationFilter: false,
  requetesSuggerees: true,
  formationsSpecifiqueConsole: false,
  donneesTransfoConsole: true,
  donneesEvolutionTauxConsole: true
};
