import { publicConfig } from "@/config.public";

export const feature = {
  etablissementQuadrant: publicConfig.env !== "production",
  correction: true,
  showColorationFilter: false,
  requetesSuggerees: true,
  formationsSpecifiqueConsole: false,
};
