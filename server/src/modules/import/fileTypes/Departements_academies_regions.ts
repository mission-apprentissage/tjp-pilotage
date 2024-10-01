import { z } from "zod";

export const DepartementsAcademiesRegionsSchema = z.object({
  codeDepartement: z.string().optional(),
  libelleDepartement: z.string().optional(),
  codeAcademie: z.string(),
  libelleAcademie: z.string(),
  codeRegion: z.string(),
  libelleRegion: z.string(),
});

export type Departements_academies_regions = {
  codeDepartement?: string;
  libelleDepartement?: string;
  codeAcademie: string;
  libelleAcademie: string;
  codeRegion: string;
  libelleRegion: string;
};
