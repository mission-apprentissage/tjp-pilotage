import { z } from "zod";

import { DemandeStatutZodType } from "../../enum/demandeStatutEnum";
import { OptionSchema } from "../../schema/optionSchema";

const UserSchema = z.object({
  fullname: z.string().optional(),
  id: z.string().optional(),
  role: z.string().optional(),
});

const DemandeItem = z.object({
  // Formation
  libelleFormation: z.string().optional(),
  libelleEtablissement: z.string().optional(),
  codeDepartement: z.string().optional(),
  libelleDepartement: z.string().optional(),
  codeAcademie: z.string().optional(),
  libelleAcademie: z.string().optional(),
  codeRegion: z.string(),
  libelleRegion: z.string().optional(),
  libelleDispositif: z.string().optional(),
  uai: z.string().optional(),
  cfd: z.string().optional(),
  codeDispositif: z.string().optional(),
  libelleFCIL: z.string().optional(),
  // Type de demande
  rentreeScolaire: z.coerce.number().optional(),
  typeDemande: z.string().optional(),
  coloration: z.boolean().optional(),
  libelleColoration: z.string().optional(),
  // Capacités
  mixte: z.boolean().optional(),
  capaciteScolaireActuelle: z.coerce.number().optional(),
  capaciteScolaire: z.coerce.number().optional(),
  capaciteScolaireColoreeActuelle: z.coerce.number().optional(),
  capaciteScolaireColoree: z.coerce.number().optional(),
  capaciteApprentissageActuelle: z.coerce.number().optional(),
  capaciteApprentissage: z.coerce.number().optional(),
  capaciteApprentissageColoreeActuelle: z.coerce.number().optional(),
  capaciteApprentissageColoree: z.coerce.number().optional(),
  // Compensation
  compensationCfd: z.string().optional(),
  compensationCodeDispositif: z.string().optional(),
  compensationUai: z.string().optional(),
  compensationRentreeScolaire: z.coerce.number().optional(),
  numeroCompensation: z.string().optional(),
  typeCompensation: z.string().optional(),
  // Précisions
  motif: z.array(z.string()).optional(),
  autreMotif: z.string().optional(),
  amiCma: z.boolean().optional(),
  amiCmaValide: z.boolean().optional(),
  amiCmaValideAnnee: z.string().optional(),
  amiCmaEnCoursValidation: z.boolean().optional(),
  poursuitePedagogique: z.boolean().optional(),
  // RH
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
  // Observations / commentaires
  commentaire: z.string().optional(),
  // Statut
  statut: DemandeStatutZodType.exclude(["supprimée"]),
  // Autre
  numero: z.string(),
  campagneId: z.string(),
  userName: z.string().optional(),
  numeroDemandeImportee: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: UserSchema,
  updatedBy: UserSchema.optional(),
  suiviId: z.string().optional(),
  canEdit: z.boolean(),
  correction: z.string().optional(),
  alreadyAccessed: z.boolean(),
});

export const getDemandesSchema = {
  querystring: z.object({
    statut: z.union([DemandeStatutZodType.exclude(["supprimée"]), z.literal("suivies")]).optional(),
    search: z.string().optional(),
    suivies: z.coerce.boolean().optional(),
    order: z.enum(["asc", "desc"]).optional(),
    orderBy: DemandeItem.keyof().optional(),
    offset: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    campagne: z.string().optional(),
    codeAcademie: z.array(z.string()).optional(),
    codeNiveauDiplome: z.array(z.string()).optional(),
  }),
  response: {
    200: z.object({
      count: z.coerce.number(),
      demandes: z.array(DemandeItem),
      campagnes: z.array(
        z.object({
          annee: z.string(),
          statut: z.string(),
        })
      ),
      currentCampagne: z.object({
        annee: z.string(),
        statut: z.string(),
        id: z.string(),
      }),
      campagne: z.object({
        annee: z.string(),
        statut: z.string(),
        id: z.string(),
      }),
      filters: z.object({
        academies: z.array(OptionSchema),
        diplomes: z.array(OptionSchema),
      }),
    }),
  },
};
