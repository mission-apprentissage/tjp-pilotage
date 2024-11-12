import { PageRequeteEnregistreeZodType } from "shared/enum/pageRequeteEnregistreeEnum";
import { PositionQuadrantZodType } from "shared/enum/positionQuadrantEnum";
import { SecteurZodType } from "shared/enum/secteurEnum";
import { z } from "zod";

const FiltresFormationSchema = z.object({
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
  withEmptyFormations: z.coerce.boolean().optional(),
  withAnneeCommune: z.string().optional(),
  search: z.string().optional(),
});

const FiltresFormationEtablissementSchema = z.object({
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

export const submitRequeteEnregistreeSchema = {
  body: z.object({
    page: PageRequeteEnregistreeZodType,
    nom: z.string(),
    couleur: z.string(),
    filtres: z.union([
      FiltresFormationSchema,
      FiltresFormationEtablissementSchema,
    ]),
  }),
  response: {
    200: z.object({
      id: z.string(),
      userId: z.string(),
    }),
  },
};
