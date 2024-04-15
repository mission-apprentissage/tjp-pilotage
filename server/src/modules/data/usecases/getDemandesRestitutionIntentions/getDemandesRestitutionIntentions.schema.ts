import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

const OptionSchema = z.object({
  label: z.coerce.string(),
  value: z.coerce.string(),
});

const DemandeSchema = z.object({
  numero: z.string(),
  cfd: z.string().optional(),
  libelleFormation: z.string().optional(),
  codeDispositif: z.string().optional(),
  libelleDispositif: z.string().optional(),
  niveauDiplome: z.string().optional(),
  uai: z.string().optional(),
  libelleEtablissement: z.string().optional(),
  commune: z.string().optional(),
  rentreeScolaire: z.coerce.number().optional(),
  typeDemande: z.string().optional(),
  motif: z.array(z.string()).optional(),
  autreMotif: z.string().optional(),
  coloration: z.boolean().optional(),
  libelleColoration: z.string().optional(),
  libelleFCIL: z.string().optional(),
  amiCma: z.boolean().optional(),
  poursuitePedagogique: z.boolean().optional(),
  commentaire: z.string().optional(),
  libelleNsf: z.string().optional(),
  statut: z.string(),
  codeRegion: z.string().optional(),
  libelleRegion: z.string().optional(),
  codeAcademie: z.string().optional(),
  libelleAcademie: z.string().optional(),
  codeDepartement: z.string().optional(),
  libelleDepartement: z.string().optional(),
  dateCreation: z.string(),
  dateModification: z.string(),
  numeroCompensation: z.string().optional(),
  compensationCfd: z.string().optional(),
  compensationCodeDispositif: z.string().optional(),
  compensationUai: z.string().optional(),
  differenceCapaciteScolaire: z.coerce.number().optional(),
  capaciteScolaireActuelle: z.coerce.number().optional(),
  capaciteScolaire: z.coerce.number().optional(),
  capaciteScolaireColoree: z.coerce.number().optional(),
  differenceCapaciteApprentissage: z.coerce.number().optional(),
  capaciteApprentissageActuelle: z.coerce.number().optional(),
  capaciteApprentissage: z.coerce.number().optional(),
  capaciteApprentissageColoree: z.coerce.number().optional(),
  tauxInsertion: z.coerce.number().optional(),
  tauxPoursuite: z.coerce.number().optional(),
  devenirFavorable: z.coerce.number().optional(),
  pression: z.coerce.number().optional(),
  nbEtablissement: z.coerce.number().optional(),
  positionQuadrant: z.string().optional(),
  tauxInsertionMoyen: z.coerce.number().optional(),
  tauxPoursuiteMoyen: z.coerce.number().optional(),
  voie: z.string().optional(),
  motifRefus: z.array(z.string()).optional(),
  autreMotifRefus: z.string().optional(),
  recrutementRH: z.boolean().optional(),
  nbRecrutementRH: z.coerce.number().optional(),
  discipline1RecrutementRH: z.string().optional(),
  discipline2RecrutementRH: z.string().optional(),
  reconversionRH: z.boolean().optional(),
  nbReconversionRH: z.coerce.number().optional(),
  discipline1ReconversionRH: z.string().optional(),
  discipline2ReconversionRH: z.string().optional(),
  professeurAssocieRH: z.boolean().optional(),
  nbProfesseurAssocieRH: z.coerce.number().optional(),
  discipline1ProfesseurAssocieRH: z.string().optional(),
  discipline2ProfesseurAssocieRH: z.string().optional(),
  formationRH: z.boolean().optional(),
  nbFormationRH: z.coerce.number().optional(),
  discipline1FormationRH: z.string().optional(),
  discipline2FormationRH: z.string().optional(),
});

export const FiltersSchema = z.object({
  codeRegion: z.array(z.string()).optional(),
  codeAcademie: z.array(z.string()).optional(),
  codeDepartement: z.array(z.string()).optional(),
  commune: z.array(z.string()).optional(),
  uai: z.array(z.string()).optional(),
  rentreeScolaire: z.string().optional(),
  typeDemande: z.array(z.string()).optional(),
  motif: z.array(z.string()).optional(),
  statut: z
    .array(
      z.enum([
        DemandeStatutEnum.draft,
        DemandeStatutEnum.submitted,
        DemandeStatutEnum.refused,
      ])
    )
    .optional(),
  codeNiveauDiplome: z.array(z.string()).optional(),
  cfd: z.array(z.string()).optional(),
  dispositif: z.array(z.string()).optional(),
  CPC: z.array(z.string()).optional(),
  codeNsf: z.array(z.string()).optional(),
  cfdFamille: z.array(z.string()).optional(),
  coloration: z.string().optional(),
  amiCMA: z.string().optional(),
  secteur: z.string().optional(),
  compensation: z.string().optional(),
  positionQuadrant: z.string().optional(),
  voie: z.enum(["scolaire", "apprentissage"]).optional(),
  anneeCampagne: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: DemandeSchema.keyof().optional(),
  offset: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export const getDemandesRestitutionIntentionsSchema = {
  querystring: FiltersSchema,
  response: {
    200: z.object({
      filters: z.object({
        rentreesScolaires: z.array(OptionSchema),
        statuts: z.array(OptionSchema),
        regions: z.array(OptionSchema),
        academies: z.array(OptionSchema),
        departements: z.array(OptionSchema),
        communes: z.array(OptionSchema),
        etablissements: z.array(OptionSchema),
        typesDemande: z.array(OptionSchema),
        motifs: z.array(OptionSchema),
        diplomes: z.array(OptionSchema),
        formations: z.array(OptionSchema),
        CPCs: z.array(OptionSchema),
        libellesNsf: z.array(OptionSchema),
        familles: z.array(OptionSchema),
        dispositifs: z.array(OptionSchema),
        secteurs: z.array(OptionSchema),
        amiCMAs: z.array(OptionSchema),
        colorations: z.array(OptionSchema),
        compensations: z.array(OptionSchema),
        voies: z.array(OptionSchema),
        campagnes: z.array(OptionSchema),
      }),
      demandes: z.array(DemandeSchema),
      campagne: z.object({
        annee: z.string(),
        statut: z.string(),
      }),
      count: z.coerce.number(),
    }),
  },
};
