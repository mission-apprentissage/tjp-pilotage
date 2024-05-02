import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

const OptionSchema = z.object({
  label: z.coerce.string(),
  value: z.coerce.string(),
});

const DemandeSchema = z.object({
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
  // Formation
  libelleNsf: z.string().optional(),
  libelleFormation: z.string().optional(),
  niveauDiplome: z.string().optional(),
  libelleDispositif: z.string().optional(),
  codeDispositif: z.string(),
  cfd: z.string(),
  // Demande
  typeDemande: z.string(),
  motif: z.array(z.string()),
  autreMotif: z.string().optional(),
  rentreeScolaire: z.coerce.number(),
  differenceCapaciteScolaire: z.coerce.number().optional(),
  capaciteScolaireActuelle: z.coerce.number().optional(),
  capaciteScolaire: z.coerce.number().optional(),
  capaciteScolaireColoree: z.coerce.number().optional(),
  differenceCapaciteApprentissage: z.coerce.number().optional(),
  capaciteApprentissageActuelle: z.coerce.number().optional(),
  capaciteApprentissage: z.coerce.number().optional(),
  capaciteApprentissageColoree: z.coerce.number().optional(),
  coloration: z.boolean(),
  libelleColoration: z.string().optional(),
  libelleFCIL: z.string().optional(),
  amiCma: z.boolean(),
  amiCmaValide: z.boolean().optional(),
  amiCmaValideAnnee: z.string().optional(),
  amiCmaEnCoursValidation: z.boolean().optional(),
  partenairesEconomiquesImpliques: z.boolean().optional(),
  partenaireEconomique1: z.string().optional(),
  partenaireEconomique2: z.string().optional(),
  cmqImplique: z.boolean().optional(),
  filiereCmq: z.string().optional(),
  nomCmq: z.string().optional(),
  commentaire: z.string().optional(),
  numero: z.string(),
  // Devenir favorable de la formation
  positionQuadrant: z.string().optional(),
  tauxInsertionRegional: z.coerce.number().optional(),
  tauxPoursuiteRegional: z.coerce.number().optional(),
  tauxDevenirFavorableRegional: z.coerce.number().optional(),
  tauxPressionRegional: z.coerce.number().optional(),
  nbEtablissement: z.coerce.number().optional(),
  //RH
  nbRecrutementRH: z.coerce.number().optional(),
  discipline1RecrutementRH: z.string().optional(),
  discipline2RecrutementRH: z.string().optional(),
  nbReconversionRH: z.coerce.number().optional(),
  discipline1ReconversionRH: z.string().optional(),
  discipline2ReconversionRH: z.string().optional(),
  nbProfesseurAssocieRH: z.coerce.number().optional(),
  discipline1ProfesseurAssocieRH: z.string().optional(),
  discipline2ProfesseurAssocieRH: z.string().optional(),
  nbFormationRH: z.coerce.number().optional(),
  discipline1FormationRH: z.string().optional(),
  discipline2FormationRH: z.string().optional(),
  besoinRHPrecisions: z.string().optional(),
  // Travaux et équipements
  travauxAmenagement: z.boolean().optional(),
  travauxAmenagementDescription: z.string().optional(),
  achatEquipement: z.boolean().optional(),
  achatEquipementDescription: z.string().optional(),
  // Internat et restauration
  augmentationCapaciteAccueilHebergement: z.boolean().optional(),
  augmentationCapaciteAccueilHebergementPlaces: z.coerce.number().optional(),
  augmentationCapaciteAccueilHebergementPrecisions: z.string().optional(),
  augmentationCapaciteAccueilRestauration: z.boolean().optional(),
  augmentationCapaciteAccueilRestaurationPlaces: z.coerce.number().optional(),
  augmentationCapaciteAccueilRestaurationPrecisions: z.string().optional(),
  // Statut demande
  statut: z.string(),
  motifRefus: z.array(z.string()).optional(),
  autreMotifRefus: z.string().optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
  campagneId: z.string(),
});

export const FiltersSchema = z.object({
  codeRegion: z.array(z.string()).optional(),
  codeAcademie: z.array(z.string()).optional(),
  codeDepartement: z.array(z.string()).optional(),
  uai: z.array(z.string()).optional(),
  rentreeScolaire: z.string().optional(),
  typeDemande: z.array(z.string()).optional(),
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
  codeNsf: z.array(z.string()).optional(),
  coloration: z.string().optional(),
  amiCMA: z.string().optional(),
  secteur: z.string().optional(),
  positionQuadrant: z.string().optional(),
  voie: z.enum(["scolaire", "apprentissage"]).optional(),
  campagne: z.string().optional(),
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
          })
        ),
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
