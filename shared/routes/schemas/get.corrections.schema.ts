import { z } from "zod";

import { DemandeStatutZodType } from "../../enum/demandeStatutEnum";
import { TypeFormationSpecifiqueZodType } from "../../enum/formationSpecifiqueEnum";
import { FormationSpecifiqueFlagsSchema } from "../../schema/formationSpecifiqueFlagsSchema";
import { OptionSchema } from "../../schema/optionSchema";

const CorrectionItem = z.object({
  intentionNumero: z.string().optional(),
  // Établissement
  libelleEtablissement: z.string().optional(),
  uai: z.string(),
  commune: z.string().optional(),
  codeRegion: z.string(),
  libelleRegion: z.string().optional(),
  codeAcademie: z.string().optional(),
  libelleAcademie: z.string().optional(),
  codeDepartement: z.string().optional(),
  libelleDepartement: z.string().optional(),
  secteur: z.string().optional(),
  // Formation
  libelleNsf: z.string().optional(),
  libelleFormation: z.string().optional(),
  formationSpecifique: FormationSpecifiqueFlagsSchema,
  niveauDiplome: z.string().optional(),
  libelleDispositif: z.string().optional(),
  codeDispositif: z.string(),
  cfd: z.string(),
  // Demande
  coloration: z.boolean().optional(),
  libelleColoration: z.string().optional(),
  commentaire: z.string().optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
  userName: z.string(),
  // Correction
  capaciteScolaireCorrigee: z.coerce.number().optional(),
  capaciteApprentissageCorrigee: z.coerce.number().optional(),
  ecartScolaire: z.coerce.number(),
  ecartApprentissage: z.coerce.number(),
  raisonCorrection: z.string().optional(),
  motifCorrection: z.string().optional(),
  autreMotifCorrection: z.string().optional(),
  // Devenir favorable de la formation
  positionQuadrant: z.string().optional(),
  tauxInsertionRegional: z.coerce.number().optional(),
  tauxPoursuiteRegional: z.coerce.number().optional(),
  tauxDevenirFavorableRegional: z.coerce.number().optional(),
  tauxPressionRegional: z.coerce.number().optional(),
  nbEtablissement: z.coerce.number().optional(),
});

const StatsCorrection = z.object({
  nbCorrections: z.coerce.number(),
  ecartScolaire: z.coerce.number(),
  ecartApprentissage: z.coerce.number(),
  nbReports: z.coerce.number(),
  nbAnnulations: z.coerce.number(),
  nbModifications: z.coerce.number(),
});

export const FiltersSchema = z.object({
  codeRegion: z.array(z.string()).optional(),
  codeAcademie: z.array(z.string()).optional(),
  codeDepartement: z.array(z.string()).optional(),
  uai: z.array(z.string()).optional(),
  rentreeScolaire: z.string().optional(),
  typeDemande: z.array(z.string()).optional(),
  statut: z.array(DemandeStatutZodType.exclude(["supprimée"])).optional(),
  codeNiveauDiplome: z.array(z.string()).optional(),
  cfd: z.array(z.string()).optional(),
  codeNsf: z.array(z.string()).optional(),
  coloration: z.string().optional(),
  amiCMA: z.string().optional(),
  secteur: z.string().optional(),
  positionQuadrant: z.string().optional(),
  voie: z.enum(["scolaire", "apprentissage"]).optional(),
  campagne: z.string().optional(),
  formationSpecifique: z.array(TypeFormationSpecifiqueZodType).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: CorrectionItem.keyof().optional(),
  offset: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  search: z.string().optional(),
});

export const getCorrectionsSchema = {
  querystring: FiltersSchema,
  response: {
    200: z.object({
      count: z.coerce.number(),
      stats: StatsCorrection,
      corrections: z.array(CorrectionItem),
      filters: z.object({
        rentreesScolaires: z.array(OptionSchema),
        statuts: z.array(OptionSchema),
        regions: z.array(OptionSchema),
        academies: z.array(OptionSchema),
        departements: z.array(OptionSchema),
        etablissements: z.array(OptionSchema),
        typesDemande: z.array(OptionSchema),
        diplomes: z.array(OptionSchema),
        formations: z.array(OptionSchema),
        libellesNsf: z.array(OptionSchema),
        secteurs: z.array(OptionSchema),
        amiCMAs: z.array(OptionSchema),
        colorations: z.array(OptionSchema),
        voies: z.array(OptionSchema),
        campagnes: z.array(
          z.object({
            label: z.coerce.string(),
            value: z.coerce.string(),
            statut: z.coerce.string(),
          }),
        ),
      }),
    }),
  },
};
