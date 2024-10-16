import { publicConfig } from "@/config.public";

export const feature = {
  etablissementQuadrant: publicConfig.env !== "production",
  panoramaFormation: publicConfig.env !== "production",
  correction: true,
  showColorationFilter: false,
  requetesSuggerees: false,
};
