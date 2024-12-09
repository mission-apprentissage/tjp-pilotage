import { z } from "zod";

import { PageRequeteEnregistreeZodType } from "../../enum/pageRequeteEnregistreeEnum";
import { PositionQuadrantZodType } from "../../enum/positionQuadrantEnum";
import { SecteurZodType } from "../../enum/secteurEnum";

export const FiltresFormationSchema = z.object({
  cfd: z.array(z.string()).optional(),
  codeRegion: z.array(z.string()).optional(),
  codeAcademie: z.array(z.string()).optional(),
  codeDepartement: z.array(z.string()).optional(),
  commune: z.array(z.string()).optional(),
  codeNiveauDiplome: z.array(z.string()).optional(),
  codeDispositif: z.array(z.string()).optional(),
  cfdFamille: z.array(z.string()).optional(),
  rentreeScolaire: z.array(z.string()).optional(),
  codeNsf: z.array(z.string()).optional(),
  positionQuadrant: z.array(PositionQuadrantZodType).optional(),
  withEmptyFormations: z.string().optional(),
  withAnneeCommune: z.string().optional(),
  search: z.string().optional(),
});

export const FiltresFormationEtablissementSchema = z.object({
  cfd: z.array(z.string()).optional(),
  codeRegion: z.array(z.string()).optional(),
  codeAcademie: z.array(z.string()).optional(),
  codeDepartement: z.array(z.string()).optional(),
  commune: z.array(z.string()).optional(),
  codeNiveauDiplome: z.array(z.string()).optional(),
  codeDispositif: z.array(z.string()).optional(),
  cfdFamille: z.array(z.string()).optional(),
  rentreeScolaire: z.array(z.string()).optional(),
  secteur: z.array(SecteurZodType).optional(),
  uai: z.array(z.string()).optional(),
  codeNsf: z.array(z.string()).optional(),
  positionQuadrant: z.array(PositionQuadrantZodType).optional(),
  withAnneeCommune: z.string().optional(),
  search: z.string().optional(),
});

export const getRequetesEnregistreesSchema = {
  querystring: z.object({
    page: PageRequeteEnregistreeZodType,
  }),
  response: {
    200: z.array(
      z.object({
        id: z.string(),
        nom: z.string(),
        couleur: z.string(),
        userId: z.string(),
        filtres: z.union([FiltresFormationSchema, FiltresFormationEtablissementSchema]),
      })
    ),
  },
};
