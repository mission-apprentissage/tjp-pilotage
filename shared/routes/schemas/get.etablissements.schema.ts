import { z } from "zod";

import { TypeFormationSpecifiqueZodType } from "../../enum/formationSpecifiqueEnum";
import {OrderZodType} from '../../enum/orderEnum';
import { PositionQuadrantZodType } from "../../enum/positionQuadrantEnum";
import { SecteurZodType } from "../../enum/secteurEnum";
import {TypeFamilleZodType} from '../../enum/typeFamilleEnum';
import { FormationSpecifiqueFlagsSchema } from "../../schema/formationSpecifiqueFlagsSchema";
import { OptionSchema } from "../../schema/optionSchema";

const FormationEtablissementLineSchema = z.object({
  libelleEtablissement: z.string().optional(),
  uai: z.string(),
  rentreeScolaire: z.string().optional(),
  secteur: z.string().optional(),
  commune: z.string().optional(),
  codeDepartement: z.string().optional(),
  libelleDepartement: z.string().optional(),
  codeAcademie: z.string().optional(),
  libelleAcademie: z.string().optional(),
  codeRegion: z.string().optional(),
  libelleRegion: z.string().optional(),
  cfd: z.string(),
  libelleFormation: z.string(),
  formationSpecifique: FormationSpecifiqueFlagsSchema,
  codeNiveauDiplome: z.string(),
  libelleFamille: z.string().optional(),
  codeDispositif: z.string().optional(),
  libelleDispositif: z.string().optional(),
  libelleNiveauDiplome: z.string().optional(),
  anneeDebut: z.coerce.number().optional(),
  premiersVoeux: z.coerce.number().optional(),
  capacite: z.coerce.number().optional(),
  effectifEntree: z.coerce.number().optional(),
  effectif1: z.coerce.number().optional(),
  effectif2: z.coerce.number().optional(),
  effectif3: z.coerce.number().optional(),
  tauxPression: z.coerce.number().optional(),
  tauxDemande: z.coerce.number().optional(),
  tauxRemplissage: z.coerce.number().optional(),
  tauxPoursuite: z.coerce.number().optional(),
  tauxInsertion: z.coerce.number().optional(),
  positionQuadrant: z.string().optional(),
  tauxDevenirFavorable: z.coerce.number().optional(),
  tauxPoursuiteEtablissement: z.number().optional(),
  tauxInsertionEtablissement: z.number().optional(),
  tauxDevenirFavorableEtablissement: z.number().optional(),
  evolutionTauxSortie: z.array(
    z.object({
      millesimeSortie: z.string(),
      tauxInsertion: z.coerce.number().optional(),
      tauxPoursuite: z.coerce.number().optional(),
      tauxDevenirFavorable: z.coerce.number().optional(),
    })
  ),
  evolutionTauxSortieEtablissement: z.array(
    z.object({
      millesimeSortie: z.string(),
      tauxInsertion: z.coerce.number().optional(),
      tauxPoursuite: z.coerce.number().optional(),
      tauxDevenirFavorable: z.coerce.number().optional(),
    })
  ),
  evolutionTauxEntree: z.array(
    z.object({
      rentreeScolaire: z.string(),
      tauxDemande: z.coerce.number().optional(),
      tauxPression: z.coerce.number().optional(),
      tauxRemplissage: z.coerce.number().optional(),
      capacite: z.coerce.number().optional(),
      effectif: z.coerce.number().optional()
    })
  ),
  evolutionPositionQuadrant: z.array(
    z.object({
      millesimeSortie: z.string(),
      positionQuadrant: z.string().optional(),
    })
  ),
  valeurAjoutee: z.coerce.number().optional(),
  cpc: z.string().optional(),
  cpcSecteur: z.string().optional(),
  libelleNsf: z.string().optional(),
  continuum: z
    .object({
      cfd: z.string(),
      libelleFormation: z.string().optional(),
    })
    .optional(),
  continuumEtablissement: z
    .object({
      cfd: z.string(),
      libelleFormation: z.string().optional(),
    })
    .optional(),
  typeFamille: TypeFamilleZodType.optional(),
  isHistoriqueCoExistant: z.coerce.boolean().optional(),
  // CFD de l'éventuelle formation renovant la formation actuelle
  formationRenovee: z.string().optional(),
  // Flag indiquant si la formation est renovée
  isFormationRenovee: z.coerce.boolean().optional(),
  dateFermeture: z.string().optional(),
  // Caractéristiques de la transformation
  numero: z.string().optional(),
  typeDemande: z.string().optional(),
  dateEffetTransformation: z.string().optional(),
  differenceCapaciteApprentissage: z.string().optional(),
  differenceCapaciteScolaire: z.string().optional(),
  anneeCampagne: z.string().optional()
});

const FiltersSchema = z.object({
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
  formationSpecifique: z.array(TypeFormationSpecifiqueZodType).optional(),
  withAnneeCommune: z.string().optional(),
  search: z.string().optional(),
  dateEffetTransformation: z.array(z.string()).optional(),
  typeDemande: z.array(z.string()).optional(),
  order: OrderZodType.optional(),
  orderBy: FormationEtablissementLineSchema.keyof().optional(),
  offset: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export const getFormationEtablissementsSchema = {
  querystring: FiltersSchema,
  response: {
    200: z.object({
      count: z.coerce.number(),
      filters: z.object({
        regions: z.array(OptionSchema),
        academies: z.array(OptionSchema),
        departements: z.array(OptionSchema),
        communes: z.array(OptionSchema),
        diplomes: z.array(OptionSchema),
        dispositifs: z.array(OptionSchema),
        familles: z.array(OptionSchema),
        formations: z.array(OptionSchema),
        etablissements: z.array(OptionSchema),
        libellesNsf: z.array(OptionSchema),
        secteurs: z.array(OptionSchema),
        positionsQuadrant: z.array(OptionSchema),
        rentreesScolaires: z.array(OptionSchema),
        datesEffetTransformation: z.array(OptionSchema),
        typesDemande: z.array(OptionSchema),
      }),
      etablissements: z.array(FormationEtablissementLineSchema),
    }),
  },
};
